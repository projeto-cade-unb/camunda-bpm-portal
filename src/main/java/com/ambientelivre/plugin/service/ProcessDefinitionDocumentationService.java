package com.ambientelivre.plugin.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.BaseElement;
import org.camunda.bpm.model.bpmn.instance.Documentation;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.Process;

import com.ambientelivre.plugin.ProcessDefinitionDocumentation;
import com.ambientelivre.plugin.ProcessDefinitionDocumentationElement;
import com.ambientelivre.plugin.utils.BpmnXmlNamespaceUri;

@ApplicationScoped
public class ProcessDefinitionDocumentationService extends AbstractCockpitPluginResource {
    public ProcessDefinitionDocumentationService(String engineName) {
        super(engineName);
    }

    public List<ProcessDefinitionDocumentation> findManyProcessDefinitionDocumentation() {
        return getProcessEngine().getRepositoryService().createProcessDefinitionQuery()
                .latestVersion()
                .list()
                .stream()
                .map(this::createProcessDefinitionDocumentation)
                .collect(Collectors.toList());
    }

    public ProcessDefinitionDocumentation findOneProcessDefinitionDocumentation(String processDefinitionKey) {
        return createProcessDefinitionDocumentation( getProcessEngine().getRepositoryService()
                .createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .latestVersion()
                .singleResult());
    }

    private ProcessDefinitionDocumentation createProcessDefinitionDocumentation(ProcessDefinition processDefinition) {
        InputStream bpmnXmlFile = getProcessEngine().getRepositoryService().getProcessModel(processDefinition.getId());
        BpmnModelInstance modelInstance = Bpmn.readModelFromStream(bpmnXmlFile);

        List<ProcessDefinitionDocumentationElement> documentationList = extractDocumentation(modelInstance);
        String bpmnXmlText = Bpmn.convertToString(modelInstance);

        try {
            bpmnXmlFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ProcessDefinitionDocumentation(
                processDefinition.getKey(),
                processDefinition.getName(),
                bpmnXmlText,
                documentationList);
    }

    private List<ProcessDefinitionDocumentationElement> extractDocumentation(BpmnModelInstance modelInstance) {
        List<ProcessDefinitionDocumentationElement> documentationList = new ArrayList<>();

        ProcessDefinitionDocumentationElement processDoc = modelInstance
                .getModelElementsByType(Process.class)
                .stream()
                .map(this::createDocumentation)
                .findFirst()
                .orElse(null);

        if (processDoc != null) {
            documentationList.add(processDoc);
        }

        documentationList.addAll(
                modelInstance
                        .getModelElementsByType(FlowNode.class)
                        .stream()
                        .map(this::createDocumentation)
                        .collect(Collectors.toList()));

        return documentationList;
    }

    private ProcessDefinitionDocumentationElement createDocumentation(FlowNode flowNode) {
        return new ProcessDefinitionDocumentationElement(
                flowNode.getId(),
                flowNode.getName(),
                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "assignee"),
                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "candidateGroups"),
                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "dueDate"),
                getDocumentation(flowNode),
                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.DOCUMENTATION, "extendedDocumentation"));
    }

    // TODO: fix duplicated method
    private ProcessDefinitionDocumentationElement createDocumentation(Process process) {
        return new ProcessDefinitionDocumentationElement(
                process.getId(),
                process.getName(),
                process.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "assignee"),
                process.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "candidateGroups"),
                process.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "dueDate"),
                getDocumentation(process),
                process.getAttributeValueNs(BpmnXmlNamespaceUri.DOCUMENTATION, "extendedDocumentation"));
    }

    private String getDocumentation(BaseElement baseElement) {
        Documentation doc = baseElement.getDocumentations()
                .stream()
                .findFirst()
                .orElse(null);
        return doc != null ? doc.getTextContent() : "";
    }
}

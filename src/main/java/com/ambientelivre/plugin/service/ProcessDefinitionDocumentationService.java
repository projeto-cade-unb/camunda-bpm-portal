package com.ambientelivre.plugin.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.BaseElement;
import org.camunda.bpm.model.bpmn.instance.Documentation;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.Process;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambientelivre.plugin.ProcessDefinitionDocumentation;
import com.ambientelivre.plugin.ProcessDefinitionDocumentationElement;
import com.ambientelivre.plugin.utils.BpmnXmlNamespaceUri;

@Service
public class ProcessDefinitionDocumentationService {
    @Autowired
    private RepositoryService repositoryService;

    public List<ProcessDefinitionDocumentation> findManyProcessDefinitionDocumentation() {
        return repositoryService.createProcessDefinitionQuery()
                .latestVersion()
                .list()
                .stream()
                .map(processDefinition -> findOneProcessDefinitionDocumentation(
                        processDefinition.getKey()))
                .collect(Collectors.toList());
    }

    public ProcessDefinitionDocumentation findOneProcessDefinitionDocumentation(String processDefinitionKey) {
        try {
            ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                    .processDefinitionKey(processDefinitionKey).latestVersion().singleResult();

            InputStream bpmnXmlFile = repositoryService.getProcessModel(processDefinition.getId());

            BpmnModelInstance modelInstance = Bpmn.readModelFromStream(bpmnXmlFile);

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
                            .filter(doc -> doc != null)
                            .collect(Collectors.toList()));

            String bpmnXmlText = Bpmn.convertToString(modelInstance);

            bpmnXmlFile.close();

            return new ProcessDefinitionDocumentation(
                    processDefinition.getKey(),
                    processDefinition.getName(),
                    bpmnXmlText,
                    documentationList);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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

    private String getDocumentation(BaseElement flowNode) {
        Documentation doc = flowNode.getDocumentations().stream().findFirst().orElse(null);
        return doc != null ? doc.getTextContent() : "";
    }
}

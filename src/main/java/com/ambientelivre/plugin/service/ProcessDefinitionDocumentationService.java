package com.ambientelivre.plugin.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.authorization.Authorization;
import org.camunda.bpm.engine.impl.identity.Authentication;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.repository.ProcessDefinitionQuery;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.BaseElement;
import org.camunda.bpm.model.bpmn.instance.Documentation;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.Process;

import com.ambientelivre.plugin.documentation.ProcessDefinitionDocumentation;
import com.ambientelivre.plugin.documentation.ProcessDefinitionDocumentationElement;
import com.ambientelivre.plugin.dto.ProcessDefinitionDocumentationAuthorizationDto;
import com.ambientelivre.plugin.utils.BpmnXmlNamespaceUri;

public class ProcessDefinitionDocumentationService extends AbstractCockpitPluginResource {
        private final ProcessDefinitionAuthorizationService processDefinitionAuthorizationService;

        public ProcessDefinitionDocumentationService(String engineName) {
            super(engineName);
            processDefinitionAuthorizationService = new ProcessDefinitionAuthorizationService(engineName);
        }

        public ProcessDefinitionDocumentationAuthorizationDto findManyProcessDefinitionDocumentation(
                        String processDefinitionKey) {
                ProcessDefinitionQuery query = getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion();

                if (processDefinitionKey != null && !processDefinitionKey.isBlank()) {
                        query.processDefinitionKey(processDefinitionKey);
                }

                return new ProcessDefinitionDocumentationAuthorizationDto(
                                processDefinitionAuthorizationService.hasEditablePermission(),
                                processDefinitionsToDocumentation(query.list()));
        }

        public List<ProcessDefinitionDocumentation> processDefinitionsToDocumentation(
                        List<ProcessDefinition> processDefinitions) {
                Authentication currentAuthentication = getCurrentAuthentication();
                String currentUserId = currentAuthentication != null ? currentAuthentication.getUserId() : null;
                boolean isAuthenticated = currentUserId != null && !currentUserId.isBlank();

                if (!isAuthenticated) {
                        return getUnauthenticatedProcessDefinitions(processDefinitions);
                }

                return getAuthenticatedProcessDefinitions(processDefinitions);
        }

        private List<ProcessDefinitionDocumentation> getUnauthenticatedProcessDefinitions(
                        List<ProcessDefinition> processDefinitions) {
                List<String> authorizedResourceIds = processDefinitionAuthorizationService
                                .getAuthorizedResourceIds(processDefinitions);

                if (!authorizedResourceIds.isEmpty()) {
                        return getProcessDefinitionDocumentations(authorizedResourceIds);
                }

                return List.of();
        }

        private List<ProcessDefinitionDocumentation> getAuthenticatedProcessDefinitions(
                        List<ProcessDefinition> processDefinitions) {
                return getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion()
                                .startablePermissionCheck()
                                .processDefinitionKeysIn(processDefinitions.stream().map(ProcessDefinition::getKey)
                                                .toArray(String[]::new))
                                .list()
                                .stream()
                                .map(this::createProcessDefinitionDocumentation)
                                .collect(Collectors.toList());
        }

        private List<ProcessDefinitionDocumentation> getProcessDefinitionDocumentations(
                        List<String> authorizedResourceIds) {
                return getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion()
                                .processDefinitionKeysIn(authorizedResourceIds.toArray(new String[0]))
                                .list()
                                .stream()
                                .map(this::createProcessDefinitionDocumentation)
                                .collect(Collectors.toList());
        }

        private ProcessDefinitionDocumentation createProcessDefinitionDocumentation(
                        ProcessDefinition processDefinition) {
                BpmnModelInstance modelInstance = getBpmnModelInstance(processDefinition);
                List<ProcessDefinitionDocumentationElement> documentationList = extractDocumentation(modelInstance);
                String bpmnXmlText = Bpmn.convertToString(modelInstance);

                Optional<Authorization> editable = processDefinitionAuthorizationService
                                .findEditableAuthorization(processDefinition);

                return new ProcessDefinitionDocumentation(
                                processDefinition.getKey(),
                                processDefinition.getName(),
                                bpmnXmlText,
                                editable.isPresent(),
                                editable.map(Authorization::getId).orElse(null),
                                documentationList);
        }

        private BpmnModelInstance getBpmnModelInstance(ProcessDefinition processDefinition) {
                try (InputStream bpmnXmlFile = getProcessEngine().getRepositoryService()
                                .getProcessModel(processDefinition.getId())) {
                        return Bpmn.readModelFromStream(bpmnXmlFile);
                } catch (IOException e) {
                        throw new RuntimeException("Error reading BPMN model", e);
                }
        }

        private List<ProcessDefinitionDocumentationElement> extractDocumentation(BpmnModelInstance modelInstance) {
                List<ProcessDefinitionDocumentationElement> documentationList = new ArrayList<>();

                ProcessDefinitionDocumentationElement processDoc = modelInstance
                                .getModelElementsByType(Process.class)
                                .stream()
                                .map(this::createDocumentation)
                                .filter(value -> value != null)
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
                                                .filter(value -> value != null)
                                                .collect(Collectors.toList()));

                return documentationList;
        }

        private ProcessDefinitionDocumentationElement createDocumentation(BaseElement element) {
                String documentation = getDocumentation(element);
                String extendedDocumentation = element.getAttributeValueNs(BpmnXmlNamespaceUri.DOCUMENTATION,
                                "extendedDocumentation");

                if ((documentation == null || documentation.isBlank())
                                && (extendedDocumentation == null || extendedDocumentation.isBlank())) {
                        return null;
                }

                return new ProcessDefinitionDocumentationElement(
                                element.getId(),
                                element.getAttributeValue("name"),
                                element.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "assignee"),
                                element.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "candidateGroups"),
                                element.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "dueDate"),
                                documentation,
                                extendedDocumentation);
        }

        private String getDocumentation(BaseElement baseElement) {
                return baseElement.getDocumentations()
                                .stream()
                                .findFirst()
                                .map(Documentation::getTextContent)
                                .orElse("");
        }
}

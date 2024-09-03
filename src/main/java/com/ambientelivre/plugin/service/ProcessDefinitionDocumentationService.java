package com.ambientelivre.plugin.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.authorization.Authorization;
import org.camunda.bpm.engine.authorization.Permission;
import org.camunda.bpm.engine.authorization.Permissions;
import org.camunda.bpm.engine.impl.identity.Authentication;
import org.camunda.bpm.engine.repository.ProcessDefinition;
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
        public ProcessDefinitionDocumentationService(String engineName) {
                super(engineName);
        }

        public ProcessDefinitionDocumentationAuthorizationDto findManyProcessDefinitionDocumentation(
                        String processDefinitionKey) {
                return new ProcessDefinitionDocumentationAuthorizationDto(
                                hasEditablePermission(),
                                processDefinitionsToDocumentation(getProcessEngine()
                                                .getRepositoryService()
                                                .createProcessDefinitionQuery()
                                                .startablePermissionCheck()
                                                .processDefinitionKey(
                                                                processDefinitionKey != null
                                                                                && !processDefinitionKey.isBlank()
                                                                                                ? processDefinitionKey
                                                                                                : new String())
                                                .latestVersion()
                                                .list()));
        }

        public List<ProcessDefinitionDocumentation> processDefinitionsToDocumentation(
                        List<ProcessDefinition> processDefinitions) {
                Authentication currentAuthentication = getProcessEngine()
                                .getIdentityService()
                                .getCurrentAuthentication();

                String currentUserId = currentAuthentication != null ? currentAuthentication.getUserId() : null;

                Boolean isAuthenticated = currentUserId != null ? !currentUserId.isBlank() : false;

                if (!isAuthenticated) {
                        List<String> authorizedResourceIds = getProcessEngine()
                                        .getAuthorizationService()
                                        .createAuthorizationQuery()
                                        .resourceType(6)
                                        .list()
                                        .stream()
                                        .map(currentAuthorization -> {
                                                if (processDefinitions.stream().anyMatch(
                                                                processDefinition -> processDefinition.getKey().equals(
                                                                                currentAuthorization.getResourceId()))
                                                                && currentAuthorization
                                                                                .getPermissions(new Permission[] {
                                                                                                Permissions.READ }).length > 0
                                                                && (currentAuthorization
                                                                                .getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL)
                                                                && (currentAuthorization.getUserId()
                                                                                .equals(Authorization.ANY)
                                                                                || currentAuthorization.getGroupId()
                                                                                                .equals(Authorization.ANY))) {
                                                        return currentAuthorization.getResourceId();
                                                }

                                                return null;
                                        })
                                        .filter(value -> value != null)
                                        .collect(Collectors.toList());

                        if (authorizedResourceIds.size() > 0) {
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

                        return List.of();
                }

                return getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion()
                                .startablePermissionCheck()
                                .processDefinitionKeysIn(processDefinitions
                                                .stream()
                                                .map(ProcessDefinition::getKey)
                                                .collect(Collectors.toList())
                                                .toArray(new String[0]))
                                .list()
                                .stream()
                                .map(this::createProcessDefinitionDocumentation)
                                .collect(Collectors.toList());
        }

        private Boolean hasEditablePermission() {
                Authentication currentAuthentication = getProcessEngine()
                                .getIdentityService()
                                .getCurrentAuthentication();

                if (currentAuthentication == null || currentAuthentication.getUserId().isBlank()) {
                        return false;
                }

                return getProcessEngine().getAuthorizationService().createAuthorizationQuery()
                                .resourceType(6)
                                .list()
                                .stream()
                                .anyMatch(authorization -> (authorization.getUserId() != null
                                                && authorization.getUserId()
                                                                .equals(currentAuthentication.getUserId()))
                                                || (currentAuthentication
                                                                .getGroupIds()
                                                                .stream()
                                                                .anyMatch(group -> group
                                                                                .equals(authorization.getGroupId()))
                                                                && (authorization
                                                                                .getAuthorizationType() == Authorization.AUTH_TYPE_GRANT
                                                                                || authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL)));
        }

        private ProcessDefinitionDocumentation createProcessDefinitionDocumentation(
                        ProcessDefinition processDefinition) {
                InputStream bpmnXmlFile = getProcessEngine()
                                .getRepositoryService()
                                .getProcessModel(processDefinition.getId());
                BpmnModelInstance modelInstance = Bpmn.readModelFromStream(bpmnXmlFile);

                List<ProcessDefinitionDocumentationElement> documentationList = extractDocumentation(modelInstance);
                String bpmnXmlText = Bpmn.convertToString(modelInstance);

                try {
                        bpmnXmlFile.close();
                } catch (IOException e) {
                        e.printStackTrace();
                }

                Optional<Authorization> editable = getProcessEngine()
                                .getAuthorizationService()
                                .createAuthorizationQuery()
                                .resourceType(6)
                                .list()
                                .stream()
                                .filter(authorization -> authorization.getResourceId()
                                                .equals(processDefinition.getKey())
                                                && (authorization
                                                                .getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL
                                                                || authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GRANT)
                                                && (authorization
                                                                .getPermissions(new Permission[] { Permissions.CREATE,
                                                                                Permissions.DELETE }).length > 0
                                                                && (authorization.getUserId() != null
                                                                                && authorization.getUserId()
                                                                                                .equals(Authorization.ANY))
                                                                || (authorization.getGroupId() != null
                                                                                && authorization.getGroupId()
                                                                                                .equals(Authorization.ANY))))
                                .findFirst();

                return new ProcessDefinitionDocumentation(
                                processDefinition.getKey(),
                                processDefinition.getName(),
                                bpmnXmlText,
                                editable.isPresent(),
                                editable.isPresent() ? editable.get().getId() : null,
                                documentationList);
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

        private ProcessDefinitionDocumentationElement createDocumentation(FlowNode flowNode) {
                String documentation = getDocumentation(flowNode);
                String extendedDocumentation = flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.DOCUMENTATION,
                                "extendedDocumentation");

                if ((documentation == null || documentation.isBlank()) && (extendedDocumentation == null
                                || extendedDocumentation.isBlank())) {
                        return null;
                }

                return new ProcessDefinitionDocumentationElement(
                                flowNode.getId(),
                                flowNode.getName(),
                                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "assignee"),
                                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "candidateGroups"),
                                flowNode.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "dueDate"),
                                documentation,
                                extendedDocumentation);
        }

        // TODO: fix duplicated method
        private ProcessDefinitionDocumentationElement createDocumentation(Process process) {
                String documentation = getDocumentation(process);
                String extendedDocumentation = process.getAttributeValueNs(BpmnXmlNamespaceUri.DOCUMENTATION,
                                "extendedDocumentation");

                if ((documentation == null || documentation.isBlank()) && (extendedDocumentation == null
                                || extendedDocumentation.isBlank())) {
                        return null;
                }

                return new ProcessDefinitionDocumentationElement(
                                process.getId(),
                                process.getName(),
                                process.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "assignee"),
                                process.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "candidateGroups"),
                                process.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "dueDate"),
                                documentation,
                                extendedDocumentation);
        }

        private String getDocumentation(BaseElement baseElement) {
                Documentation doc = baseElement.getDocumentations()
                                .stream()
                                .findFirst()
                                .orElse(null);
                return doc != null ? doc.getTextContent() : "";
        }
}

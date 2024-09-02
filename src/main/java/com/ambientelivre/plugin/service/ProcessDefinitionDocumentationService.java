package com.ambientelivre.plugin.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.authorization.Authorization;
import org.camunda.bpm.engine.authorization.AuthorizationQuery;
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

import com.ambientelivre.plugin.ProcessDefinitionDocumentation;
import com.ambientelivre.plugin.ProcessDefinitionDocumentationElement;
import com.ambientelivre.plugin.utils.BpmnXmlNamespaceUri;

public class ProcessDefinitionDocumentationService extends AbstractCockpitPluginResource {
        public ProcessDefinitionDocumentationService(String engineName) {
                super(engineName);
        }

        public List<ProcessDefinitionDocumentation> findManyProcessDefinitionDocumentation() {
                return processDefinitionsToDocumentation(getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion()
                                .list());
        }

        public List<ProcessDefinitionDocumentation> processDefinitionsToDocumentation(
                        List<ProcessDefinition> processDefinitions) {
                Authentication currentAuthentication = getProcessEngine()
                                .getIdentityService()
                                .getCurrentAuthentication();

                String currentUserId = currentAuthentication != null ? currentAuthentication.getUserId() : null;

                Boolean isAuthenticated = currentUserId != null ? !currentUserId.isBlank() : false;

                if (!isAuthenticated) {
                        AuthorizationQuery authorizationQuery = getProcessEngine()
                                        .getAuthorizationService()
                                        .createAuthorizationQuery()
                                        .resourceType(6);

                        Permission[] requiredPermissions = new Permission[] {
                                        Permissions.READ,
                                        Permissions.READ_HISTORY
                        };

                        List<String> authorizedResourceIds = authorizationQuery
                                        .list()
                                        .stream()
                                        .map(currentAuthorization -> {
                                                Permission[] grantedPermissions = currentAuthorization
                                                                .getPermissions(requiredPermissions);

                                                if (currentAuthorization
                                                                .getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL
                                                                && grantedPermissions.length > 0
                                                                && (currentAuthorization.getUserId().equals("*")
                                                                                || currentAuthorization.getGroupId()
                                                                                                .equals("*"))) {
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
                                .list()
                                .stream()
                                .map(this::createProcessDefinitionDocumentation)
                                .collect(Collectors.toList());
        }

        public ProcessDefinitionDocumentation findOneProcessDefinitionDocumentation(
                        String processDefinitionKey) {
                return processDefinitionsToDocumentation(getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .processDefinitionKey(processDefinitionKey)
                                .latestVersion()
                                .listPage(0, 1))
                                .get(0);
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

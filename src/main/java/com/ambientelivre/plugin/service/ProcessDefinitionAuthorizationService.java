package com.ambientelivre.plugin.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.authorization.Authorization;
import org.camunda.bpm.engine.authorization.Permission;
import org.camunda.bpm.engine.authorization.Permissions;
import org.camunda.bpm.engine.authorization.Resource;
import org.camunda.bpm.engine.authorization.Resources;
import org.camunda.bpm.engine.impl.identity.Authentication;
import org.camunda.bpm.engine.repository.ProcessDefinition;

public class ProcessDefinitionAuthorizationService extends AbstractCockpitPluginResource {
    private static final Resource PROCESS_DEFINITION_RESOURCE_TYPE = Resources.PROCESS_DEFINITION;
    private static final Permission[] EDIT_PERMISSIONS = { Permissions.CREATE, Permissions.DELETE, Permissions.ALL };
    private static final Permission[] READ_PERMISSIONS = { Permissions.READ, Permissions.ALL };

    public ProcessDefinitionAuthorizationService(String engineName) {
        super(engineName);
    }

    public Boolean hasEditablePermission() {
        Authentication currentAuthentication = getCurrentAuthentication();

        if (currentAuthentication == null || currentAuthentication.getUserId().isBlank()) {
            return false;
        }

        return getProcessEngine()
                .getAuthorizationService()
                .createAuthorizationQuery()
                .resourceType(PROCESS_DEFINITION_RESOURCE_TYPE)
                .list()
                .stream()
                .anyMatch(authorization -> isEditableAuthorization(authorization, currentAuthentication));
    }

    public List<String> getAuthorizedResourceIds(List<ProcessDefinition> processDefinitions) {
        return getProcessEngine()
                .getAuthorizationService()
                .createAuthorizationQuery()
                .resourceType(PROCESS_DEFINITION_RESOURCE_TYPE)
                .list()
                .stream()
                .map(authorization -> getAuthorizedResourceId(authorization, processDefinitions))
                .filter(value -> value != null)
                .collect(Collectors.toList());
    }

    public Optional<Authorization> findEditableAuthorization(ProcessDefinition processDefinition) {
        return getProcessEngine()
                .getAuthorizationService()
                .createAuthorizationQuery()
                .resourceType(PROCESS_DEFINITION_RESOURCE_TYPE)
                .list()
                .stream()
                .filter(authorization -> isEditableProcessDefinitionAuthorization(authorization, processDefinition))
                .findFirst();
    }

    private String getAuthorizedResourceId(Authorization authorization, List<ProcessDefinition> processDefinitions) {
        if (isGlobalAuthorization(authorization) && hasReadPermissions(authorization) &&
                processDefinitions.stream().anyMatch(
                        processDefinition -> processDefinition.getKey().equals(authorization.getResourceId()))) {
            return authorization.getResourceId();
        }

        return null;
    }

    private boolean isGlobalAuthorization(Authorization authorization) {
        return authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL &&
                ((authorization.getUserId() != null && authorization.getUserId().equals(Authorization.ANY)) ||
                        (authorization.getGroupId() != null && authorization.getGroupId().equals(Authorization.ANY)));
    }

    private boolean hasReadPermissions(Authorization authorization) {
        return authorization.getPermissions(READ_PERMISSIONS).length > 0;
    }

    private boolean hasEditingPermissions(Authorization authorization) {
        return authorization.getPermissions(EDIT_PERMISSIONS).length >= 2;
    }

    private boolean isEditableAuthorization(Authorization authorization, Authentication currentAuthentication) {
        return (authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GRANT ||
                authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL)

                && (authorization.getUserId() != null
                        && authorization.getUserId().equals(currentAuthentication.getUserId()) ||
                        currentAuthentication.getGroupIds().stream()
                                .anyMatch(group -> group.equals(authorization.getGroupId())))

                && hasEditingPermissions(authorization);
    }

    private boolean isEditableProcessDefinitionAuthorization(Authorization authorization,
            ProcessDefinition processDefinition) {
        return authorization.getResourceId().equals(processDefinition.getKey()) &&
                (authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GLOBAL ||
                        authorization.getAuthorizationType() == Authorization.AUTH_TYPE_GRANT)

                && ((authorization.getUserId() != null && authorization.getUserId().equals(Authorization.ANY)) ||
                        (authorization.getGroupId() != null && authorization.getGroupId().equals(Authorization.ANY)))

                && hasReadPermissions(authorization);
    }

    protected Authentication getCurrentAuthentication() {
        return getProcessEngine().getIdentityService().getCurrentAuthentication();
    }
}

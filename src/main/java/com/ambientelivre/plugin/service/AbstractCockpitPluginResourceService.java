package com.ambientelivre.plugin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.repository.ProcessDefinition;

public class AbstractCockpitPluginResourceService extends AbstractCockpitPluginResource {
    public AbstractCockpitPluginResourceService(String engineName) {
        super(engineName);
    }

    public List<Integer> getProcessDefinitionVersion(String processDefinitionKey) {
        return getProcessEngine()
                .getRepositoryService()
                .createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .orderByProcessDefinitionVersion().desc()
                .list().stream().map(ProcessDefinition::getVersion)
                .collect(Collectors.toList());
    }
}

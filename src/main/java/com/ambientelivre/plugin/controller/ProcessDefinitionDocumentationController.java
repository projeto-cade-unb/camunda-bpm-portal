package com.ambientelivre.plugin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ambientelivre.plugin.ProcessDefinitionDocumentation;
import com.ambientelivre.plugin.service.ProcessDefinitionDocumentationService;

@RestController
@RequestMapping("api/process-definition")
public class ProcessDefinitionDocumentationController {
    @Autowired
    private ProcessDefinitionDocumentationService processDefinitionDocumentationService;

    @GetMapping("{processDefinitionKey}")
    public ProcessDefinitionDocumentation findManyProcessDefinitionDocumentation(
            @PathVariable String processDefinitionKey) {
        return processDefinitionDocumentationService
                .findOneProcessDefinitionDocumentation(processDefinitionKey);

    }

    @GetMapping
    public List<ProcessDefinitionDocumentation> findManyProcessDefinitionDocumentation() {
        return processDefinitionDocumentationService.findManyProcessDefinitionDocumentation();
    }
}

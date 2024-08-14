package com.ambientelivre.plugin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ambientelivre.plugin.service.ProcessDefinitionDocumentationService;

@Controller
public class ProcessDefinitionDocumentationController {
    @Autowired
    private ProcessDefinitionDocumentationService processDefinitionDocumentationService;

    @RequestMapping("{processDefinitionKey}")
    public String details(@PathVariable String processDefinitionKey, Model model) {
        model.addAttribute("processDocumentation", processDefinitionDocumentationService.findOneProcessDefinitionDocumentation(processDefinitionKey));

        return "details";
    }

    @RequestMapping
    public String list(Model model) {
        model.addAttribute("processDocumentations", processDefinitionDocumentationService.findManyProcessDefinitionDocumentation());
        
        return "list";
    }
}   

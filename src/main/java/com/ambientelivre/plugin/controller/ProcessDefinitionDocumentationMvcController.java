package com.ambientelivre.plugin.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProcessDefinitionDocumentationMvcController implements ErrorController {
    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("error")
    public String handleError() {
        return "index";
    }
}

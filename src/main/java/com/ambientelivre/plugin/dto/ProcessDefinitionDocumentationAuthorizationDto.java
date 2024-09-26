package com.ambientelivre.plugin.dto;

import java.util.List;

import com.ambientelivre.plugin.documentation.ProcessDefinitionDocumentation;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProcessDefinitionDocumentationAuthorizationDto {
    private Boolean editable;
    private List<ProcessDefinitionDocumentation> definitionDocumentation;
}

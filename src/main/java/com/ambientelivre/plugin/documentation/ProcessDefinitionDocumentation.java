package com.ambientelivre.plugin.documentation;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProcessDefinitionDocumentation {
    private String id;
    private String key;
    private String name;
    private String diagram;
    private Boolean editable;
    private String authorizationId;
    private List<ProcessDefinitionDocumentationElement> documentation;
}

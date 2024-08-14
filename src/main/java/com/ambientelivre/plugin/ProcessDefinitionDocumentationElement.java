package com.ambientelivre.plugin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProcessDefinitionDocumentationElement {
    private String id;
    private String name;
    private String assignee;
    private String candidateGroups;
    private String dueDate;
    private String documentation;
    private String extendedDocumentation;
}

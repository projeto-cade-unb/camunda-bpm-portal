package com.ambientelivre.plugin.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.bpm.engine.authorization.Authorization;
import org.camunda.bpm.engine.impl.identity.Authentication;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.repository.ProcessDefinitionQuery;
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
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;

public class ProcessDefinitionDocumentationService extends AbstractCockpitPluginResource {
        private final ProcessDefinitionAuthorizationService processDefinitionAuthorizationService;

        public ProcessDefinitionDocumentationService(String engineName) {
                super(engineName);
                processDefinitionAuthorizationService = new ProcessDefinitionAuthorizationService(engineName);
        }

        public ProcessDefinitionDocumentationAuthorizationDto findManyProcessDefinitionDocumentation(
                        String processDefinitionKey) {
                ProcessDefinitionQuery query = getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion();

                if (processDefinitionKey != null && !processDefinitionKey.isBlank()) {
                        query.processDefinitionKey(processDefinitionKey);
                }

                return new ProcessDefinitionDocumentationAuthorizationDto(
                                processDefinitionAuthorizationService.hasEditablePermission(),
                                processDefinitionsToDocumentation(query.list()));
        }

        public List<ProcessDefinitionDocumentation> processDefinitionsToDocumentation(
                        List<ProcessDefinition> processDefinitions) {
                Authentication currentAuthentication = getCurrentAuthentication();
                String currentUserId = currentAuthentication != null ? currentAuthentication.getUserId() : null;
                boolean isAuthenticated = currentUserId != null && !currentUserId.isBlank();

                if (!isAuthenticated) {
                        return getUnauthenticatedProcessDefinitions(processDefinitions);
                }

                return getAuthenticatedProcessDefinitions(processDefinitions);
        }

        private List<ProcessDefinitionDocumentation> getUnauthenticatedProcessDefinitions(
                        List<ProcessDefinition> processDefinitions) {
                List<String> authorizedResourceIds = processDefinitionAuthorizationService
                                .getAuthorizedResourceIds(processDefinitions);

                if (!authorizedResourceIds.isEmpty()) {
                        return getProcessDefinitionDocumentations(authorizedResourceIds);
                }

                return List.of();
        }

        private List<ProcessDefinitionDocumentation> getAuthenticatedProcessDefinitions(
                        List<ProcessDefinition> processDefinitions) {
                return getProcessEngine()
                                .getRepositoryService()
                                .createProcessDefinitionQuery()
                                .latestVersion()
                                .startablePermissionCheck()
                                .processDefinitionKeysIn(processDefinitions.stream().map(ProcessDefinition::getKey)
                                                .toArray(String[]::new))
                                .list()
                                .stream()
                                .map(this::createProcessDefinitionDocumentation)
                                .collect(Collectors.toList());
        }

        private List<ProcessDefinitionDocumentation> getProcessDefinitionDocumentations(
                        List<String> authorizedResourceIds) {
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

        private ProcessDefinitionDocumentation createProcessDefinitionDocumentation(
                        ProcessDefinition processDefinition) {
                BpmnModelInstance modelInstance = getBpmnModelInstance(processDefinition);
                List<ProcessDefinitionDocumentationElement> documentationList = extractDocumentation(modelInstance);
                String bpmnXmlText = Bpmn.convertToString(modelInstance);

                Optional<Authorization> editable = processDefinitionAuthorizationService
                                .findEditableAuthorization(processDefinition);

                return new ProcessDefinitionDocumentation(
                                processDefinition.getKey(),
                                processDefinition.getName(),
                                bpmnXmlText,
                                editable.isPresent(),
                                editable.map(Authorization::getId).orElse(null),
                                documentationList);
        }

        private BpmnModelInstance getBpmnModelInstance(ProcessDefinition processDefinition) {
                try (InputStream bpmnXmlFile = getProcessEngine().getRepositoryService()
                                .getProcessModel(processDefinition.getId())) {
                        return Bpmn.readModelFromStream(bpmnXmlFile);
                } catch (IOException e) {
                        throw new RuntimeException("Error reading BPMN model", e);
                }
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

        private ProcessDefinitionDocumentationElement createDocumentation(BaseElement element) {
                String documentation = getDocumentation(element);
                String extendedDocumentation = element.getAttributeValueNs(BpmnXmlNamespaceUri.DOCUMENTATION,
                                "extendedDocumentation");

                if ((documentation == null || documentation.isBlank())
                                && (extendedDocumentation == null || extendedDocumentation.isBlank())) {
                        return null;
                }

                return new ProcessDefinitionDocumentationElement(
                                element.getId(),
                                element.getAttributeValue("name"),
                                element.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "assignee"),
                                element.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "candidateGroups"),
                                element.getAttributeValueNs(BpmnXmlNamespaceUri.CAMUNDA, "dueDate"),
                                documentation,
                                extendedDocumentation);
        }

        private String getDocumentation(BaseElement baseElement) {
                return baseElement.getDocumentations()
                                .stream()
                                .findFirst()
                                .map(Documentation::getTextContent)
                                .orElse("");
        }

        public byte[] generatePdf(ProcessDefinitionDocumentationAuthorizationDto documentation) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                PdfWriter writer = new PdfWriter(baos);
                PdfDocument pdfDoc = new PdfDocument(writer);
                Document document = new Document(pdfDoc);

                try {
                        document.add(new Paragraph("Process Documentation")
                                        .setFontSize(18)
                                        .setBold()
                                        .setTextAlignment(TextAlignment.CENTER));

                        for (ProcessDefinitionDocumentation process : documentation.getDefinitionDocumentation()) {
                                document.add(new Paragraph("Process: " + process.getName())
                                                .setFontSize(14)
                                                .setBold());
                                document.add(new Paragraph("Key: " + process.getKey()));

                                if (process.getDiagram() != null) {
                                        byte[] diagramBytes = Base64.getDecoder().decode(process.getDiagram());
                                        ImageData imageData = ImageDataFactory.create(diagramBytes);
                                        Image image = new Image(imageData);
                                        image.setAutoScale(true);
                                        document.add(image);
                                }

                                for (ProcessDefinitionDocumentationElement element : process.getDocumentation()) {
                                        document.add(new Paragraph("Element: " + element.getName())
                                                        .setFontSize(12)
                                                        .setBold());
                                        document.add(new Paragraph("ID: " + element.getId()));

                                        if (element.getAssignee() != null) {
                                                document.add(new Paragraph("Assignee: " + element.getAssignee()));
                                        }
                                        if (element.getCandidateGroups() != null) {
                                                document.add(new Paragraph(
                                                                "Candidate Groups: " + element.getCandidateGroups()));
                                        }
                                        if (element.getDueDate() != null) {
                                                document.add(new Paragraph("Due Date: " + element.getDueDate()));
                                        }
                                        if (element.getDocumentation() != null) {
                                                document.add(new Paragraph(
                                                                "Documentation: " + element.getDocumentation()));
                                        }
                                        if (element.getExtendedDocumentation() != null) {
                                                document.add(new Paragraph("Extended Documentation: "
                                                                + element.getExtendedDocumentation()));
                                        }
                                        document.add(new Paragraph("\n"));
                                }
                        }

                        document.close();
                        return baos.toByteArray();

                } catch (Exception e) {
                        throw new RuntimeException("Error generating PDF", e);
                }
        }
}

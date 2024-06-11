import { Component, Input, OnInit } from "@angular/core";
import { DiagramDocumentation } from "../diagram-documentation/diagram-documentation";

@Component({
  selector: "custom-process-diagram-documentation[diagram]",
  templateUrl: "./process-diagram-documentation.component.html",
  styleUrls: ["./process-diagram-documentation.component.css"],
})
export class ProcessDiagramDocumentationComponent implements OnInit {
  @Input() diagram: string;

  domParser = new DOMParser();

  diagramDocumentation: DiagramDocumentation;

  document: Document;

  ngOnInit(): void {
    this.document = this.domParser.parseFromString(this.diagram, "text/xml");

    const processContainer = this.document.querySelector("process");

    this.diagramDocumentation = {
      id: processContainer.getAttribute("id"),
      name: processContainer.getAttribute("name"),
      assignee: processContainer.getAttribute("camunda:assignee"),
      candidateGroups: processContainer.getAttribute("camunda:candidateGroups"),
      dueDate: processContainer.getAttribute("camunda:dueDate"),
      documentation:
        processContainer.querySelector("documentation")?.textContent,
      extendedDocumentation: processContainer.getAttribute(
        "documentation:extendedDocumentation"
      ),
    };
  }
}

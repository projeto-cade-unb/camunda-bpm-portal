import { Component, Input, OnInit } from "@angular/core";
import { DiagramDocumentation } from "./diagram-documentation";

@Component({
  selector: "custom-diagram-documentation[diagram]",
  templateUrl: "./diagram-documentation.component.html",
  styleUrls: ["./diagram-documentation.component.css"],
})
export class DiagramDocumentationComponent implements OnInit {
  @Input() diagram: string;

  domParser = new DOMParser();

  diagramDocumentation: DiagramDocumentation[] = [];

  document: Document;

  ngOnInit(): void {
    this.document = this.domParser.parseFromString(this.diagram, "text/xml");

    const processContainer = this.document.querySelector("process");

    if (!processContainer) return;

    const processChildren = processContainer.children;
    const processFirstChild = processChildren.item(0);

    this.diagramDocumentation.push({
      id: processFirstChild.getAttribute("id"),
      name: processFirstChild.getAttribute("name"),
      documentation:
        processFirstChild.tagName === "bpmn:documentation" &&
        processFirstChild?.textContent,
      extendedDocumentation: processContainer.getAttribute(
        "documentation:extendedDocumentation"
      ),
    });

    for (let i = 0; i < processChildren.length; i++) {
      const processChild = processChildren[i];

      this.diagramDocumentation.push({
        id: processChild.getAttribute("id"),
        name: processChild.getAttribute("name"),
        documentation: processChild.querySelector("documentation")?.textContent,
        extendedDocumentation: processChild.getAttribute(
          "documentation:extendedDocumentation"
        ),
      });
    }
  }
}

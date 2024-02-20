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

  ngOnInit(): void {
    const document = this.domParser.parseFromString(this.diagram, "text/xml");

    const processContainer = document.querySelector("process");

    if (!processContainer) return;

    const processChildren = processContainer.querySelectorAll("*");

    this.diagramDocumentation.push({
      documentation:
        processChildren[0].tagName === "documentation" &&
        processChildren[0]?.textContent,
      extendedDocumentation: processContainer.getAttribute(
        "documentation:extendedDocumentation"
      ),
    });

    processChildren.forEach((processChild) => {
      this.diagramDocumentation.push({
        documentation: processChild.querySelector("documentation")?.textContent,
        extendedDocumentation: processChild.getAttribute(
          "documentation:extendedDocumentation"
        ),
      });
    });
  }
}

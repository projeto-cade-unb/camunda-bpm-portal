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

    const processChildrens = document.querySelectorAll("process > *");
    const processContaier = document.querySelector("process");

    this.diagramDocumentation.push({
      documentation: processChildrens[0]?.textContent,
      extendedDocumentation: processContaier.getAttribute(
        "documentation:extendedDocumentation"
      ),
    });

    processChildrens.forEach((processElement) => {
      this.diagramDocumentation.push({
        documentation:
          processElement.querySelector("documentation")?.textContent,
        extendedDocumentation: processElement.getAttribute(
          "documentation:extendedDocumentation"
        ),
      });
    });
  }
}

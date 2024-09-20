import { Component, Input, OnInit } from "@angular/core";
import { Documentation } from "../../../diagram-documentation";
import { DomSanitizer } from "@angular/platform-browser";
import { DiagramXMLParser } from "src/DiagramXMLParser";

@Component({
  selector: "custom-process-diagram-documentation[diagram]",
  templateUrl: "./process-diagram-documentation.component.html",
  styleUrls: ["./process-diagram-documentation.component.css"],
})
export class ProcessDiagramDocumentationComponent implements OnInit {
  @Input() diagram: string;

  documentation: Documentation;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const processContainer = new DiagramXMLParser().parseDiagramXmlString(
      this.diagram
    );

    this.documentation = Documentation.createDocumentation(
      processContainer,
      this.domSanitizer
    );
  }
}

import { Component, Input, OnInit } from "@angular/core";
import { Documentation } from "../../../diagram-documentation";
import { DomSanitizer } from "@angular/platform-browser";
import { DiagramXMLParser } from "src/DiagramXMLParser";

@Component({
  selector: 'custom-documentation-details[diagram]',
  templateUrl: './documentation-details.component.html',
  styleUrls: ['./documentation-details.component.css'],
})
export class DocumentationDetailsComponent implements OnInit {
  @Input() diagram: string;

  diagramDocumentation: Documentation[] = [];

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const processContainer = new DiagramXMLParser().parseDiagramXmlString(
      this.diagram
    );

    if (!processContainer) {
      return;
    }

    const processChildren = processContainer.children;

    for (let i = 0; i < processChildren.length; i++) {
      const processChild = processChildren[i];
      this.diagramDocumentation.push(
        Documentation.createDocumentation(
          processChild,
          this.domSanitizer,
          i === 0
        )
      );
    }
  }
}

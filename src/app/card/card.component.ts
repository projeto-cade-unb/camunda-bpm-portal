import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { ProcessDefinitionService } from "../process-definition.service";
import { ProcessDefinition } from "../process-definition";

@Component({
  selector: "custom-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  @ViewChild("viewer", { static: true }) el: ElementRef;

  @Input() processDefinition: ProcessDefinition;

  viewer = new Viewer();

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  async ngOnInit() {
    await this.viewer.importXML(
      await this.processDefinitionService.findOneBpmnXMLByProcessDefinitionsId(
        this.processDefinition.id
      )
    );

    this.viewer.attachTo(this.el.nativeElement);

    const canvas: any = this.viewer.get("canvas");

    const { inner } = canvas.viewbox();

    canvas.zoom("fit-viewport", {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2,
    });
  }
}

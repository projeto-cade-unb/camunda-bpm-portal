import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { ProcessDefinitionService } from "../process-definition.service";
import { ProcessDefinition } from "../process-definition";
import { interval } from "rxjs";

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

  resizeCanvasOnCenter(canvas: any) {
    const { inner } = canvas.viewbox();

    canvas.zoom("fit-viewport", {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2,
    });
  }

  ngOnInit() {
    this.processDefinitionService
      .findOneBpmnXMLByProcessDefinitionId(this.processDefinition.id)
      .subscribe(async (xml) => {
        await this.viewer.importXML(xml);

        this.viewer.attachTo(this.el.nativeElement);

        const canvas = this.viewer.get("canvas");

        this.resizeCanvasOnCenter(canvas);

        interval(1000).subscribe(() => {
          this.resizeCanvasOnCenter(canvas);
        });
      });
  }
}

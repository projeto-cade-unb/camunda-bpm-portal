import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";
import { ProcessDefinition } from "../process-definition/process-definition";
import { Observable, interval, mergeMap, of, switchMap, takeUntil } from "rxjs";

@Component({
  selector: "custom-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit, OnDestroy {
  @ViewChild("viewer", { static: true }) el: ElementRef;

  @Input() processDefinition: ProcessDefinition;

  viewer = new Viewer();

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  resizeCanvasOnCenter() {
    return new Observable((subscription) => {
      const canvas: any = this.viewer.get("canvas");

      if (!canvas) subscription.complete();

      const { inner } = canvas.viewbox();

      canvas.zoom("fit-viewport", {
        x: inner.x + inner.width / 2,
        y: inner.y + inner.height / 2,
      });

      subscription.next();
    });
  }

  ngOnInit(): void {
    this.processDefinitionService
      .findOneBpmnXMLByProcessDefinitionId(this.processDefinition.id)
      .subscribe(async (xml) => {
        await this.viewer.importXML(xml);

        this.viewer.attachTo(this.el.nativeElement);

        this.resizeCanvasOnCenter()
          .pipe(
            switchMap(() =>
              interval(1000).pipe(mergeMap(() => this.resizeCanvasOnCenter()))
            )
          )
          .subscribe();
      });
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }
}

import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { Observable, interval, mergeMap, switchMap } from "rxjs";
import { ProcessDefinition } from "../process-definition/process-definition";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";

@Component({
  selector: "custom-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit, OnDestroy {
  @ViewChild("viewer", { static: true }) el: ElementRef;

  @Input() processDefinition: ProcessDefinition;

  #viewer = new Viewer();

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  #resizeCanvas() {
    return new Observable<void>((subscription) => {
      const canvas: any = this.#viewer.get("canvas");

      if (!canvas) subscription.complete();

      const { inner } = canvas.viewbox();

      canvas.zoom("fit-viewport", {
        x: inner.x + inner.width / 2,
        y: inner.y + inner.height / 2,
      });

      subscription.next();
    });
  }

  resizeCanvasInterval() {
    return this.#resizeCanvas().pipe(
      switchMap(() => interval(1000).pipe(mergeMap(() => this.#resizeCanvas())))
    );
  }

  ngOnInit(): void {
    this.processDefinitionService
      .findOneBpmnXMLByProcessDefinitionId(this.processDefinition.id)
      .subscribe(async (xml) => {
        await this.#viewer.importXML(xml);

        this.#viewer.attachTo(this.el.nativeElement);

        this.resizeCanvasInterval().subscribe();
      });
  }

  ngOnDestroy(): void {
    this.#viewer.destroy();
  }
}

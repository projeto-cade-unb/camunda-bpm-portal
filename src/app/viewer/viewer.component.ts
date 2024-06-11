import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";

@Component({
  selector: "custom-viewer[diagram], custom-viewer[containerElement]",
  templateUrl: "./viewer.component.html",
  styleUrls: [
    "./viewer.component.css",
    "../../../node_modules/bpmn-js/dist/assets/diagram-js.css",
    "../../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ViewerComponent implements OnInit, OnDestroy {
  @Input() containerElement: HTMLElement;

  @Input() diagram: string;

  @Output() importXML = new EventEmitter<Viewer>();

  viewer = new Viewer();

  private handleResizeEvent = () => this.resizeCanvas();

  resizeCanvas() {
    const canvas: any = this.viewer.get("canvas");

    const { inner } = canvas.viewbox();

    canvas.zoom("fit-viewport", {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2,
    });
  }

  async ngOnInit() {
    await this.viewer.importXML(this.diagram);
    this.viewer.attachTo(this.containerElement);
    this.resizeCanvas();
    this.importXML.emit(this.viewer);
    addEventListener("resize", this.handleResizeEvent);
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
    this.importXML.complete();
    removeEventListener("resize", this.handleResizeEvent);
  }
}

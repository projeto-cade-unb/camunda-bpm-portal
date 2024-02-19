import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { Observable, mergeMap, timer } from "rxjs";

@Component({
  selector: "custom-viewer",
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"],
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild("viewer", { static: true }) el: ElementRef;

  @Input() xml: string;

  viewer = new Viewer();

  resizeCanvas() {
    return new Observable<void>((subscription) => {
      const canvas: any = this.viewer.get("canvas");

      const { inner } = canvas.viewbox();

      canvas.zoom("fit-viewport", {
        x: inner.x + inner.width / 2,
        y: inner.y + inner.height / 2,
      });

      subscription.next();
    });
  }

  resizeCanvasInterval() {
    return timer(0, 1000).pipe(mergeMap(() => this.resizeCanvas()));
  }

  async ngOnInit() {
    await this.viewer.importXML(this.xml);
    this.viewer.attachTo(this.el.nativeElement);
    this.resizeCanvasInterval().subscribe();
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }
}

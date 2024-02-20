import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { Observable, from, mergeMap, timer } from "rxjs";

@Component({
  selector: "custom-viewer[diagram], custom-viewer[containerElement]",
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"],
})
export class ViewerComponent implements OnInit, OnDestroy {
  @Input() containerElement: HTMLElement;

  @Input() diagram: string;

  viewer = new Viewer();
  resizeCanvas$ = timer(0, 1000).pipe(mergeMap(() => this.resizeCanvas()));

  resizeCanvas() {
    return new Observable<void>((subscription) => {
      const canvas: any = this.viewer.get("canvas");

      const { inner } = canvas.viewbox();

      if (!(inner.x && inner.y)) subscription.complete();

      canvas.zoom("fit-viewport", {
        x: inner.x + inner.width / 2,
        y: inner.y + inner.height / 2,
      });

      subscription.next();
    });
  }

  ngOnInit(): void {
    from(this.viewer.importXML(this.diagram)).subscribe(() => {
      this.viewer.attachTo(this.containerElement);
      this.resizeCanvas$.subscribe();
    });
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }
}

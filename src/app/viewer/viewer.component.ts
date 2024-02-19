import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { Observable, from, mergeMap, timer } from "rxjs";

@Component({
  selector: "custom-viewer",
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.css"],
})
export class ViewerComponent implements OnInit, OnDestroy {
  @Input() el: HTMLElement;

  @Input() xml: string;

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
    from(this.viewer.importXML(this.xml)).subscribe(() => {
      this.viewer.attachTo(this.el);
      this.resizeCanvas$.subscribe();
    });
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }
}

import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import Viewer from 'bpmn-js/lib/Viewer';
import { fromEvent, Subscription, tap } from 'rxjs';

@Directive({
  selector: '[appViewer]',
  standalone: true,
})
export class ViewerDirective {
  @Input({ required: true }) appViewer!: string;

  @Output()
  elementClick = new EventEmitter<string>();

  #viewer = new Viewer();

  #risize$ = fromEvent(window, 'resize').pipe(tap(() => this.resizeCanvas()));

  #risize!: Subscription;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  resizeCanvas() {
    const canvas: any = this.#viewer.get('canvas');

    const { inner } = canvas.viewbox();

    if (!inner.width || !inner.height) {
      this.ngOnDestroy();
      return;
    }

    canvas.zoom('fit-viewport', {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2,
    });
  }

  async ngOnInit() {
    this.#risize = this.#risize$.subscribe();

    await this.#viewer.importXML(this.appViewer);
    this.#viewer.attachTo(this.elementRef.nativeElement);
    this.resizeCanvas();

    const eventBus: any = this.#viewer.get('eventBus');
    eventBus.on('element.click', (event: any) => {
      this.elementClick.emit(event.element.id);
    });
  }

  ngOnDestroy(): void {
    this.elementClick.complete();
    this.#risize.unsubscribe();
    this.#viewer.destroy();
  }
}

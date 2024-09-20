import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import Viewer from 'bpmn-js/lib/Viewer';

@Directive({
  selector: '[appViewer]',
  standalone: true,
})
export class ViewerDirective {
  @Input({ required: true }) appViewer!: string;

  @Output()
  elementClick = new EventEmitter<string>();

  #viewer = new Viewer();

  #handleResizeEvent = () => this.resizeCanvas();

  constructor(private elementRef: ElementRef) {}

  resizeCanvas() {
    const canvas: any = this.#viewer.get('canvas');

    const { inner } = canvas.viewbox();

    canvas.zoom('fit-viewport', {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2,
    });
  }

  async ngOnInit() {
    await this.#viewer.importXML(this.appViewer);
    this.#viewer.attachTo(this.elementRef.nativeElement);
    this.resizeCanvas();

    const eventBus: any = this.#viewer.get('eventBus');
    eventBus.on('element.click', (event: any) => {
      this.elementClick.emit(event.element.id);
    });

    addEventListener('resize', this.#handleResizeEvent);
  }

  ngOnDestroy(): void {
    this.#viewer.destroy();
    removeEventListener('resize', this.#handleResizeEvent);
  }
}

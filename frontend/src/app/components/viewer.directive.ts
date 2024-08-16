import { Directive, ElementRef, Input } from '@angular/core';
import Viewer from 'bpmn-js/lib/Viewer';

@Directive({
  selector: '[appViewer]',
  standalone: true,
})
export class ViewerDirective {
  @Input({ required: true }) appViewer!: string;

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
    addEventListener('resize', this.#handleResizeEvent);
  }

  ngOnDestroy(): void {
    this.#viewer.destroy();
    removeEventListener('resize', this.#handleResizeEvent);
  }
}

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
  exportAs: 'appViewer',
})
export class ViewerDirective {
  @Input({ required: true }) appViewer!: string;

  @Output()
  elementClick = new EventEmitter<string>();

  @Input()
  viewer!: Viewer;

  @Input()
  svg = false;

  #risize$ = fromEvent(window, 'resize').pipe(tap(() => this.resizeCanvas()));

  #risize?: Subscription;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  resizeCanvas() {
    const canvas: any = this.viewer.get('canvas');

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

  zoomIn() {
    (this.viewer.get('zoomScroll') as any).zoom(1, {
      x: this.elementRef.nativeElement.offsetWidth / 2,
      y: this.elementRef.nativeElement.offsetHeight / 2,
    });
  }

  zoomOut() {
    (this.viewer.get('zoomScroll') as any).zoom(-1, {
      x: this.elementRef.nativeElement.offsetWidth / 2,
      y: this.elementRef.nativeElement.offsetHeight / 2,
    });
  }

  resetZoom() {
    const canvas: any = this.viewer.get('canvas');
    canvas.resized();
    canvas.zoom('fit-viewport', 'auto');
  }

  getSvgById(id: string) {
    const elementRegistry: any = this.viewer.get('elementRegistry');
    const element = elementRegistry.get(id);

    if (!element) {
      return;
    }

    const gfx: SVGElement = elementRegistry.getGraphics(id).cloneNode(true);
    gfx.removeAttribute('transform');

    const rect = gfx?.querySelector('rect');

    if (!rect) {
      return;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'height',
      rect.getAttribute('height') || rect.style.height
    );
    svg.setAttribute('width', rect.getAttribute('width') || rect.style.width);
    svg.appendChild(gfx);

    return svg;
  }

  async ngOnInit() {
    this.viewer ||= new Viewer();
    await this.viewer.importXML(this.appViewer);
    this.viewer.attachTo(this.elementRef.nativeElement);

    if (this.svg) {
      const svgContent = (await this.viewer.saveSVG()).svg;
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');

      this.elementRef.nativeElement.innerHTML = svgElement.outerHTML;
    } else {
      this.resizeCanvas();
      this.#risize = this.#risize$.subscribe();
      const eventBus: any = this.viewer.get('eventBus');
      eventBus.on('element.click', (event: any) => {
        this.elementClick.emit(event.element.id);
      });
    }
  }

  ngOnDestroy(): void {
    this.elementClick.complete();
    this.#risize?.unsubscribe();
    this.viewer.destroy();
  }
}

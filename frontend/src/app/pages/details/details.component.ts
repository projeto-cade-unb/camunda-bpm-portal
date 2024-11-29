import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import { AccordionModule } from 'primeng/accordion';
import { map, Observable, switchMap } from 'rxjs';
import { AuthorizeMenuComponent } from '../../components/authorize-menu/authorize-menu.component';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';
import { ViewerDirective } from '../../components/viewer.directive';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';
import { ProcessDefinitionService } from '../../process-definition.service';
import { RoutingService } from '../../routing.service';
import { isStaticApp } from '../../static-app';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ViewerDirective,
    ShareDialogComponent,
    AuthorizeMenuComponent,
    AccordionModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  selectedDocumentation = '';
  processDefinition$!: Observable<any>;
  viewer = new NavigatedViewer();
  versions$!: Observable<number[]>;
  versionSelected$: Observable<number> = this.routingService.url$.pipe(
    map((url) => Number(url.searchParams.get('version')))
  );

  @Input({ required: true })
  processDefinitionKey!: string;

  constructor(
    public domSanitizer: DomSanitizer,
    private processDefinitionDocumentationService: ProcessDefinitionDocumentationService,
    private processDefinitionService: ProcessDefinitionService,
    private routingService: RoutingService
  ) {}

  setVersion(event: any) {
    if (event.target.value === 'null') {
      this.routingService.deleteSearchParams('version');
      return;
    }

    this.routingService.setSearchParams('version', event.target.value);
  }

  ngOnInit(): void {
    if (!this.processDefinitionKey) {
      return;
    }

    this.versions$ = this.processDefinitionService.findManyVersions(
      this.processDefinitionKey
    );

    this.processDefinition$ = this.versionSelected$.pipe(
      switchMap((version) =>
        this.processDefinitionDocumentationService.findManyDocumentation(
          this.processDefinitionKey,
          version
        )
      )
    );
  }

  scrollToElementById(id: string) {
    this.selectedDocumentation = id;

    const container = isStaticApp
      ? document.documentElement
      : document.querySelector('.ctn-wrapper');

    if (!container) {
      return;
    }

    const targetElement = container.querySelector(`#${id}.diagram-item`);

    if (!targetElement) {
      return;
    }

    let scrollPosition: number;

    if (isStaticApp) {
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      scrollPosition = elementPosition;
    } else {
      const containerRect = container.getBoundingClientRect();
      const elementRect = targetElement.getBoundingClientRect();
      scrollPosition =
        elementRect.top - containerRect.top + container.scrollTop;
    }

    container.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  }
}

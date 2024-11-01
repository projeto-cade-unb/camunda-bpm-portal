import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import { Observable } from 'rxjs';
import { AuthorizeMenuComponent } from '../../components/authorize-menu/authorize-menu.component';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';
import { ViewerDirective } from '../../components/viewer.directive';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';
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
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  selectedDocumentation = '';
  processDefinition$!: Observable<any>;
  viewer = new NavigatedViewer();

  @Input({ required: true })
  processDefinitionKey!: string;

  constructor(
    public domSanitizer: DomSanitizer,
    private processDefinitionDocumentationService: ProcessDefinitionDocumentationService
  ) {}

  ngOnInit(): void {
    if (!this.processDefinitionKey) {
      return;
    }

    this.processDefinition$ =
      this.processDefinitionDocumentationService.findMany(
        this.processDefinitionKey
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

    const targetElement = container?.querySelector(`#${id}.diagram-item`);

    if (!targetElement) {
      return;
    }

    const scrollPosition =
      targetElement.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    container.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  }
}

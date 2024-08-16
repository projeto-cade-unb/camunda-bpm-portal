import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ViewerDirective } from '../../components/viewer.directive';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, ViewerDirective, RouterLink, ShareDialogComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  processDefinition$;

  constructor(
    public domSanitizer: DomSanitizer,
    activeRoute: ActivatedRoute,
    processDefinitionDocumentationService: ProcessDefinitionDocumentationService
  ) {
    this.processDefinition$ = processDefinitionDocumentationService.findOne(
      activeRoute.snapshot.params['id']
    );
  }
}

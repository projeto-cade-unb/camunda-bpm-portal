import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewerDirective } from '../../components/viewer.directive';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, ViewerDirective, RouterLink],
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

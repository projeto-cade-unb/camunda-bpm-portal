import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollTopModule } from 'primeng/scrolltop';
import { AuthorizeMenuComponent } from '../../components/authorize-menu/authorize-menu.component';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';
import { ViewerDirective } from '../../components/viewer.directive';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ScrollTopModule,
    TranslateModule,
    ViewerDirective,
    RouterLink,
    ShareDialogComponent,
    AuthorizeMenuComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  selectedDocumentation = '';
  processDefinition$;

  constructor(
    public domSanitizer: DomSanitizer,
    activeRoute: ActivatedRoute,
    processDefinitionDocumentationService: ProcessDefinitionDocumentationService
  ) {
    this.processDefinition$ = processDefinitionDocumentationService.findMany(
      activeRoute.snapshot.params['id']
    );
  }

  scrollToElementById(id: string) {
    this.selectedDocumentation = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}

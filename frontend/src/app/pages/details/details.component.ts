import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorizeMenuComponent } from '../../components/authorize-menu/authorize-menu.component';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';
import { ViewerDirective } from '../../components/viewer.directive';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
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
    router: Router,
    processDefinitionDocumentationService: ProcessDefinitionDocumentationService
  ) {
    const key = activeRoute.snapshot.queryParams['key'];

    if (!key) {
      router.navigate(['/portal-documentation']);
    } else {
      this.processDefinition$ =
        processDefinitionDocumentationService.findMany(key);
    }
  }

  scrollToElementById(id: string) {
    this.selectedDocumentation = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}

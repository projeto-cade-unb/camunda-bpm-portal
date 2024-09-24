import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorizeMenuComponent } from '../../components/authorize-menu/authorize-menu.component';
import { ShareDialogComponent } from '../../components/share-dialog/share-dialog.component';
import { ViewerDirective } from '../../components/viewer.directive';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';
import { Observable } from 'rxjs';

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
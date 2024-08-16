import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProcessDefinitionDocumentationService } from '../../process-definition-documentation.service';
import { CardGridComponent } from "../../components/card-grid/card-grid.component";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, CardGridComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  processDefinition$ = this.processDefinitionDocumentationService.findMany();

  constructor(
    private processDefinitionDocumentationService: ProcessDefinitionDocumentationService
  ) {}
}

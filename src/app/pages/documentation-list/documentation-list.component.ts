import { Component } from "@angular/core";
import { ProcessDefinitionService } from "../../api/process-definition/process-definition.service";

@Component({
  selector: 'custom-documentation-list',
  templateUrl: './documentation-list.component.html',
  styleUrls: ['./documentation-list.component.css'],
})
export class DocumentationListComponent {
  processDefinition$ = this.processDefinitionService.findAllProcessDefinition();

  constructor(private processDefinitionService: ProcessDefinitionService) {}
}

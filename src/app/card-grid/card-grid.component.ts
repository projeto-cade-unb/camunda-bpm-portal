import { Component, OnInit } from "@angular/core";
import { ProcessDefinitionService } from "../process-definition.service";
import { ProcessDefinition } from "../process-definition";

@Component({
  selector: 'custom-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.css'],
})
export class CardGridComponent implements OnInit {
  processDefinitions: ProcessDefinition[] = [];

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  async ngOnInit() {
    this.processDefinitions =
      await this.processDefinitionService.findAllProcessDefinitions();
  }
}

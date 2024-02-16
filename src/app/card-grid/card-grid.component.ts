import { Component, OnInit } from "@angular/core";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";

@Component({
  selector: "custom-card-grid",
  templateUrl: "./card-grid.component.html",
  styleUrls: ["./card-grid.component.css"],
})
export class CardGridComponent implements OnInit {
  processDefinitions =
    this.processDefinitionService.findAllProcessDefinition();

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  ngOnInit(): void {}
}

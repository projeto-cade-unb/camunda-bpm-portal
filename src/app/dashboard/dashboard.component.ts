import { Component } from "@angular/core";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";

@Component({
  selector: "custom-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  processDefinitions = this.processDefinitionService.findAllProcessDefinition();

  constructor(private processDefinitionService: ProcessDefinitionService) {}
}

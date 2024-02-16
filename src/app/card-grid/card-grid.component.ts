import { Component, Input } from "@angular/core";
import { ProcessDefinition } from "../process-definition/process-definition";

@Component({
  selector: "custom-card-grid",
  templateUrl: "./card-grid.component.html",
  styleUrls: ["./card-grid.component.css"],
})
export class CardGridComponent {
  @Input() processDefinitions: ProcessDefinition[];
}

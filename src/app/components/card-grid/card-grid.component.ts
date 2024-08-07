import { Component, Input } from "@angular/core";
import { ProcessDefinition } from "../../api/process-definition/process-definition";

@Component({
  selector: "custom-card-grid",
  templateUrl: "./card-grid.component.html",
  styleUrls: ["./card-grid.component.css"],
})
export class CardGridComponent {
  @Input() processDefinition: ProcessDefinition[];
}

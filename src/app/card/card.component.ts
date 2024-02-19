import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ProcessDefinition } from "../process-definition/process-definition";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";

@Component({
  selector: "custom-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  @Input() processDefinition: ProcessDefinition;

  xml$: Observable<string>;

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  ngOnInit(): void {
    this.xml$ =
      this.processDefinitionService.findOneDiagramByProcessDefinitionId(
        this.processDefinition.id
      );
  }
}

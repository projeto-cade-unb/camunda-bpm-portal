import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ProcessDefinition } from "../../api/process-definition/process-definition";
import { ProcessDefinitionService } from "../../api/process-definition/process-definition.service";
import { ProcessDocumentationService } from "src/app/pages/process-documentation.service";

@Component({
  selector: "custom-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  @Input() processDefinition: ProcessDefinition;

  diagram$: Observable<string>;

  constructor(
    private processDefinitionService: ProcessDefinitionService,
    public processDocumentationService: ProcessDocumentationService
  ) {}

  ngOnInit(): void {
    this.diagram$ =
      this.processDefinitionService.findOneDiagramByProcessDefinitionId(
        this.processDefinition.id
      );
  }
}

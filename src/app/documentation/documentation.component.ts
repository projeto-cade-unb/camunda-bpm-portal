import { Component, OnInit } from "@angular/core";
import { Observable, mergeMap } from "rxjs";
import { ProcessDefinition } from "../process-definition/process-definition";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";

@Component({
  selector: "custom-documentation",
  templateUrl: "./documentation.component.html",
  styleUrls: ["./documentation.component.css"],
})
export class DocumentationComponent implements OnInit {
  processDefinition$: Observable<ProcessDefinition>;
  xml$: Observable<string>;
  searchParams = new URL(document.location.href.replace("#/", "")).searchParams;

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  ngOnInit(): void {
    this.processDefinition$ =
      this.processDefinitionService.findOneProcessDefinitionByProcessDefinitionId(
        this.searchParams.get("id")
      );

    this.xml$ = this.processDefinition$.pipe(
      mergeMap(({ id }) =>
        this.processDefinitionService.findOneDiagramByProcessDefinitionId(id)
      )
    );
  }
}

import { Component, ViewEncapsulation } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { filter, mergeMap, of, switchMap } from "rxjs";
import { ProcessDefinitionService } from "../process-definition/process-definition.service";

@Component({
  selector: "custom-documentation",
  templateUrl: "./documentation.component.html",
  styleUrls: ["./documentation.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationComponent {
  searchParams = new URL(document.location.href.replace("#/", "")).searchParams;

  processDefinition$ = of(this.searchParams.get("id")).pipe(
    filter((id) => !!id),
    switchMap((id) =>
      this.processDefinitionService.findOneProcessDefinitionByProcessDefinitionId(
        id
      )
    )
  );

  diagram$ = this.processDefinition$.pipe(
    mergeMap(({ id }) =>
      this.processDefinitionService.findOneDiagramByProcessDefinitionId(id)
    )
  );

  constructor(private processDefinitionService: ProcessDefinitionService) {}

  selectionChanged(viewer: Viewer) {
    viewer.on("selection.changed", () => {
      const selection: any = viewer.get("selection");
      const id = selection.get()?.at(0)?.id;

      if (id) document.getElementById(id)?.scrollIntoView();
    });
  }
}

import { Component, ViewEncapsulation } from "@angular/core";
import Viewer from "bpmn-js/lib/Viewer";
import { filter, of, switchMap } from "rxjs";
import { ProcessDefinitionService } from "src/app/api/process-definition/process-definition.service";
import { ProcessDocumentationService } from "../process-documentation.service";

@Component({
  selector: "custom-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  searchParams = new URL(document.location.href.replace("#/", "")).searchParams;

  processDefinition$ = this.processDocumentationService.id.pipe(
    switchMap((id) =>
      id
        ? this.processDefinitionService.findOneProcessDefinitionByProcessDefinitionId(
            id
          )
        : of(null)
    )
  );

  diagram$ = this.processDefinition$.pipe(
    filter((processDefinition) => !!processDefinition?.id),
    switchMap(({ id }) =>
      this.processDefinitionService.findOneDiagramByProcessDefinitionId(id)
    )
  );

  constructor(
    private processDefinitionService: ProcessDefinitionService,
    private processDocumentationService: ProcessDocumentationService
  ) {
    this.processDocumentationService.id.next(this.searchParams.get("id"));
  }

  selectionChanged(viewer: Viewer) {
    viewer.on("selection.changed", () => {
      const selection: any = viewer.get("selection");
      const id = selection.get()?.at(0)?.id;

      if (id) {
        document.getElementById(id)?.scrollIntoView();
      }
    });
  }

  clear() {
    this.processDocumentationService.id.next(null);
    location.search = "";
  }
}

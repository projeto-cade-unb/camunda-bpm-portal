import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { get } from "../../utils/request";
import { ProcessDefinition } from "./process-definition";

@Injectable({
  providedIn: "root",
})
export class ProcessDefinitionService {
  findOneProcessDefinitionByProcessDefinitionId(id: string) {
    return from(
      get(
        `%API%/engine/%ENGINE%/process-definition/${id}`
      ).then<ProcessDefinition>((response) => response.json())
    );
  }

  findAllProcessDefinition() {
    return from(
      get(
        "%COCKPIT_API%/plugin/base/default/process-definition/statistics"
      ).then<ProcessDefinition[]>((response) => response.json())
    );
  }

  findOneDiagramByProcessDefinitionId(id: string) {
    return from(
      get(`%API%/engine/%ENGINE%/process-definition/${id}/xml`)
        .then((response) => response.json())
        .then<string>(({ bpmn20Xml }) => bpmn20Xml)
    );
  }
}

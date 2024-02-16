import { Injectable } from "@angular/core";
import { get } from "../../utils/request";
import { from } from "rxjs";
import { ProcessDefinition } from "./process-definition";

@Injectable({
  providedIn: "root",
})
export class ProcessDefinitionService {
  findAllProcessDefinition() {
    return from(
      get(
        "/camunda/api/cockpit/plugin/base/default/process-definition/statistics",
        {}
      ).then<ProcessDefinition[]>((response) => response.json())
    );
  }

  findOneBpmnXMLByProcessDefinitionId(id: string) {
    return from(
      get(`%API%/engine/%ENGINE%/process-definition/${id}/xml`, {})
        .then((response) => response.json())
        .then<string>(({ bpmn20Xml: xml }) => xml)
    );
  }
}

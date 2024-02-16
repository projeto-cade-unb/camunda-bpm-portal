import { Injectable } from "@angular/core";
import { get } from "../utils/request";
import { from } from "rxjs";
import { ProcessDefinition } from "./process-definition";

@Injectable({
  providedIn: "root",
})
export class ProcessDefinitionService {
  constructor() {}

  findAllProcessDefinition() {
    return from<ProcessDefinition[]>(
      get(
        "/camunda/api/cockpit/plugin/base/default/process-definition/statistics",
        {}
      ).then((response) => response.json())
    );
  }

  findOneBpmnXMLByProcessDefinitionId(id: string) {
    return from<string>(get(`%API%/engine/%ENGINE%/process-definition/${id}/xml`, {})
      .then((response) => response.json())
      .then(({ bpmn20Xml: xml }) => xml));
  }
}

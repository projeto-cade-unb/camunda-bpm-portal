import { Injectable } from "@angular/core";
import { get } from "../utils/request";

@Injectable({
  providedIn: "root",
})
export class ProcessDefinitionService {
  constructor() {}

  findAllProcessDefinitions() {
    return get(
      "/camunda/api/cockpit/plugin/base/default/process-definition/statistics",
      {}
    ).then((response) => response.json());
  }

  findOneBpmnXMLByProcessDefinitionsId(id: string) {
    return get(`%API%/engine/%ENGINE%/process-definition/${id}/xml`, {})
      .then((response) => response.json())
      .then(({ bpmn20Xml: xml }) => xml);
  }
}

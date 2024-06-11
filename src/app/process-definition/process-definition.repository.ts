import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProcessDefinition } from "./process-definition";

@Injectable({
  providedIn: "root",
})
export class ProcessDefinitionRepository {
  constructor(private httpClient: HttpClient) {}

  findOneProcessDefinitionByProcessDefinitionId(id: string) {
    return this.httpClient.get<ProcessDefinition>(
      `/camunda/api/engine/engine/default/process-definition/${id}`
    );
  }

  findAllProcessDefinition(params) {
    return this.httpClient.get<ProcessDefinition[]>(
      "/camunda/api/engine/engine/default/process-definition?latestVersion=true",
      { params }
    );
  }

  findOneDiagramByProcessDefinitionId(id: string) {
    return this.httpClient.get<{ bpmn20Xml: string }>(
      `/camunda/api/engine/engine/default/process-definition/${id}/xml`
    );
  }
}

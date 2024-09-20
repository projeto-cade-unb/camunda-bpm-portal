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
      `/engine-rest/process-definition/${id}`
    );
  }

  findAllProcessDefinition(params) {
    return this.httpClient.get<ProcessDefinition[]>(
      "/engine-rest/process-definition",
      { params }
    );
  }

  findOneDiagramByProcessDefinitionId(id: string) {
    return this.httpClient.get<{ bpmn20Xml: string }>(
      `/engine-rest/process-definition/${id}/xml`
    );
  }
}

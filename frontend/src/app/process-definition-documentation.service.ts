import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProcessDefinitionDocumentationService {
  constructor(private http: HttpClient) {}

  findManyDocumentation(processDefinitionKey?: string, version?: number) {
    const params = Object();

    if (processDefinitionKey) {
      params.processDefinitionKey = processDefinitionKey;
    }

    if (version) {
      params.version = version;
    }

    return this.http.get<any>(
      `/camunda/api/cockpit/plugin/portal-documentation/process-definition`,
      { params }
    );
  }
}

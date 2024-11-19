import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProcessDefinitionService {
  constructor(private http: HttpClient) {}

  findManyVersions(processDefinitionKey: string) {
    const params = Object();

    if (processDefinitionKey) {
      params.processDefinitionKey = processDefinitionKey;
    }

    return this.http.get<any>(
      `/camunda/api/cockpit/plugin/portal-documentation/process-definition-versions`,
      { params }
    );
  }
}

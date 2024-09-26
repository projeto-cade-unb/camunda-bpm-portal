import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProcessDefinitionDocumentationService {
  constructor(private http: HttpClient) {}

  findMany(processDefinitionKey?: string) {
    return this.http.get<any>(
      `/camunda/api/cockpit/plugin/portal-documentation/process-definition`,
      {
        params: {
          processDefinitionKey: processDefinitionKey || '',
        },
      }
    );
  }
}

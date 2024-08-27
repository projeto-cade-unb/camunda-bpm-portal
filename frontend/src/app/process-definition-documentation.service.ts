import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProcessDefinitionDocumentationService {
  constructor(private http: HttpClient) {}

  findOne(processDefinitionId: string) {
    return this.http.get<any>(
      `/camunda/api/cockpit/plugin/portal-documentation/process-definition/${processDefinitionId}`
    );
  }

  findMany() {
    return this.http.get<any[]>(
      `/camunda/api/cockpit/plugin/portal-documentation/process-definition`
    );
  }
}

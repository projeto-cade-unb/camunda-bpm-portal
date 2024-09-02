import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private httpClient: HttpClient) {}

  setGlobalProcessDefinitionAuthorization(processDefinitionKey: string) {
    return this.httpClient.post(
      '/camunda/api/engine/engine/default/authorization/create',
      {
        permissions: ['ALL'],
        resourceType: 6,
        resourceId: processDefinitionKey,
        type: '0',
        userId: '*',
      }
    );
  }

  deleteGlobalProcessDefinitionAuthorization(authorizationId: string) {
    return this.httpClient.delete(
      `/camunda/api/engine/engine/default/authorization/${authorizationId}`
    );
  }
}

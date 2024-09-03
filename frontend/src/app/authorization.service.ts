import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private httpClient: HttpClient) {}

  setGlobalProcessDefinitionAuthorization(processDefinition: any) {
    return this.#setGlobalProcessDefinitionAuthorization(processDefinition.key)
      .pipe(first())
      .subscribe(({ id }: any) => {
        processDefinition.authorizationId = id;
        processDefinition.editable = true;
      });
  }

  deleteGlobalProcessDefinitionAuthorization(processDefinition: any) {
    if (!processDefinition.authorizationId) {
      return;
    }

    return this.#deleteGlobalProcessDefinitionAuthorization(
      processDefinition.authorizationId
    )
      .pipe(first())
      .subscribe(() => {
        processDefinition.authorizationId = null;
        processDefinition.editable = false;
      });
  }

  #setGlobalProcessDefinitionAuthorization(processDefinitionKey: string) {
    return this.httpClient.post(
      '/camunda/api/engine/engine/default/authorization/create',
      {
        permissions: ['READ'],
        resourceType: 6,
        resourceId: processDefinitionKey,
        type: '0',
        userId: '*',
      }
    );
  }

  #deleteGlobalProcessDefinitionAuthorization(authorizationId: string) {
    return this.httpClient.delete(
      `/camunda/api/engine/engine/default/authorization/${authorizationId}`
    );
  }
}

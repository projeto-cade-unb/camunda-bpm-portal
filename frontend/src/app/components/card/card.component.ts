import { Component, Input } from '@angular/core';
import { ViewerDirective } from '../viewer.directive';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../authorization.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ViewerDirective, RouterLink, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() editable = false;
  @Input({ required: true }) processDefinition: any;

  constructor(private authorizationService: AuthorizationService) {}

  setGlobalProcessDefinitionAuthorization(processDefinition: any) {
    return this.authorizationService
      .setGlobalProcessDefinitionAuthorization(processDefinition.key)
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

    return this.authorizationService
      .deleteGlobalProcessDefinitionAuthorization(
        processDefinition.authorizationId
      )
      .pipe(first())
      .subscribe(() => {
        processDefinition.authorizationId = null;
        processDefinition.editable = false;
      });
  }
}

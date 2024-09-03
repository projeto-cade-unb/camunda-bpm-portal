import { Component, Input } from '@angular/core';
import { AuthorizationService } from '../../authorization.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-authorize-menu',
  standalone: true,
  imports: [ TranslateModule ],
  templateUrl: './authorize-menu.component.html',
  styleUrl: './authorize-menu.component.scss',
})
export class AuthorizeMenuComponent {
  @Input({ required: true }) processDefinition: any;

  constructor(public authorizationService: AuthorizationService) {}
}

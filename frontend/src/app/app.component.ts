import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DetailsComponent } from './pages/details/details.component';
import { ListComponent } from './pages/list/list.component';
import { RoutingService } from './routing.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ListComponent, DetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  processDefinitionKey$ = this.routingService.hashChange.pipe(
    map(() => location.hash.split('/')[2])
  );

  constructor(
    translateService: TranslateService,
    private routingService: RoutingService
  ) {
    translateService.setDefaultLang(translateService.getBrowserLang() || 'en');
  }
}

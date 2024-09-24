import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DetailsComponent } from './pages/details/details.component';
import { ListComponent } from './pages/list/list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ListComponent, DetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  get processDefinitionKey() {
    return location.hash.split('/')[2];
  }

  constructor(translateService: TranslateService) {
    translateService.setDefaultLang(translateService.getBrowserLang() || 'en');
  }
}

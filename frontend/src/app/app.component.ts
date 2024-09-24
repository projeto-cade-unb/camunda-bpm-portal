import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ListComponent } from './pages/list/list.component';
import { DetailsComponent } from './pages/details/details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ListComponent, DetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  processDefinitionKey = location.hash.split('/')[2];

  constructor(translateService: TranslateService) {
    translateService.setDefaultLang(translateService.getBrowserLang() || 'en');
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorizeMenuComponent } from '../authorize-menu/authorize-menu.component';
import { ViewerDirective } from '../viewer.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    ViewerDirective,
    CommonModule,
    TranslateModule,
    AuthorizeMenuComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() editable = false;
  @Input({ required: true }) processDefinition: any;
}

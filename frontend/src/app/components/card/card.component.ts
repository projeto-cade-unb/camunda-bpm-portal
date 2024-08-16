import { Component, Input } from '@angular/core';
import { ViewerDirective } from '../viewer.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ViewerDirective, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input({ required: true }) processDefinition: any;
}

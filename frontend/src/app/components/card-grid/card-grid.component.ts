import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss',
})
export class CardGridComponent {
  @Input({ required: true }) processDefinitions: any;
}

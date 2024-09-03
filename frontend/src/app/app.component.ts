import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListComponent } from './pages/list/list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ListComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [DialogModule, InputTextModule, Button],
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.scss',
})
export class ShareDialogComponent {
  visible = false;
  url = location.href;

  copy(element: HTMLInputElement) {
    element.select();
    document.execCommand('copy');
  }
}

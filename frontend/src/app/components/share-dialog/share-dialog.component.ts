import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import {
  InputGroupAddonModule
} from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    InputGroupModule,
    OverlayPanelModule,
    InputGroupAddonModule,
  ],
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

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
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
    RouterLink,
    TranslateModule
  ],
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.scss',
})
export class ShareDialogComponent {
  visible = false;
  appPath = `${location.host}/camunda/api/cockpit/plugin/portal-documentation/static/app/${location.hash}`;
  iframe = `<iframe src="${this.appPath}" height="100vh" width="100%" title="Portal Documentation"></iframe>`;

  copy(element: HTMLInputElement) {
    element.select();
    document.execCommand('copy');
  }
}

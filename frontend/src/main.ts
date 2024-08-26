import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const cockpitDashboard = {
  id: 'portal-documentation.dashboard',
  pluginPoint: 'cockpit.dashboard',
  priority: 0,
  render: (container: any) => {
    container.innerHTML = `<app-root></app-root>`;
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );
  },
  properties: {
    label: 'Portal Documentation',
  },
};

export default [cockpitDashboard];

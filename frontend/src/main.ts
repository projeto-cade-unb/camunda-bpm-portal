import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (document.querySelector('app-root')) {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
}

const cockpitDashboard = {
  id: 'portal-documentation.dashboard',
  pluginPoint: 'cockpit.dashboard',
  priority: 0,
  render: (container: HTMLElement) => {
    container.innerHTML = `<app-root></app-root>`;
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );
  },
  properties: {
    label: 'Portal Documentation',
  },
};

const cockpitDashboardPage = {
  id: 'portal-documentation.dashboardPage',
  pluginPoint: 'cockpit.route',
  priority: 0,
  render: (container: HTMLElement) => {
    container.innerHTML = `<app-root></app-root>`;
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );
  },
  properties: {
    path: '/portal-documentation',
  },
};

const cockpitNavigation = {
  id: 'portal-documentation.navigation',
  pluginPoint: 'cockpit.navigation',
  priority: 0,
  render: (container: HTMLElement) => {
    container.innerHTML = `<a href="#/portal-documentation">Portal Documentation</a>`;
  },
};

export default [
  // cockpitDashboard,
  cockpitDashboardPage,
  cockpitNavigation,
];

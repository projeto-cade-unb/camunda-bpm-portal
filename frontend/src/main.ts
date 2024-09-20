import { ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (document.querySelector('app-root')) {
  bootstrapApplication(AppComponent, appConfig);
}

let appRef: ApplicationRef | null = null;

const bootstrapApp = (container: HTMLElement) => {
  if (!appRef) {
    container.innerHTML = `
      <style>
        .ctn-wrapper {
          overflow: scroll !important;
        }
      </style>
      <app-root></app-root>
    `;
    bootstrapApplication(AppComponent, appConfig)
      .then((ref) => {
        appRef = ref;
      })
      .catch((err) => console.error(err));
  }
};

const createPlugin = (
  id: string,
  pluginPoint: string,
  render: (container: HTMLElement) => void,
  properties = {}
) => ({
  id,
  pluginPoint,
  priority: 0,
  render,
  unmount: () => {
    appRef?.destroy();
    appRef = null;
  },
  properties,
});

const cockpitDashboard = createPlugin(
  'portal-documentation.dashboard',
  'cockpit.dashboard',
  bootstrapApp,
  { label: 'Portal Documentation' }
);

const cockpitDashboardPage = createPlugin(
  'portal-documentation.dashboardPage',
  'cockpit.route',
  bootstrapApp,
  { path: '/portal-documentation' }
);

const cockpitNavigation = createPlugin(
  'portal-documentation.navigation',
  'cockpit.navigation',
  (container) => {
    container.innerHTML = `<a href="#/portal-documentation">Portal Documentation</a>`;
  }
);

export default [cockpitDashboard, cockpitDashboardPage, cockpitNavigation];

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
  unmount: () => {
    document.querySelector('app-root')?.remove();
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
    container.innerHTML = `
    <style>
      .ctn-wrapper {
        overflow: scroll !important;
      }
    </style>
    <app-root></app-root>`;
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );
  },
  unmount: () => {
    document.querySelector('app-root')?.remove();
  },
  properties: {
    path: '/portal-documentation',
  },
};

const cockpitDashboardPageDefinition = {
  id: 'portal-documentation.dashboardPageDefinition',
  pluginPoint: 'cockpit.route',
  priority: 0,
  render: (container: HTMLElement) => {
    container.innerHTML = `
    <style>
      .ctn-wrapper {
        overflow: scroll !important;
      }
    </style>
    <app-root></app-root>`;
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );
  },
  unmount: () => {
    document.querySelector('app-root')?.remove();
  },
  properties: {
    path: '/portal-documentation/definition',
  },
};

const cockpitNavigation = {
  id: 'portal-documentation.navigation',
  pluginPoint: 'cockpit.navigation',
  priority: 0,
  render: (container: HTMLElement) => {
    container.innerHTML = `<a href="#/portal-documentation">Portal Documentation</a>`;
  },
  unmount: () => {
    document.querySelector('app-root')?.remove();
  },
};

export default [
  cockpitDashboard,
  cockpitDashboardPage,
  cockpitNavigation,
  cockpitDashboardPageDefinition,
];

import { ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

let app: ApplicationRef | null = null;

if (document.querySelector('app-root')) {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
}

const unmount = () => {
  if (app) {
    app.destroy();
    document.querySelector('app-root')?.remove();
    app = null;
    return;
  }
};

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
  unmount,
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
  unmount,
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
  unmount,
  properties: {
    path: '/portal-documentation/:processDefinitionKey',
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
  cockpitDashboard,
  cockpitDashboardPage,
  cockpitNavigation,
  cockpitDashboardPageDefinition,
];

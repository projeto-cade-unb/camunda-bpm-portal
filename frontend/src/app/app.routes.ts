import { Routes } from '@angular/router';
import { DetailsComponent } from './pages/details/details.component';
import { ListComponent } from './pages/list/list.component';

export const routes: Routes = [
  {
    path: 'portal-documentation',
    component: ListComponent,
  },
  {
    path: 'portal-documentation/definition',
    component: DetailsComponent,
  },
  {
    path: 'dashboard',
    component: ListComponent,
  },
];

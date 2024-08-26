import { Routes } from '@angular/router';
import { DetailsComponent } from './pages/details/details.component';
import { ListComponent } from './pages/list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: ':id',
    component: DetailsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

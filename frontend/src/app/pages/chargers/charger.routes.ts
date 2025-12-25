import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./charger-list/charger-list.component').then(m => m.ChargerListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./charger-detail/charger-detail.component').then(m => m.ChargerDetailComponent)
  }
];


import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'add',
    pathMatch: 'full'
  },
  {
    path: 'add',
    loadComponent: () => import('./add-charger/add-charger.component').then(m => m.AddChargerComponent)
  }
];


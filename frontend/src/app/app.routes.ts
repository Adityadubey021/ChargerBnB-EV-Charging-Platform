import { Routes } from '@angular/router';
import { authGuard, hostGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'chargers',
    loadChildren: () => import('./pages/chargers/charger.routes').then(m => m.routes)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'host',
    canActivate: [hostGuard],
    loadChildren: () => import('./pages/host/host.routes').then(m => m.routes)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

import {Routes} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./components/index').then(com => com.LoginComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/index').then(com => com.HomeComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./components/index').then(com => com.RegisterComponent),
    },
  {
    path: 'admin',
    loadComponent: () => import('./components/index').then(com => com.AdminComponent),
  }
];

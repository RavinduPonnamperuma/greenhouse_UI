import {Routes} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./components/index').then(com => com.LoginComponent),
    },
    {
        path: 'home',
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

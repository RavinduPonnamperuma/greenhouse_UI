import {Routes} from '@angular/router';
import {ManageSensorsComponent} from "./components/manage-sensors/manage-sensors.component";


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
  },
  {
    path: 'chart',
    loadComponent: () => import('./components/index').then(com => com.ChartComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./components/index').then(com => com.UserManageComponent),
  },
  {
    path: 'sensors',
    loadComponent: () => import('./components/index').then(com => com.ManageSensorsComponent),
  },
  {
    path: 'plants',
    loadComponent: () => import('./components/index').then(com => com.ManagePlantsComponent),
  },
  {
    path: 'green-houses',
    loadComponent: () => import('./components/index').then(com => com.ManageGreenHouseComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/index').then(com => com.ManageContactComponent),
  },
];

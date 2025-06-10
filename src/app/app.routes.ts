import {Routes} from '@angular/router';
import {AuthGuard} from "./auth.guard";


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/index').then(com => com.LoginComponent),

  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/index').then(com => com.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/index').then(com => com.RegisterComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/index').then(com => com.AdminComponent),
    canActivate: [AuthGuard]
  }, {
    path: 'polytunnel',
    loadComponent: () => import('./components/index').then(com => com.PolytunnelComponent),
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'plant',
    loadComponent: () => import('./components/index').then(com => com.PlantComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'harvest',
    loadComponent: () => import('./components/index').then(com => com.HarvestComponent),
    canActivate: [AuthGuard]
  }
  , {
    path: 'irrigation',
    loadComponent: () => import('./components/index').then(com => com.IrrigationComponent),
    canActivate: [AuthGuard]
  }

];

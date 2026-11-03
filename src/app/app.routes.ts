import { Routes } from '@angular/router';
import { StudioPageComponent } from './studio-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: StudioPageComponent },
  { path: 'about', redirectTo: '/#about', pathMatch: 'full' },
  { path: 'projects', redirectTo: '/#projects', pathMatch: 'full' },
  { path: 'contact', redirectTo: '/#contact', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./not-found').then((module) => module.NotFoundComponent),
  },
];

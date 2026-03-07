import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
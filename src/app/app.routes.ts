import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ContactComponent } from './components/contact/contact';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'projects', component: HomeComponent },
  { path: 'contact', component: ContactComponent }
];
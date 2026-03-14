import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ContactComponent } from './components/contact/contact';
import { ProjectsComponent } from './components/projects/projects';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent }
];
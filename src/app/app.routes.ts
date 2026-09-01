import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ProjectsComponent } from './components/projects/projects';
import { ContactComponent } from './components/contact/contact';
import { ReleaseGuardianComponent } from './components/release-guardian/release-guardian';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Sue Web Studio | Freelance Web Developer in Auckland' },
  { path: 'about', component: AboutComponent, title: 'About Sue Zadeh | Sue Web Studio' },
  { path: 'projects', component: ProjectsComponent, title: 'Web Development Projects | Sue Web Studio' },
  { path: 'contact', component: ContactComponent, title: 'Start a Project | Sue Web Studio' },
  {
    path: 'release-guardian',
    component: ReleaseGuardianComponent,
    title: 'Release Guardian | Agentic Security Challenge',
  },
  { path: '**', redirectTo: '' },
];

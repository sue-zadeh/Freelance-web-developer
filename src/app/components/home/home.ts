import { RevealDirective } from '../../shared/reveal';
import { Component } from '@angular/core';
import { ShowroomComponent } from '../showroom/showroom';
import { WorkShowcaseComponent } from '../work-showcase/work-showcase';
@Component({
  selector: 'app-home',
  imports: [ShowroomComponent, RevealDirective, WorkShowcaseComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  readonly services = [
    {
      number: '01',
      title: 'A website that brings your business to life.',
      name: 'Business websites',
      text: 'Help people understand what you do, see your work, and get in touch. For service businesses, restaurants, healthcare providers, and community organisations.',
      items: [
        'Mobile-friendly design',
        'Clear service pages & enquiry forms',
        'Search-friendly content & structure',
      ],
      link: 'Talk about a website',
    },
    {
      number: '02',
      title: 'Less admin. More time for your work.',
      name: 'Custom business apps',
      text: 'Replace scattered spreadsheets and repeated tasks with a tool made for your team. Manage members, projects, records, or day-to-day workflows in one place.',
      items: [
        'Dashboards & member areas',
        'Forms, databases & API connections',
        'Access for different staff roles',
      ],
      link: 'Talk about an app',
    },
    {
      number: '03',
      title: 'Give people something to explore.',
      name: 'Interactive & 3D experiences',
      text: 'Show a space, product, or company through animation and interactive scenes. A useful way to introduce a venue or make an idea easier to understand.',
      items: [
        'Interactive product or venue concepts',
        'Animation with a clear purpose',
        'Lightweight, accessible alternatives',
      ],
      link: 'Talk about an experience',
    },
  ];
}

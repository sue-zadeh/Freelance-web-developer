import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  services = [
  {
    title: 'Business Websites',
    description: 'Professional, responsive websites designed to build trust, improve visibility, and support your business goals.'
  },
  {
    title: 'Admin Dashboards',
    description: 'Clean and practical dashboard interfaces for managing users, data, workflows, and internal business operations.'
  },
  {
    title: 'Custom Web Apps & APIs',
    description: 'Web solutions with frontend, backend, and API integration built for real functionality, scalability, and ease of use.'
  }
];
}
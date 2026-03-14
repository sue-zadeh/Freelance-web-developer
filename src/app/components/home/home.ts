import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  services = [
    {
      title: 'Business Websites',
      description:
        'Professional websites designed to present your brand clearly, build trust, and support your business goals.',
    },
    {
      title: 'Admin Dashboards',
      description:
        'Clean and practical dashboard interfaces for managing data, users, workflows, and internal business operations.',
    },
    {
      title: 'Custom Web Apps & APIs',
      description:
        'Web applications with frontend, backend, and API integration built for real functionality, scalability, and ease of use.',
    },
  ];
}

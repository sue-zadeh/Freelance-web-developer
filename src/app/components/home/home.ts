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
  skills = [
    'Business Websites',
    'Admin Dashboards',
    'Custom Web Apps',
    'API Integration',
    'Responsive UI',
    'User-Focused Design',
  ];

  services = [
    {
      title: 'Business Websites',
      description:
        'Professional websites designed to present your brand clearly, build trust, and support your business growth.',
    },
    {
      title: 'Admin Dashboards',
      description:
        'Clean dashboard interfaces for managing users, data, processes, and internal operations with clarity.',
    },
    {
      title: 'Custom Web Apps & APIs',
      description:
        'Modern web applications and API-connected tools built around real business workflows.',
    },
  ];
}
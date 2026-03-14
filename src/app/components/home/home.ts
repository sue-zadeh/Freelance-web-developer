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
        'Freelance web developer creating modern websites, dashboards, and custom web applications.',
    },
  ];
}

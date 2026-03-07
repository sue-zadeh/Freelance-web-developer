import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  services = [
    {
      title: 'Responsive Web Design',
      description: 'Modern and mobile-friendly websites that look great across all devices.'
    },
    {
      title: 'Frontend Development',
      description: 'Clean, interactive user interfaces built with modern tools and best practices.'
    },
    {
      title: 'Business Websites',
      description: 'Professional websites tailored to your brand, services, and audience.'
    }
  ];
}
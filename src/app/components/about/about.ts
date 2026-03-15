import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  highlights = [
    {
      title: 'Business-Focused',
      text: 'Solutions designed around clarity, usability, and real business goals.'
    },
    {
      title: 'Frontend to Backend',
      text: 'Experience building responsive interfaces, dashboards, and connected application flows.'
    },
    {
      title: 'Quality-Minded',
      text: 'Strong attention to testing, structure, detail, and practical user experience.'
    }
  ];

  strengths = [
    'Business websites and service-focused digital experiences',
    'Admin dashboards and internal tools',
    'Custom web applications and API-connected systems',
    'Responsive UI design with clean structure',
    'Testing mindset and detail-focused delivery',
    'Clear communication and practical problem-solving'
  ];
}
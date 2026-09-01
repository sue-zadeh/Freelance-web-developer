import { Component } from '@angular/core';

@Component({
  selector: 'app-release-guardian',
  standalone: true,
  imports: [],
  templateUrl: './release-guardian.html',
  styleUrl: './release-guardian.css',
})
export class ReleaseGuardianComponent {
  readonly metrics = [
    { before: '0/12', after: '12/12', label: 'release controls passed' },
    { before: '12', after: '0', label: 'production vulnerabilities' },
    { before: 'Failing', after: 'Passing', label: 'automated test gate' },
  ];

  readonly controls = [
    'Strict server-side validation',
    'HTML-safe email rendering',
    'Rate limiting and bot honeypot',
    'Security headers and request limits',
    'Privacy-aware contact storage',
    'Repeatable CI release gate',
  ];
}

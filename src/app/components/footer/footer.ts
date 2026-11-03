import { Component } from '@angular/core';
@Component({ selector: 'app-footer', templateUrl: './footer.html', styleUrl: './footer.css' })
export class FooterComponent {
  readonly year = new Date().getFullYear();
}

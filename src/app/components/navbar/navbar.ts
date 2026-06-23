import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  isOpen = false;

  toggleNavbar(): void {
    this.isOpen = !this.isOpen;
  }

  closeNavbar(): void {
    this.isOpen = false;
  }
}
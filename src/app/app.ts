import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }
}
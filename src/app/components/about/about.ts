import { RevealDirective } from '../../shared/reveal';
import { Component } from '@angular/core';
@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {}

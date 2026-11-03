import { Component, signal } from '@angular/core';
import { OrbitControlComponent, OrbitView } from '../orbit-control/orbit-control';
@Component({
  selector: 'app-sandwich',
  imports: [OrbitControlComponent],
  templateUrl: './sandwich.html',
  styleUrl: './sandwich.css',
})
export class SandwichComponent {
  readonly assembled = signal(false);
  readonly angle = signal(330);
  readonly tilt = signal(57);
  setView(view: OrbitView): void {
    this.angle.set(view.angle);
    this.tilt.set(view.tilt);
  }
}

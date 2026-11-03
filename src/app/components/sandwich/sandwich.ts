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
  readonly layers = [
    { name: 'Toasted sourdough base', column: 0, row: 0, height: 0, bread: true },
    { name: 'Fresh lettuce leaves', column: 1, row: 0, height: 12, bread: false },
    { name: 'Juicy tomato slices', column: 2, row: 0, height: 22, bread: false },
    { name: 'Mature cheddar cheese', column: 0, row: 1, height: 32, bread: false },
    { name: 'Fresh cucumber rounds', column: 1, row: 1, height: 42, bread: false },
    { name: 'Golden toasted sourdough top', column: 2, row: 1, height: 56, bread: true },
  ];
  readonly breadDepths = [2, 4, 6];
  setView(view: OrbitView): void {
    this.angle.set(view.angle);
    this.tilt.set(view.tilt);
  }
}

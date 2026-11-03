import { Component, signal } from '@angular/core';
@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.html',
  styleUrl: './showroom.css',
})
export class ShowroomComponent {
  readonly angle = signal(-30);
  readonly evening = signal(false);
  setAngle(event: Event): void {
    this.angle.set(Number((event.target as HTMLInputElement).value));
  }
}

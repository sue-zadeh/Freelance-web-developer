import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../shared/reveal';
import { OrbitControlComponent, OrbitView } from '../orbit-control/orbit-control';
import { SandwichComponent } from '../sandwich/sandwich';

@Component({
  selector: 'app-showroom',
  imports: [RevealDirective, OrbitControlComponent, SandwichComponent],
  templateUrl: './showroom.html',
  styleUrl: './showroom.css',
})
export class ShowroomComponent {
  readonly angle = signal(330);
  readonly tilt = signal(57);
  readonly evening = signal(false);
  readonly smoothView = signal(false);
  readonly dragging = signal(false);
  private pointer?: { id: number; x: number; y: number; angle: number; tilt: number };

  applyView(view: OrbitView): void {
    this.smoothView.set(false);
    this.angle.set(view.angle);
    this.tilt.set(view.tilt);
  }
  setView(tilt: number): void {
    this.smoothView.set(true);
    this.tilt.set(tilt);
  }
  resetView(): void {
    this.smoothView.set(true);
    this.angle.set(330);
    this.tilt.set(57);
  }
  onPointerDown(event: PointerEvent): void {
    if (this.pointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      angle: this.angle(),
      tilt: this.tilt(),
    };
    this.smoothView.set(false);
    this.dragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }
  onPointerMove(event: PointerEvent): void {
    const start = this.pointer;
    if (!start || start.id !== event.pointerId) return;
    this.angle.set(this.wrap(start.angle + (event.clientX - start.x) * 0.7));
    // The scene keeps page scrolling; the orb supports both axes on touch.
    if (event.pointerType !== 'touch')
      this.tilt.set(this.clamp(start.tilt - (event.clientY - start.y) * 0.25));
  }
  onPointerEnd(event: PointerEvent): void {
    if (this.pointer?.id !== event.pointerId) return;
    this.pointer = undefined;
    this.dragging.set(false);
    const scene = event.currentTarget as HTMLElement;
    if (scene.hasPointerCapture?.(event.pointerId)) scene.releasePointerCapture(event.pointerId);
  }
  onViewKey(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const change: Record<string, () => void> = {
      ArrowLeft: () => this.angle.set(this.wrap(this.angle() - 10)),
      ArrowRight: () => this.angle.set(this.wrap(this.angle() + 10)),
      ArrowUp: () => this.tilt.set(this.clamp(this.tilt() - 5)),
      ArrowDown: () => this.tilt.set(this.clamp(this.tilt() + 5)),
      Home: () => this.resetView(),
    };
    if (!change[event.key]) return;
    event.preventDefault();
    this.smoothView.set(false);
    change[event.key]();
  }
  private wrap(angle: number): number {
    return Math.round(((angle % 360) + 360) % 360);
  }
  private clamp(tilt: number): number {
    return Math.round(Math.min(75, Math.max(0, tilt)));
  }
}

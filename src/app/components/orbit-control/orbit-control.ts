import { Component, input, output, signal } from '@angular/core';
export interface OrbitView {
  angle: number;
  tilt: number;
}
@Component({
  selector: 'app-orbit-control',
  template: ` <div class="orbit-control">
    <button
      type="button"
      class="orbit-ball"
      [class.dragging]="dragging()"
      [attr.aria-label]="label()"
      [attr.aria-describedby]="controlId() + '-help'"
      aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home"
      (pointerdown)="onDown($event)"
      (pointermove)="onMove($event)"
      (pointerup)="onEnd($event)"
      (pointercancel)="onEnd($event)"
      (lostpointercapture)="onEnd($event)"
      (keydown)="onKey($event)"
      (click)="onClick()"
    >
      <span
        class="orb-wire"
        aria-hidden="true"
        [style.transform]="'rotateX(' + tilt() + 'deg) rotateY(' + angle() + 'deg)'"
      >
        <i></i><i></i><i></i>
      </span>
      <span class="orb-dot" aria-hidden="true"></span>
    </button>
    <div class="orbit-instructions" [id]="controlId() + '-help'">
      <strong>Drag the orb to explore</strong>
      <span>Arrow keys turn & tilt. Home resets.</span>
      <span class="orbit-values"
        >{{ angle() }}° · {{ tilt() === 0 ? 'Top view' : tilt() + '° tilt' }}</span
      >
    </div>
  </div>`,
  styleUrl: './orbit-control.css',
})
export class OrbitControlComponent {
  readonly angle = input(330);
  readonly tilt = input(57);
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly viewChange = output<OrbitView>();
  readonly dragging = signal(false);
  private pointer?: { id: number; x: number; y: number; angle: number; tilt: number };
  private moved = false;

  onDown(event: PointerEvent): void {
    if (this.pointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      angle: this.angle(),
      tilt: this.tilt(),
    };
    this.moved = false;
    this.dragging.set(true);
    const button = event.currentTarget as HTMLElement;
    button.setPointerCapture?.(event.pointerId);
    button.focus({ preventScroll: true });
  }
  onMove(event: PointerEvent): void {
    const start = this.pointer;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) this.moved = true;
    this.change(start.angle + dx * 1.4, start.tilt - dy * 0.65);
  }
  onEnd(event: PointerEvent): void {
    if (this.pointer?.id !== event.pointerId) return;
    this.pointer = undefined;
    this.dragging.set(false);
    const button = event.currentTarget as HTMLElement;
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
  }
  onClick(): void {
    if (this.moved) {
      this.moved = false;
      return;
    }
    this.change(this.angle() + 15, this.tilt());
  }
  onKey(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [this.angle() - 10, this.tilt()],
      ArrowRight: [this.angle() + 10, this.tilt()],
      ArrowUp: [this.angle(), this.tilt() - 5],
      ArrowDown: [this.angle(), this.tilt() + 5],
      Home: [330, 57],
    };
    if (!moves[event.key]) return;
    event.preventDefault();
    this.change(...moves[event.key]);
  }
  private change(angle: number, tilt: number): void {
    this.viewChange.emit({
      angle: Math.round(((angle % 360) + 360) % 360),
      tilt: Math.round(Math.min(75, Math.max(0, tilt))),
    });
  }
}

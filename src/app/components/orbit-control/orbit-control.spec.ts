import { TestBed } from '@angular/core/testing';
import { OrbitControlComponent, OrbitView } from './orbit-control';

describe('Two-axis orbit control', () => {
  function setup() {
    const fixture = TestBed.createComponent(OrbitControlComponent);
    fixture.componentRef.setInput('controlId', 'test-orbit');
    fixture.componentRef.setInput('label', 'Rotate concept in 3D');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const changes: OrbitView[] = [];
    fixture.componentInstance.viewChange.subscribe((view) => {
      changes.push(view);
      fixture.componentRef.setInput('angle', view.angle);
      fixture.componentRef.setInput('tilt', view.tilt);
    });
    const key = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, cancelable: true });
      button.dispatchEvent(event);
      fixture.detectChanges();
      return event;
    };
    const pointer = (
      name: string,
      x: number,
      y: number,
      type = 'mouse',
      id = 1,
      mouseButton = 0,
    ) => {
      const event = new MouseEvent(name, { clientX: x, clientY: y, button: mouseButton });
      Object.defineProperties(event, { pointerType: { value: type }, pointerId: { value: id } });
      button.dispatchEvent(event);
      fixture.detectChanges();
    };
    return { fixture, button, changes, key, pointer };
  }
  it('wraps a full rotation, bounds tilt and supports Home without intercepting Tab', () => {
    const { fixture, key, changes } = setup();
    fixture.componentRef.setInput('angle', 355);
    fixture.componentRef.setInput('tilt', 0);
    fixture.detectChanges();
    key('ArrowRight');
    expect(changes.at(-1)).toEqual({ angle: 5, tilt: 0 });
    key('ArrowUp');
    expect(changes.at(-1)?.tilt).toBe(0);
    fixture.componentRef.setInput('tilt', 75);
    fixture.detectChanges();
    key('ArrowDown');
    expect(changes.at(-1)?.tilt).toBe(75);
    expect(key('Tab').defaultPrevented).toBe(false);
    key('Home');
    expect(changes.at(-1)).toEqual({ angle: 330, tilt: 57 });
  });
  it('supports both axes on touch and stops after cancellation', () => {
    const { fixture, pointer, changes, button } = setup();
    pointer('pointerdown', 100, 100, 'touch');
    pointer('pointermove', 150, 80, 'touch');
    expect(changes.at(-1)).toEqual({ angle: 40, tilt: 70 });
    expect(button.classList.contains('dragging')).toBe(true);
    pointer('pointercancel', 150, 80, 'touch');
    const count = changes.length;
    pointer('pointermove', 200, 10, 'touch');
    expect(changes).toHaveLength(count);
    expect(fixture.componentInstance.dragging()).toBe(false);
  });
  it('ignores secondary pointers and does not add a click turn at the end of a drag', () => {
    const { pointer, changes, button } = setup();
    pointer('pointerdown', 0, 0, 'mouse', 1, 2);
    pointer('pointermove', 30, 0);
    expect(changes).toHaveLength(0);
    pointer('pointerdown', 0, 0);
    pointer('pointermove', 30, 0, 'touch', 2);
    expect(changes).toHaveLength(0);
    pointer('pointermove', 30, 0);
    pointer('pointerup', 30, 0);
    const count = changes.length;
    button.click();
    expect(changes).toHaveLength(count);
    button.click();
    expect(changes.at(-1)?.angle).toBe(27);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkShowcaseComponent } from './work-showcase';

describe('Turning project previews', () => {
  let fixture: ComponentFixture<WorkShowcaseComponent>;
  let reduced: boolean;
  let hidden: boolean;
  let motionChanged: (event: MediaQueryListEvent) => void;
  let removeMotionListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    reduced = false;
    hidden = false;
    removeMotionListener = vi.fn();
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, listener: typeof motionChanged) => {
        motionChanged = listener;
      },
      removeEventListener: removeMotionListener,
    }));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function setup() {
    fixture = TestBed.createComponent(WorkShowcaseComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const root = fixture.nativeElement.querySelector('.hero-showcase') as HTMLElement;
    const deck = root.querySelector('.browser-stack') as HTMLElement;
    const next = root.querySelector('[aria-label="Next project"]') as HTMLButtonElement;
    const previous = root.querySelector('[aria-label="Previous project"]') as HTMLButtonElement;
    const enter = (pointerType = 'mouse') => {
      const event = new MouseEvent('pointerenter');
      Object.defineProperty(event, 'pointerType', { value: pointerType });
      deck.dispatchEvent(event);
    };
    const advance = (milliseconds: number) => {
      vi.advanceTimersByTime(milliseconds);
      fixture.detectChanges();
    };
    return { root, deck, next, previous, enter, advance, component: fixture.componentInstance };
  }

  it('starts with Lion & Sun, a native Projects link, and no automatic motion on load', async () => {
    const { root, component, advance } = await setup();
    expect(root.querySelector('[data-position="0"] img')?.getAttribute('src')).toBe(
      '/images/lionandsun.webp',
    );
    expect(root.querySelector('.preview-link')?.getAttribute('href')).toBe('#projects');
    expect(root.querySelectorAll('.browser-card')).toHaveLength(3);
    expect(root.querySelectorAll('.browser-card[aria-hidden="true"]')).toHaveLength(2);
    advance(20000);
    expect(component.activeIndex()).toBe(0);
    expect(component.turning()).toBe(false);
  });

  it('browses and wraps in both directions without overlapping turns, announcing manual changes', async () => {
    const { next, previous, root, advance, component } = await setup();
    next.click();
    fixture.detectChanges();
    expect(next.disabled).toBe(true);
    next.click();
    advance(550);
    expect(component.activeIndex()).toBe(1);
    expect(next.disabled).toBe(false);
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'ShowerPower, project 2 of 3',
    );
    next.click();
    advance(550);
    expect(component.activeIndex()).toBe(2);
    next.click();
    advance(550);
    expect(component.activeIndex()).toBe(0);
    previous.click();
    advance(550);
    expect(component.activeIndex()).toBe(2);
  });

  it('turns through all three on hover and stops after leaving without automatic announcements', async () => {
    const { deck, enter, advance, component } = await setup();
    enter();
    advance(2799);
    expect(component.turning()).toBe(false);
    advance(551);
    expect(component.activeIndex()).toBe(1);
    advance(4150);
    expect(component.activeIndex()).toBe(2);
    advance(4150);
    expect(component.activeIndex()).toBe(0);
    expect(component.announcement()).toBe('');
    deck.dispatchEvent(new MouseEvent('pointerleave'));
    advance(20000);
    expect(component.activeIndex()).toBe(0);
  });

  it('ignores touch hover and pauses for keyboard focus while keeping manual controls usable', async () => {
    const { root, next, enter, advance, component } = await setup();
    enter('touch');
    advance(5000);
    expect(component.activeIndex()).toBe(0);
    enter();
    next.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    advance(10000);
    expect(component.activeIndex()).toBe(0);
    next.click();
    advance(550);
    expect(component.activeIndex()).toBe(1);
    next.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: root.querySelector('.preview-link'),
      }),
    );
    advance(10000);
    expect(component.activeIndex()).toBe(1);
    root.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    advance(3350);
    expect(component.activeIndex()).toBe(2);
  });

  it('honours reduced motion by disabling hover turns and switching immediately with controls', async () => {
    reduced = true;
    const { enter, next, previous, advance, component } = await setup();
    enter();
    advance(20000);
    expect(component.activeIndex()).toBe(0);
    next.click();
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(1);
    expect(component.turning()).toBe(false);
    previous.click();
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(0);
  });

  it('settles a pending turn if reduced motion is enabled and stops when the tab is hidden', async () => {
    const { enter, advance, component } = await setup();
    enter();
    advance(2800);
    expect(component.turning()).toBe(true);
    motionChanged({ matches: true } as MediaQueryListEvent);
    advance(10000);
    expect(component.turning()).toBe(false);
    expect(component.activeIndex()).toBe(1);
    motionChanged({ matches: false } as MediaQueryListEvent);
    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    advance(10000);
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    advance(10000);
    expect(component.activeIndex()).toBe(1);
    enter();
    advance(3350);
    expect(component.activeIndex()).toBe(2);
  });

  it.each([0, 2800])(
    'cancels queued or active timers on destruction after %i ms',
    async (delay) => {
      const { enter, advance, component } = await setup();
      enter();
      advance(delay);
      fixture.destroy();
      vi.advanceTimersByTime(20000);
      expect(component.activeIndex()).toBe(0);
      expect(removeMotionListener).toHaveBeenCalledWith('change', motionChanged);
    },
  );
});

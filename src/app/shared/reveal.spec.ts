import { TestBed } from '@angular/core/testing';
import { RevealService } from './reveal';

// Observer delivery is controlled to check offscreen, detached, and reduced-motion content.
describe('Visible-by-default scroll reveals', () => {
  let deliver: IntersectionObserverCallback;
  let changeMotion: (event: MediaQueryListEvent) => void;
  let reduced: boolean;
  let observer: {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    reduced = false;
    observer = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          deliver = callback;
        }
        observe = observer.observe;
        unobserve = observer.unobserve;
        disconnect = observer.disconnect;
      },
    );
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, listener: typeof changeMotion) => {
        changeMotion = listener;
      },
      removeEventListener: vi.fn(),
    }));
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  function target() {
    const element = document.createElement('article');
    element.textContent = 'Useful project content';
    const animation = { cancel: vi.fn(), onfinish: null };
    const animate = vi.fn(() => animation);
    Object.defineProperty(element, 'animate', { value: animate });
    return { element, animation, animate };
  }
  function intersect(element: HTMLElement, isIntersecting = true) {
    deliver(
      [{ target: element, isIntersecting } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  }

  it('never hides content when animation support is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { element, animate } = target();
    TestBed.inject(RevealService).watch(element);
    expect(element.style.opacity).toBe('');
    expect(element.style.visibility).toBe('');
    expect(element.textContent).toBe('Useful project content');
    expect(animate).not.toHaveBeenCalled();
    expect(observer.observe).not.toHaveBeenCalled();
  });
  it('does not start observers or animation for reduced motion', () => {
    reduced = true;
    const { element, animate } = target();
    TestBed.inject(RevealService).watch(element);
    expect(observer.observe).not.toHaveBeenCalled();
    expect(animate).not.toHaveBeenCalled();
    expect(element.style.opacity).toBe('');
  });
  it('animates once on entry, with a bounded stagger and no persistent hidden styles', () => {
    const { element, animate } = target();
    TestBed.inject(RevealService).watch(element, 999);
    intersect(element, false);
    expect(animate).not.toHaveBeenCalled();
    intersect(element);
    intersect(element);
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ delay: 180, fill: 'backwards' }),
    );
    expect(observer.unobserve).toHaveBeenCalledWith(element);
    expect(element.style.opacity).toBe('');
  });
  it('cleans up removed cards, including pending observer delivery and active animation', () => {
    const first = target();
    const service = TestBed.inject(RevealService);
    const stopPending = service.watch(first.element);
    stopPending();
    intersect(first.element);
    expect(first.animate).not.toHaveBeenCalled();
    const second = target();
    const stopActive = service.watch(second.element);
    intersect(second.element);
    stopActive();
    expect(second.animation.cancel).toHaveBeenCalledOnce();
  });
  it('cancels active animation and pending reveals when reduced motion is enabled', () => {
    const active = target();
    const pending = target();
    const service = TestBed.inject(RevealService);
    service.watch(active.element);
    service.watch(pending.element);
    intersect(active.element);
    reduced = true;
    changeMotion({ matches: true } as MediaQueryListEvent);
    intersect(pending.element);
    expect(active.animation.cancel).toHaveBeenCalledOnce();
    expect(pending.animate).not.toHaveBeenCalled();
    expect(observer.disconnect).toHaveBeenCalled();
  });
});

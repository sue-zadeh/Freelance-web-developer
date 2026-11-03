import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  input,
} from '@angular/core';

export interface AosApi {
  init(options: {
    once: boolean;
    duration: number;
    offset: number;
    easing: string;
    disableMutationObserver: boolean;
  }): void;
  refreshHard(): void;
  refresh(): void;
}
export const AOS_LOADER = new InjectionToken<() => Promise<AosApi>>('AOS loader', {
  providedIn: 'root',
  factory: () => async () => (await import('aos')).default,
});

/** AOS is browser-only. Server HTML and failed/disabled animation stay fully visible. */
@Injectable({ providedIn: 'root' })
export class RevealService {
  private readonly loader = inject(AOS_LOADER);
  private readonly targets = new Map<HTMLElement, { delay: number; effect: string }>();
  private aos?: AosApi;
  private loading?: Promise<void>;
  private motion?: MediaQueryList;
  private initialized = false;
  private queued = false;
  private destroyed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.motion?.removeEventListener('change', this.onMotionChange);
      this.targets.forEach((_, element) => this.clear(element));
      this.targets.clear();
      this.aos?.refreshHard();
    });
  }
  watch(element: HTMLElement, delay = 0, effect = 'fade-up'): () => void {
    const view = element.ownerDocument.defaultView;
    if (!view?.matchMedia) return () => {};
    if (!this.motion) {
      this.motion = view.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.onMotionChange);
    }
    this.targets.set(element, {
      delay: Math.min(200, Math.max(0, Math.round(delay / 50) * 50)),
      effect,
    });
    if (!this.motion.matches) this.start();
    return () => {
      this.targets.delete(element);
      this.clear(element);
      this.scheduleRefresh();
    };
  }
  private start(): void {
    if (this.destroyed || this.motion?.matches) return;
    if (this.aos) {
      this.scheduleRefresh();
      return;
    }
    this.loading ??= this.loader()
      .then((aos) => {
        if (this.destroyed) return;
        this.aos = aos;
        this.scheduleRefresh();
      })
      .catch(() => {
        this.targets.forEach((_, element) => this.clear(element));
        this.loading = undefined;
      });
  }
  private scheduleRefresh(): void {
    if (this.queued || this.destroyed || !this.aos) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (this.destroyed || !this.aos) return;
      if (this.motion?.matches) {
        this.aos.refreshHard();
        return;
      }
      try {
        this.targets.forEach(({ delay, effect }, element) => {
          element.setAttribute('data-aos', effect);
          element.setAttribute('data-aos-delay', String(delay));
        });
        if (!this.initialized) {
          this.aos.init({
            once: true,
            duration: 750,
            offset: 48,
            easing: 'ease-out-cubic',
            disableMutationObserver: true,
          });
          this.initialized = true;
        } else this.aos.refreshHard();
      } catch {
        this.targets.forEach((_, element) => this.clear(element));
      }
    });
  }
  private clear(element: HTMLElement): void {
    element.removeAttribute('data-aos');
    element.removeAttribute('data-aos-delay');
    element.classList.remove('aos-init', 'aos-animate');
  }
  private readonly onMotionChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      this.targets.forEach((_, element) => this.clear(element));
      this.aos?.refreshHard();
    } else this.start();
  };
}

@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly revealDelay = input(0);
  readonly revealEffect = input('fade-up');
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef);
    const service = inject(RevealService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stop = service.watch(element.nativeElement, this.revealDelay(), this.revealEffect());
      destroyRef.onDestroy(stop);
    });
  }
}

import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  input,
} from '@angular/core';

/** Content stays visible in HTML; animation is only a progressive enhancement. */
@Injectable({ providedIn: 'root' })
export class RevealService {
  private observer?: IntersectionObserver;
  private readonly waiting = new Map<HTMLElement, number>();
  private readonly running = new Map<HTMLElement, Animation>();
  private motion?: MediaQueryList;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
      this.motion?.removeEventListener('change', this.onMotionChange);
      this.running.forEach((animation) => animation.cancel());
      this.waiting.clear();
      this.running.clear();
    });
  }

  watch(element: HTMLElement, delay = 0): () => void {
    const view = element.ownerDocument.defaultView;
    if (
      typeof IntersectionObserver !== 'function' ||
      typeof element.animate !== 'function' ||
      !view?.matchMedia
    )
      return () => {};
    if (!this.motion) {
      this.motion = view.matchMedia('(prefers-reduced-motion: reduce)');
      this.motion.addEventListener('change', this.onMotionChange);
    }
    if (this.motion.matches) return () => {};
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (!entry.isIntersecting || !this.waiting.has(target)) continue;
          const stagger = this.waiting.get(target)!;
          this.waiting.delete(target);
          this.observer!.unobserve(target);
          if (this.motion?.matches) continue;
          const animation = target.animate(
            [
              { opacity: 0, transform: 'translate3d(0, 22px, 0)' },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: 650,
              delay: stagger,
              easing: 'cubic-bezier(.2,.7,.2,1)',
              fill: 'backwards',
            },
          );
          this.running.set(target, animation);
          animation.onfinish = () => this.running.delete(target);
        }
      },
      { threshold: 0.08 },
    );
    this.waiting.set(element, Math.min(180, Math.max(0, delay)));
    this.observer.observe(element);
    return () => {
      this.observer?.unobserve(element);
      this.waiting.delete(element);
      this.running.get(element)?.cancel();
      this.running.delete(element);
    };
  }

  private readonly onMotionChange = (event: MediaQueryListEvent): void => {
    if (!event.matches) return;
    this.observer?.disconnect();
    this.waiting.clear();
    this.running.forEach((animation) => animation.cancel());
    this.running.clear();
  };
}

@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly revealDelay = input(0);
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef);
    const service = inject(RevealService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stop = service.watch(element.nativeElement, this.revealDelay());
      destroyRef.onDestroy(stop);
    });
  }
}

import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  input,
} from "@angular/core";

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
export const AOS_LOADER = new InjectionToken<() => Promise<AosApi>>(
  "AOS loader",
  {
    providedIn: "root",
    factory: () => async () => (await import("aos")).default,
  },
);

/** AOS is browser-only. Server HTML and failed/disabled animation stay fully visible. */
@Injectable({ providedIn: "root" })
export class RevealService {
  private readonly loader = inject(AOS_LOADER);
  private readonly targets = new Map<
    HTMLElement,
    { delay: number; effect: string }
  >();
  private aos?: AosApi;
  private loading?: Promise<void>;
  private motion?: MediaQueryList;
  private initialized = false;
  private queued = false;
  private destroyed = false;
  private view?: Window;
  private frame?: number;
  private visibility?: IntersectionObserver;
  private readonly replays = new Map<HTMLElement, Animation>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.visibility?.disconnect();
      if (this.frame !== undefined) this.view?.cancelAnimationFrame(this.frame);
      this.motion?.removeEventListener("change", this.onMotionChange);
      this.targets.forEach((_, element) => this.clear(element));
      this.targets.clear();
      this.aos?.refreshHard();
    });
  }
  watch(element: HTMLElement, delay = 0, effect = "fade-up"): () => void {
    const view = element.ownerDocument.defaultView;
    if (!view?.matchMedia) return () => {};
    this.view = view;
    if (!this.motion) {
      this.motion = view.matchMedia("(prefers-reduced-motion: reduce)");
      this.motion.addEventListener("change", this.onMotionChange);
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
      let fresh = false;
      this.targets.forEach(({ delay, effect }, element) => {
        if (!element.hasAttribute("data-aos")) {
          element.classList.add("aos-init", "aos-preparing");
          fresh = true;
        }
        element.setAttribute("data-aos", effect);
        element.setAttribute("data-aos-delay", String(delay));
      });
      if (fresh || !this.initialized) this.afterPaint();
      else if (this.frame === undefined) this.refresh();
    });
  }
  /** Give the initial AOS state one paint before adding its final state. */
  private afterPaint(): void {
    if (this.frame !== undefined) return;
    if (!this.view?.requestAnimationFrame) {
      this.refresh();
      return;
    }
    this.frame = this.view.requestAnimationFrame(() => {
      this.frame = this.view!.requestAnimationFrame(() => {
        this.frame = undefined;
        this.refresh();
      });
    });
  }
  private refresh(): void {
    if (this.destroyed || this.motion?.matches || !this.aos) return;
    try {
      this.targets.forEach((_, element) =>
        element.classList.remove("aos-preparing"),
      );
      if (!this.initialized) {
        this.aos.init({
          once: false,
          duration: 750,
          offset: 48,
          easing: "ease-out-cubic",
          disableMutationObserver: true,
        });
        this.initialized = true;
      } else this.aos.refreshHard();
      this.observeReentries();
    } catch {
      this.targets.forEach((_, element) => this.clear(element));
    }
  }
  /** AOS 2 resets below the viewport only; replay returning entries from either edge. */
  private observeReentries(): void {
    if (typeof IntersectionObserver === "undefined") return;
    this.visibility ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (
            !this.targets.has(element) ||
            this.motion?.matches ||
            this.destroyed
          )
            continue;
          if (!entry.isIntersecting) {
            this.replays.get(element)?.cancel();
            this.replays.delete(element);
          } else this.replay(element);
        }
      },
      { rootMargin: "0px 0px -48px 0px", threshold: 0.08 },
    );
    this.targets.forEach((_, element) => this.visibility!.observe(element));
  }
  private replay(element: HTMLElement): void {
    if (typeof element.animate !== "function") return;
    const settings = this.targets.get(element)!;
    const poses: Record<string, string> = {
      "fade-up": "translate3d(0, 36px, 0)",
      "fade-left": "translate3d(28px, 0, 0)",
      "fade-right": "translate3d(-28px, 0, 0)",
      "zoom-in": "scale(0.92)",
    };
    try {
      this.replays.get(element)?.cancel();
      const animation = element.animate(
        [
          { opacity: 0, transform: poses[settings.effect] ?? poses["fade-up"] },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: Number(element.getAttribute("data-aos-duration")) || 750,
          delay: settings.delay,
          easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
          fill: "backwards",
        },
      );
      this.replays.set(element, animation);
      animation.finished
        .then(() => {
          if (this.replays.get(element) === animation)
            this.replays.delete(element);
        })
        .catch(() => {});
    } catch {
      // AOS remains the visible fallback if the optional replay API is unavailable.
    }
  }
  private clear(element: HTMLElement): void {
    this.visibility?.unobserve(element);
    this.replays.get(element)?.cancel();
    this.replays.delete(element);
    element.removeAttribute("data-aos");
    element.removeAttribute("data-aos-delay");
    element.classList.remove("aos-init", "aos-animate", "aos-preparing");
  }
  private readonly onMotionChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      this.visibility?.disconnect();
      this.visibility = undefined;
      this.targets.forEach((_, element) => this.clear(element));
      this.aos?.refreshHard();
    } else this.start();
  };
}

@Directive({ selector: "[appReveal]" })
export class RevealDirective {
  readonly revealDelay = input(0);
  readonly revealEffect = input("fade-up");
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef);
    const service = inject(RevealService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stop = service.watch(
        element.nativeElement,
        this.revealDelay(),
        this.revealEffect(),
      );
      destroyRef.onDestroy(stop);
    });
  }
}

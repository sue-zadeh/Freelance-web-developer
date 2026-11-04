import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';

interface ShowcaseProject {
  id: string;
  title: string;
  address: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  status: string;
  summary: string;
}

@Component({
  selector: 'app-work-showcase',
  templateUrl: './work-showcase.html',
  styleUrl: './work-showcase.css',
})
export class WorkShowcaseComponent {
  readonly projects: readonly ShowcaseProject[] = [
    {
      id: 'lion-and-sun',
      title: 'Lion & Sun Society NZ',
      address: 'lionandsun.up.railway.app',
      image: '/images/lionandsun.webp',
      alt: 'Lion & Sun Society NZ bilingual community website preview',
      width: 1200,
      height: 824,
      status: 'In progress',
      summary: 'Bilingual content, a donation page and a private owner area.',
    },
    {
      id: 'showerpower',
      title: 'ShowerPower',
      address: 'showerpower.co.nz',
      image: '/images/showerpower.webp',
      alt: 'ShowerPower website showing shower installation services and a quote enquiry',
      width: 1200,
      height: 587,
      status: 'Live website',
      summary: 'A clear service website that guides customers to a quote.',
    },
    {
      id: 'samct',
      title: 'SAMCT Villages',
      address: 'samplvillages.org.nz',
      image: '/images/samct.webp',
      alt: 'SAMCT Villages public website for a launched retirement village platform',
      width: 920,
      height: 912,
      status: 'Launched platform',
      summary: 'A public website and portals for residents and village teams.',
    },
  ];
  readonly activeIndex = signal(0);
  readonly turning = signal(false);
  readonly ready = signal(false);
  readonly announcement = signal('');
  private hovered = false;
  private focused = false;
  private reducedMotion = false;
  private autoTimer?: ReturnType<typeof setTimeout>;
  private turnTimer?: ReturnType<typeof setTimeout>;
  private pendingTurn?: { index: number; manual: boolean };

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      this.reducedMotion = motionQuery?.matches ?? false;
      const motionChanged = (event: MediaQueryListEvent) => {
        this.reducedMotion = event.matches;
        this.stopAutoTurn();
        if (event.matches) this.finishTurn();
        else this.scheduleAutoTurn();
      };
      const visibilityChanged = () => {
        if (document.hidden) {
          this.hovered = false;
          this.stopAutoTurn();
          this.finishTurn();
        }
      };
      motionQuery?.addEventListener('change', motionChanged);
      document.addEventListener('visibilitychange', visibilityChanged);
      this.ready.set(true);
      destroyRef.onDestroy(() => {
        this.stopAutoTurn();
        clearTimeout(this.turnTimer);
        motionQuery?.removeEventListener('change', motionChanged);
        document.removeEventListener('visibilitychange', visibilityChanged);
      });
    });
  }

  position(index: number): number {
    return (index - this.activeIndex() + this.projects.length) % this.projects.length;
  }

  onPointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    this.hovered = true;
    this.scheduleAutoTurn();
  }

  onPointerLeave(): void {
    this.hovered = false;
    this.stopAutoTurn();
  }

  onFocusIn(): void {
    this.focused = true;
    this.stopAutoTurn();
    this.finishTurn();
  }

  onFocusOut(event: FocusEvent): void {
    const container = event.currentTarget as HTMLElement;
    if (event.relatedTarget instanceof Node && container.contains(event.relatedTarget)) return;
    this.focused = false;
    this.scheduleAutoTurn();
  }

  move(direction: number): void {
    if (!this.ready() || this.turning()) return;
    this.stopAutoTurn();
    this.startTurn(direction, true);
  }

  private startTurn(direction: number, manual: boolean): void {
    const index = (this.activeIndex() + direction + this.projects.length) % this.projects.length;
    this.pendingTurn = { index, manual };
    if (this.reducedMotion) {
      this.finishTurn();
      return;
    }
    this.turning.set(true);
    this.turnTimer = setTimeout(() => this.finishTurn(), 550);
  }

  private finishTurn(): void {
    clearTimeout(this.turnTimer);
    this.turnTimer = undefined;
    const pending = this.pendingTurn;
    if (!pending) return;
    this.pendingTurn = undefined;
    this.activeIndex.set(pending.index);
    this.turning.set(false);
    if (pending.manual)
      this.announcement.set(
        `${this.projects[pending.index].title}, project ${pending.index + 1} of ${this.projects.length}`,
      );
    this.scheduleAutoTurn(3600);
  }

  private scheduleAutoTurn(delay = 2800): void {
    this.stopAutoTurn();
    if (
      !this.ready() ||
      !this.hovered ||
      this.focused ||
      this.reducedMotion ||
      document.hidden ||
      this.turning()
    )
      return;
    this.autoTimer = setTimeout(() => {
      this.autoTimer = undefined;
      this.startTurn(1, false);
    }, delay);
  }

  private stopAutoTurn(): void {
    clearTimeout(this.autoTimer);
    this.autoTimer = undefined;
  }
}

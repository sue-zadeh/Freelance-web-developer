import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';

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
    {
      id: 'smart-panel-homes',
      title: 'Smart Panel Homes',
      address: 'smartpanelhomes.co.nz',
      image: '/images/smartpanel.webp',
      alt: 'Smart Panel Homes website presenting insulated panel homes and building services',
      width: 1200,
      height: 620,
      status: 'Business website',
      summary: 'Home products, building services and a visual project showcase.',
    },
    {
      id: 'lodge-matariki',
      title: 'Lodge Matariki 476',
      address: 'lodgematariki476.co.nz',
      image: '/images/lodge.webp',
      alt: 'Lodge Matariki 476 community and membership website',
      width: 1200,
      height: 675,
      status: 'Website & member tools',
      summary: 'Public information, member features and administration tools.',
    },
  ];
  readonly activeIndex = signal(0);
  readonly phase = signal<'idle' | 'outgoing' | 'settling'>('idle');
  readonly turning = computed(() => this.phase() !== 'idle');
  readonly ready = signal(false);
  readonly announcement = signal('');
  private reducedMotion = false;
  private turnTimer?: ReturnType<typeof setTimeout>;
  private pendingIndex?: number;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      this.reducedMotion = motionQuery?.matches ?? false;
      const motionChanged = (event: MediaQueryListEvent) => {
        this.reducedMotion = event.matches;
        if (event.matches) this.finishTurn();
      };
      const visibilityChanged = () => {
        if (document.hidden) {
          this.finishTurn();
        }
      };
      motionQuery?.addEventListener('change', motionChanged);
      document.addEventListener('visibilitychange', visibilityChanged);
      this.ready.set(true);
      destroyRef.onDestroy(() => {
        clearTimeout(this.turnTimer);
        motionQuery?.removeEventListener('change', motionChanged);
        document.removeEventListener('visibilitychange', visibilityChanged);
      });
    });
  }

  position(index: number): number {
    return (index - this.activeIndex() + this.projects.length) % this.projects.length;
  }

  move(direction: number): void {
    if (!this.ready() || this.turning()) return;
    this.pendingIndex =
      (this.activeIndex() + direction + this.projects.length) % this.projects.length;
    if (this.reducedMotion) {
      this.finishTurn();
      return;
    }
    this.phase.set('outgoing');
    this.turnTimer = setTimeout(() => {
      this.showNextPage();
      this.phase.set('settling');
      this.turnTimer = setTimeout(() => {
        this.turnTimer = undefined;
        this.phase.set('idle');
      }, 550);
    }, 550);
  }

  private showNextPage(): void {
    const index = this.pendingIndex;
    if (index === undefined) return;
    this.pendingIndex = undefined;
    this.activeIndex.set(index);
    this.announcement.set(
      `${this.projects[index].title}, project ${index + 1} of ${this.projects.length}`,
    );
  }

  private finishTurn(): void {
    clearTimeout(this.turnTimer);
    this.turnTimer = undefined;
    this.showNextPage();
    this.phase.set('idle');
  }
}

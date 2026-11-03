import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  readonly menuOpen = signal(false);
  readonly activeSection = signal('home');
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.activeSection.set(entry.target.id);
          }
        },
        { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
      );
      this.document
        .querySelectorAll('main section[id]')
        .forEach((section) => observer.observe(section));
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
  closeNavbar(section: string): void {
    this.menuOpen.set(false);
    this.activeSection.set(section);
  }
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.document.getElementById('menu-toggle')?.focus();
  }
}

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
      const viewport = this.document.defaultView;
      let observer: IntersectionObserver;
      const attachSections = () => {
        const sections = this.document.querySelectorAll('main section[id]');
        if (!sections.length) return;
        sections.forEach((section) => observer.observe(section));
        pageObserver.disconnect();
      };
      const pageObserver = new MutationObserver(attachSections);
      pageObserver.observe(this.document.body, { childList: true, subtree: true });
      const observeSections = () => {
        observer?.disconnect();
        const bottomInset = Math.max(0, (viewport?.innerHeight ?? 800) - 200);
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) this.activeSection.set(entry.target.id);
            }
          },
          { rootMargin: `-90px 0px -${bottomInset}px 0px`, threshold: 0 },
        );
        attachSections();
      };
      observeSections();
      viewport?.addEventListener('resize', observeSections);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        pageObserver.disconnect();
        viewport?.removeEventListener('resize', observeSections);
      });
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

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import AOS from 'aos';

type SeoPage = {
  title: string;
  description: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private titleService = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  private readonly siteUrl = 'https://suewebstudio.com';

  private readonly seoByPath: Record<string, SeoPage> = {
    '/': {
      title: 'Sue Web Studio | Freelance Web Developer in Auckland',
      description:
        'Sue Web Studio builds modern business websites, admin dashboards, and custom web applications for companies, teams, and freelance projects in Auckland and beyond.'
    },
    '/about': {
      title: 'About Sue Zadeh | Freelance Web Developer Auckland',
      description:
        'Learn about Sue Zadeh, an Auckland web developer building practical business websites, dashboards, APIs, and custom web applications.'
    },
    '/projects': {
      title: 'Web Development Projects | Sue Web Studio Auckland',
      description:
        'Explore selected websites, admin dashboards, and custom web applications built by Sue Web Studio for real business and community needs.'
    },
    '/contact': {
      title: 'Contact Sue Web Studio | Start a Web Project',
      description:
        'Contact Sue Web Studio about a business website, admin dashboard, API integration, redesign, or custom web application.'
    }
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
      });
    }

    this.updateSeo(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateSeo(event.urlAfterRedirects));
  }

  private updateSeo(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    const seo = this.seoByPath[path] ?? this.seoByPath['/'];
    const canonicalUrl = path === '/' ? `${this.siteUrl}/` : `${this.siteUrl}${path}`;

    this.titleService.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    const canonical = this.document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }
  }
}

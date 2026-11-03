import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home';
import { ProjectsComponent } from './components/projects/projects';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';

@Component({
  selector: 'app-studio-page',
  imports: [HomeComponent, ProjectsComponent, AboutComponent, ContactComponent],
  template: `
    <app-home />
    <app-projects />
    <app-about />
    <section id="process" class="section process-section" aria-labelledby="process-title">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="eyebrow">A clear way forward</p>
            <h2 id="process-title">From your idea<br />to something useful.</h2>
          </div>
          <p>You don’t need a technical brief. Start with what your business needs to do.</p>
        </div>
        <ol class="process-grid">
          <li>
            <span>01</span>
            <h3>Let’s talk</h3>
            <p>Tell me about your business, your customers, and what you want to improve.</p>
          </li>
          <li>
            <span>02</span>
            <h3>A plan and a quote</h3>
            <p>
              We agree on the features, design direction, cost, and what’s included before work
              starts.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Build and review</h3>
            <p>
              See the work as it takes shape. Try it, share feedback, and check the details
              together.
            </p>
          </li>
          <li>
            <span>04</span>
            <h3>Test and launch</h3>
            <p>
              I test the agreed features, help with launch, and explain how to use your website or
              app.
            </p>
          </li>
        </ol>
      </div>
    </section>
    <section id="faq" class="section faq-section" aria-labelledby="faq-title">
      <div class="shell faq-layout">
        <div>
          <p class="eyebrow">Before we start</p>
          <h2 id="faq-title">A few things<br />you might be wondering.</h2>
          <a class="text-link" href="#contact"
            >Ask me something else <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="faq-list">
          @for (question of questions; track question.title) {
            <details>
              <summary>{{ question.title }}</summary>
              <p>{{ question.answer }}</p>
            </details>
          }
        </div>
      </div>
    </section>
    <app-contact />
  `,
})
export class StudioPageComponent {
  readonly questions = [
    {
      title: 'What does a website or app cost?',
      answer:
        'It depends on what it needs to do. A small service website and a custom app with logins need different amounts of work. Share your idea and budget, and I’ll explain the options before quoting.',
    },
    {
      title: 'Can you build an app for my business?',
      answer:
        'Yes. I build web apps, admin dashboards, member areas, and tools that connect to your existing systems. We can start with the most useful features and add more later.',
    },
    {
      title: 'Do you create interactive or 3D websites?',
      answer:
        'I can build interactive web experiences, including 3D-style scenes and animation for product, venue, or company presentations. The restaurant concept above is a small browser demo. A detailed model, photography, or a full virtual tour would need its own agreed scope.',
    },
    {
      title: 'Can you improve a website I already have?',
      answer:
        'Yes. I can review the design, mobile experience, forms, speed, and technical SEO, then explain which changes would be useful for your business.',
    },
    {
      title: 'Can you help people find my business on Google?',
      answer:
        'I build clear, search-friendly content and take care of the technical foundations. Search ranking also depends on competition, useful content, genuine reviews, and links to your business. No one can promise a first-place result.',
    },
    {
      title: 'Do I have to be in Auckland?',
      answer:
        'No. I’m based on Auckland’s North Shore and can work with businesses across New Zealand remotely. We can discuss your project by email, phone, or video call.',
    },
  ];
}

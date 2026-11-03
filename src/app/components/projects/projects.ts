import { Component, signal } from '@angular/core';

export interface StudioProject {
  title: string;
  category: 'Websites' | 'Web apps';
  image: string;
  description: string;
  built: string;
  value: string;
  tags: readonly string[];
  liveUrl?: string;
  inProgress?: boolean;
}
export const STUDIO_PROJECTS: readonly StudioProject[] = [
  {
    title: 'Lion & Sun Society NZ',
    category: 'Web apps',
    image: '/images/lionandsun.webp',
    description:
      'A bilingual community website with English and Persian layouts, news, events, and photo and video galleries.',
    built:
      'React and TypeScript frontend, right-to-left language support, ASP.NET Core API, SQL Server, contact and membership workflows, and a private media manager.',
    value:
      'Gives the organisation a place to share its work and help people get involved. The public link is a frontend preview; the full backend is still being prepared. Donation work is test-only.',
    tags: ['English / فارسی', 'React + .NET', 'Media management'],
    liveUrl: 'https://lionandsun.up.railway.app/en',
    inProgress: true,
  },
  {
    title: 'ShowerPower',
    category: 'Websites',
    image: '/images/showerpower.webp',
    description:
      'A service website that helps customers explore shower services, view completed work, and request a quote.',
    built:
      'Responsive service sections, project gallery, FAQs, clear contact details, and a quote enquiry flow.',
    value:
      'Makes it easier for a homeowner to understand the service and take the next step from a phone or computer.',
    tags: ['Service business', 'Mobile design', 'Quote enquiries'],
    liveUrl: 'https://www.showerpower.co.nz/',
  },
  {
    title: 'FieldSafe',
    category: 'Web apps',
    image: '/images/fieldsafe.webp',
    description:
      'An operations dashboard for Conservation Volunteers New Zealand, bringing field activities, risks, staff, and volunteers into one workflow.',
    built:
      'React and TypeScript, Node.js APIs, MySQL, role-based access, AWS deployment, and offline PWA features using IndexedDB.',
    value:
      'Helps teams record fieldwork with structured forms, including selected activity and volunteer tasks when connectivity is limited. Operational access is private.',
    tags: ['Field operations', 'Offline PWA', 'Admin dashboard'],
  },
  {
    title: 'Lodge Matariki 476',
    category: 'Web apps',
    image: '/images/lodge.webp',
    description:
      'A community and membership website combining public information with tools for the organisation.',
    built:
      'A Python and Flask application with PostgreSQL, responsive pages, member features, and administration tools.',
    value:
      'Brings the organisation’s information and internal workflows together in a website that can be maintained as its needs change.',
    tags: ['Membership', 'Python / Flask', 'PostgreSQL'],
    liveUrl: 'https://lodgematariki476.co.nz/',
  },
  {
    title: 'Smart Panel Homes',
    category: 'Websites',
    image: '/images/smartpanel.webp',
    description:
      'A company website presenting panel home products, services, and visual examples for prospective customers.',
    built:
      'React interface, PHP and MySQL integration, responsive layouts, and service and product presentation.',
    value: 'Helps visitors explore what the company offers and find a clear way to enquire.',
    tags: ['Company website', 'Product showcase', 'React'],
    liveUrl: 'https://www.smartpanelhomes.co.nz/',
  },
  {
    title: 'Senior Healthcare Auckland',
    category: 'Websites',
    image: '/images/healthcare.webp',
    description:
      'An in-progress care services website designed to help families understand the available support and make an enquiry.',
    built: 'Responsive service sections, an introduction to the team, FAQs, and enquiry forms.',
    value:
      'Keeps care information clear and approachable for families and people looking for support.',
    tags: ['Healthcare services', 'Clear content', 'Enquiry forms'],
    inProgress: true,
  },
  {
    title: 'SAMCT Villages',
    category: 'Web apps',
    image: '/images/samct.webp',
    description:
      'An in-progress village platform with public information, resident access, and admin dashboards.',
    built:
      'A multi-role application with public pages and separate areas for resident and administrative tasks.',
    value:
      'Brings village information and day-to-day workflows into one platform. The public preview is currently unavailable while development continues.',
    tags: ['Village platform', 'Resident access', 'Admin tools'],
    inProgress: true,
  },
  {
    title: 'Voting Center',
    category: 'Web apps',
    image: '/images/voting.webp',
    description:
      'A computing project covering voting workflows, user accounts, and administration.',
    built:
      'Python and Flask, MySQL, account management, role permissions, and voting-related workflows.',
    value:
      'Shows how I build connected forms, database-backed features, and different access levels. A project example with no public account access.',
    tags: ['Study project', 'Python / Flask', 'Role permissions'],
  },
  {
    title: 'TreeTalk',
    category: 'Web apps',
    image: '/images/treetalk.webp',
    description:
      'A community app with registration, sign-in, posts, replies, reactions, and image sharing.',
    built:
      'Connected account and community interaction features with a responsive frontend and backend workflows.',
    value:
      'Shows the kind of member interaction a custom community platform can support. A project example with no public account access.',
    tags: ['Community app', 'Member features', 'Full stack'],
  },
];

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  readonly categories = ['All work', 'Websites', 'Web apps', 'In progress'];
  readonly selectedCategory = signal('All work');
  get filteredProjects(): readonly StudioProject[] {
    const category = this.selectedCategory();
    if (category === 'All work') return STUDIO_PROJECTS;
    if (category === 'In progress') return STUDIO_PROJECTS.filter((project) => project.inProgress);
    return STUDIO_PROJECTS.filter((project) => project.category === category);
  }
}

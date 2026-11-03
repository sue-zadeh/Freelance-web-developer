import { RevealDirective } from '../../shared/reveal';
import { Component, signal } from '@angular/core';

export type ProjectCategory =
  'Business websites' | 'Organisations & communities' | 'Admin dashboards';
export type ProjectFilter = 'All work' | ProjectCategory;

export interface StudioProject {
  title: string;
  categories: readonly ProjectCategory[];
  image: string;
  description: string;
  built: string;
  value: string;
  tags: readonly string[];
  liveUrl?: string;
  inProgress?: boolean;
  featured?: boolean;
}
export const STUDIO_PROJECTS: readonly StudioProject[] = [
  {
    title: 'SAMCT Villages',
    categories: ['Business websites', 'Organisations & communities', 'Admin dashboards'],
    image: '/images/samct.webp',
    description:
      'A launched platform for two retirement villages, with a public website and separate portals for residents, village managers, and administration.',
    built:
      'React and TypeScript, ASP.NET Core, and PostgreSQL. Resident accounts, maintenance requests, village documents, property listings, purchase orders, and role-based dashboards.',
    value:
      'Gives residents a way to request maintenance and access village information, while managers handle residents, properties, and tasks in one place. A complete example of the business systems I can build behind a website.',
    tags: ['Launched platform', 'Resident portal', 'Manager dashboards'],
    liveUrl: 'https://samplvillages.org.nz/',
    featured: true,
  },
  {
    title: 'Lion & Sun Society NZ',
    categories: ['Organisations & communities', 'Admin dashboards'],
    image: '/images/lionandsun.webp',
    description:
      'A bilingual community website with English and Persian layouts, news, events, galleries, a donation page, and forms that send enquiries to the organisation.',
    built:
      'React and TypeScript frontend, right-to-left language support, ASP.NET Core API, SQL Server, contact and membership forms with email notifications, a donation page, and a private owner area for content and media management.',
    value:
      'Helps people join, enquire, and support the organisation, while giving the owner tools to keep the website up to date. The public link is a frontend preview; live donation payments are not enabled in this preview.',
    tags: ['English / فارسی', 'Donations & forms', 'Owner management'],
    liveUrl: 'https://lionandsun.up.railway.app/en',
    inProgress: true,
  },
  {
    title: 'ShowerPower',
    categories: ['Business websites'],
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
    categories: ['Admin dashboards', 'Organisations & communities'],
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
    categories: ['Organisations & communities', 'Admin dashboards'],
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
    categories: ['Business websites'],
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
    title: 'Voting Center',
    categories: ['Admin dashboards'],
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
    categories: ['Organisations & communities'],
    image: '/images/treetalk.webp',
    description:
      'A community app with registration, sign-in, posts, replies, reactions, and image sharing.',
    built:
      'Connected account and community interaction features with a responsive frontend and backend workflows.',
    value:
      'Shows the kind of member interaction a custom community platform can support. A project example with no public account access.',
    tags: ['Community app', 'Member features', 'Full stack'],
  },
  {
    title: 'Senior Healthcare Auckland',
    categories: ['Business websites'],
    image: '/images/healthcare.webp',
    description:
      'An in-progress care services website designed to help families understand the available support and make an enquiry.',
    built: 'Responsive service sections, an introduction to the team, FAQs, and enquiry forms.',
    value:
      'Keeps care information clear and approachable for families and people looking for support.',
    tags: ['Healthcare services', 'Clear content', 'Enquiry forms'],
    inProgress: true,
  },
];

@Component({
  selector: 'app-projects',
  imports: [RevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  readonly categories: readonly ProjectFilter[] = [
    'All work',
    'Business websites',
    'Organisations & communities',
    'Admin dashboards',
  ];
  readonly selectedCategory = signal<ProjectFilter>('All work');
  get filteredProjects(): readonly StudioProject[] {
    const category = this.selectedCategory();
    if (category === 'All work') return STUDIO_PROJECTS;
    return STUDIO_PROJECTS.filter((project) => project.categories.includes(category));
  }
}

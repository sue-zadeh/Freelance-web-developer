import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  selectedCategory = 'All';

  categories = ['All', 'Business Website', 'Admin Dashboard', 'Web Application'];

projects = [
  {
    title: 'FieldSafe',
    categories: ['Admin Dashboard', 'Web Application'],
    image: '/images/fieldsafe.png',
    shortDescription: 'A full-stack operations dashboard built for structured workflows, task visibility, and internal data management.',
    hoverDescription: 'An admin-focused platform designed to support day-to-day operations, workflow control, and secure business processes.',
    tags: ['Dashboard', 'Full Stack', 'Role-Based Access'],
    liveUrl: '',
    secureOnly: true
  },
  {
    title: 'Lodge-Matariki476',
    categories: ['Admin Dashboard', 'Web Application'],
    image: '/images/lodge.png',
    shortDescription: 'A membership-focused web application with internal features, administrative tools, and secure access.',
    hoverDescription: 'A custom web platform designed for member management, internal use, and structured administrative control.',
    tags: ['Web App', 'Dashboard', 'Membership System'],
    liveUrl: 'https://lodge-matariki476.pythonanywhere.com/login',
    secureOnly: false
  },
  {
    title: 'ShowerPower',
    categories: ['Business Website'],
    image: '/images/showerpower.png',
    shortDescription: 'A modern business website designed to present services clearly and support customer inquiries.',
    hoverDescription: 'A service-focused website with strong visual presentation, responsive layout, and lead-oriented design.',
    tags: ['Business Website', 'Responsive UI', 'Lead Generation'],
    liveUrl: 'https://www.showerpower.co.nz/',
    secureOnly: false
  },
  {
    title: 'Smart Panel Homes',
    categories: ['Business Website'],
    image: '/images/smartpanel.png',
    shortDescription: 'A professional company website built to showcase services, branding, and trust.',
    hoverDescription: 'A business presentation website with polished layout, clear structure, and modern visual design.',
    tags: ['Company Website', 'Responsive Design', 'Brand Showcase'],
    liveUrl: 'https://www.smartpanelhomes.co.nz/',
    secureOnly: false
  },
  {
    title: 'Voting Center',
    categories: ['Web Application', 'Admin Dashboard'],
    image: '/images/voting.png',
    shortDescription: 'A multi-role web platform designed for structured voting workflows, user actions, and administrative control.',
    hoverDescription: 'A custom role-based system with permission-aware features, admin tools, and interactive platform workflows.',
    tags: ['Full Stack', 'Multi-Role', 'Admin Tools'],
    liveUrl: '',
    secureOnly: true
  },
  {
  title: 'TreeTalk',
  categories: ['Web Application', 'Admin Dashboard'],
  image: '/images/treetalk.png',
  shortDescription: 'A community-focused web application with user registration, login, messaging, replies, reactions, and image sharing.',
  hoverDescription: 'A full-stack social-style platform built around structured user interaction, account management, and secure role-based access.',
  tags: ['Full Stack', 'Community Platform', 'User Interaction'],
  liveUrl: '',
  secureOnly: true
}
];

get filteredProjects() {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }

    return this.projects.filter(
      (project) => project.categories.includes(this.selectedCategory)
  );
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  openProject(project: any): void {
    if (project.secureOnly) {
      return;
    }

    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank');
    }
  }
}
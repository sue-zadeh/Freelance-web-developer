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

  categories = ['All', 'Business Website', 'Admin Dashboard', 'Full Stack App'];

  projects = [
    {
      title: 'ShowerPower',
      category: 'Business Website',
      image: '/images/projects/showerpower.jpg',
      shortDescription: 'A modern business website designed to present services clearly and support customer inquiries.',
      hoverDescription: 'Service-focused website with strong visual presentation, responsive layout, and lead-oriented design.',
      tags: ['Business Website', 'Responsive UI', 'Lead Generation'],
      liveUrl: 'https://example.com',
      secureOnly: false
    },
    {
      title: 'Smart Panel Homes',
      category: 'Business Website',
      image: '/images/projects/smartpanel.jpg',
      shortDescription: 'A professional company website built to showcase services, branding, and trust.',
      hoverDescription: 'Business presentation website with polished layout, clear structure, and modern visual design.',
      tags: ['Company Website', 'Responsive Design', 'Brand Showcase'],
      liveUrl: 'https://example.com',
      secureOnly: false
    },
    {
      title: 'FieldSafe',
      category: 'Admin Dashboard',
      image: '/images/projects/fieldsafe.jpg',
      shortDescription: 'A full-stack admin dashboard for operational workflows and data management.',
      hoverDescription: 'Admin dashboard with role-based access, internal workflows, and secure business functionality.',
      tags: ['Dashboard', 'Full Stack', 'Role-Based Access'],
      liveUrl: '',
      secureOnly: true
    },
    {
      title: 'Lodge-Matariki476',
      category: 'Full Stack App',
      image: '/images/projects/lodge.jpg',
      shortDescription: 'A membership-focused web application with internal features and administrative tools.',
      hoverDescription: 'Custom web application designed for member management, internal use, and secure access.',
      tags: ['Web App', 'Dashboard', 'Membership System'],
      liveUrl: '',
      secureOnly: true
    },
    {
      title: 'Voting Center',
      category: 'Full Stack App',
      image: '/images/projects/votingcenter.jpg',
      shortDescription: 'A multi-role web platform built for structured user actions and admin control.',
      hoverDescription: 'Custom role-based platform with secure workflows, admin management, and interactive features.',
      tags: ['Full Stack', 'Multi-Role', 'Admin Tools'],
      liveUrl: '',
      secureOnly: true
    }
  ];

  get filteredProjects() {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }

    return this.projects.filter(
      (project) => project.category === this.selectedCategory
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
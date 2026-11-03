export const CONTACT_EMAIL = 'suezadeh@suewebstudio.com';
export const PROJECT_TYPES = [
  'Business Website',
  'Custom Web App',
  'Admin Dashboard',
  'Interactive / 3D Experience',
  'API / Backend Integration',
  'Website Redesign',
  'Testing / QA',
  'Portfolio Website',
  'Other',
] as const;
export const BUDGETS = [
  '',
  'Under $1,000',
  '$1,000 - $3,000',
  '$3,000 - $6,000',
  '$6,000+',
  'Not sure yet',
] as const;
export const TIMELINES = [
  '',
  'ASAP',
  'Within 2 weeks',
  'Within 1 month',
  '1 to 3 months',
  'Flexible',
] as const;
export interface ContactData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  website: string;
}
export interface ContactResponse {
  message: string;
  notification: 'sent' | 'pending';
  reference?: string;
}
export function emptyContact(): ContactData {
  return {
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    website: '',
  };
}

import { Router, type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

export const PROJECT_TYPES = [
  'Business Website',
  'Portfolio Website',
  'Admin Dashboard',
  'Custom Web App',
  'API / Backend Integration',
  'Website Redesign',
  'Other',
] as const;

export const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 - $3,000',
  '$3,000 - $6,000',
  '$6,000+',
  'Not sure yet',
] as const;

export const TIMELINES = [
  'ASAP',
  'Within 2 weeks',
  'Within 1 month',
  '1 to 3 months',
  'Flexible',
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export interface ContactSubmission {
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string | null;
  timeline: string | null;
  message: string;
}

export interface ContactStore {
  save(submission: ContactSubmission): Promise<number>;
}

export interface ContactNotifier {
  send(submission: ContactSubmission): Promise<void>;
}

export interface ContactRouterOptions {
  store: ContactStore;
  notifier: ContactNotifier;
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
}

export const DEFAULT_CONTACT_RATE_LIMIT_MAX = 5;

class ContactValidationError extends Error {}

function readString(
  input: Record<string, unknown>,
  field: string,
  maximumLength: number,
  required = false,
): string {
  const rawValue = input[field];

  if (rawValue === undefined || rawValue === null) {
    if (required) {
      throw new ContactValidationError(`${field} is required.`);
    }
    return '';
  }

  if (typeof rawValue !== 'string') {
    throw new ContactValidationError(`${field} must be text.`);
  }

  const value = rawValue.replace(CONTROL_CHARACTERS, '').trim();

  if (required && !value) {
    throw new ContactValidationError(`${field} is required.`);
  }

  if (value.length > maximumLength) {
    throw new ContactValidationError(`${field} is too long.`);
  }

  return value;
}

function requireAllowedValue(
  field: string,
  value: string,
  allowedValues: readonly string[],
): void {
  if (value && !allowedValues.includes(value)) {
    throw new ContactValidationError(`${field} is not valid.`);
  }
}

export function validateContactSubmission(input: unknown): ContactSubmission {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ContactValidationError('A valid contact form is required.');
  }

  const values = input as Record<string, unknown>;
  const name = readString(values, 'name', 100, true);
  const email = readString(values, 'email', 150, true).toLowerCase();
  const company = readString(values, 'company', 150);
  const projectType = readString(values, 'projectType', 100, true);
  const budget = readString(values, 'budget', 100);
  const timeline = readString(values, 'timeline', 100);
  const message = readString(values, 'message', 3000, true);

  if (!EMAIL_PATTERN.test(email) || /[\r\n]/.test(email)) {
    throw new ContactValidationError('email is not valid.');
  }

  requireAllowedValue('projectType', projectType, PROJECT_TYPES);
  requireAllowedValue('budget', budget, BUDGET_RANGES);
  requireAllowedValue('timeline', timeline, TIMELINES);

  return {
    name,
    email,
    company: company || null,
    projectType,
    budget: budget || null,
    timeline: timeline || null,
    message,
  };
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function buildContactEmailHtml(submission: ContactSubmission): string {
  const safe = {
    name: escapeHtml(submission.name),
    email: escapeHtml(submission.email),
    company: escapeHtml(submission.company || '-'),
    projectType: escapeHtml(submission.projectType),
    budget: escapeHtml(submission.budget || '-'),
    timeline: escapeHtml(submission.timeline || '-'),
    message: escapeHtml(submission.message).replaceAll('\n', '<br>'),
  };

  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${safe.name}</p>
    <p><strong>Email:</strong> ${safe.email}</p>
    <p><strong>Company:</strong> ${safe.company}</p>
    <p><strong>Project Type:</strong> ${safe.projectType}</p>
    <p><strong>Budget:</strong> ${safe.budget}</p>
    <p><strong>Timeline:</strong> ${safe.timeline}</p>
    <p><strong>Message:</strong></p>
    <p>${safe.message}</p>
  `;
}

export function buildContactEmailText(submission: ContactSubmission): string {
  return [
    'New Contact Form Submission',
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || '-'}`,
    `Project Type: ${submission.projectType}`,
    `Budget: ${submission.budget || '-'}`,
    `Timeline: ${submission.timeline || '-'}`,
    '',
    'Message:',
    submission.message,
  ].join('\n');
}

export function createContactHandler(options: ContactRouterOptions): RequestHandler {
  return async (request, response) => {
    try {
      const website = readString(
        (request.body || {}) as Record<string, unknown>,
        'website',
        200,
      );

      // Bots often fill hidden fields. Return an empty success without storing data.
      if (website) {
        response.status(204).end();
        return;
      }

      const submission = validateContactSubmission(request.body);
      const id = await options.store.save(submission);

      try {
        await options.notifier.send(submission);
      } catch (notificationError) {
        console.error('Contact notification failed after save.', {
          contactId: id,
          error:
            notificationError instanceof Error
              ? notificationError.message
              : 'Unknown notification error',
        });
        response.status(202).json({
          message: 'Your inquiry was received. I will get back to you soon.',
        });
        return;
      }

      response.status(201).json({
        message: 'Your inquiry was received. I will get back to you soon.',
      });
    } catch (error) {
      if (error instanceof ContactValidationError) {
        response.status(400).json({ message: error.message });
        return;
      }

      console.error('Contact request failed.', {
        error: error instanceof Error ? error.message : 'Unknown contact error',
      });
      response.status(500).json({
        message: 'The form could not be submitted. Please try again later.',
      });
    }
  };
}

export function createContactRouter(options: ContactRouterOptions): Router {
  const router = Router();
  const contactRateLimiter = rateLimit({
    windowMs: options.rateLimitWindowMs ?? 15 * 60 * 1000,
    limit: options.rateLimitMax ?? DEFAULT_CONTACT_RATE_LIMIT_MAX,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      message: 'Too many contact requests. Please wait and try again.',
    },
  });

  router.post('/', contactRateLimiter, createContactHandler(options));

  return router;
}

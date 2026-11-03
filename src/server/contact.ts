import express from 'express';
import { BUDGETS, ContactData, ContactResponse, PROJECT_TYPES, TIMELINES } from '../shared/contact';

export interface ContactDependencies {
  saveContact: (contact: ContactData) => Promise<string>;
  sendNotification: (contact: ContactData, reference: string) => Promise<void>;
  markNotification: (
    reference: string,
    status: 'notified' | 'notification_pending',
  ) => Promise<void>;
  log: (message: string) => void;
}
export function validateContact(body: unknown): {
  contact?: ContactData;
  error?: string;
  spam?: boolean;
} {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return { error: 'Please send the contact form as an object.' };
  const fields = body as Record<string, unknown>;
  if (typeof fields['website'] === 'string' && fields['website'].trim()) return { spam: true };
  const maximums: Record<keyof ContactData, number> = {
    name: 100,
    email: 150,
    company: 150,
    projectType: 100,
    budget: 100,
    timeline: 100,
    message: 5000,
    website: 200,
  };
  const contact = {} as ContactData;
  for (const key of Object.keys(maximums) as (keyof ContactData)[]) {
    const value = fields[key] ?? '';
    if (typeof value !== 'string') return { error: 'Please check the form fields.' };
    const trimmed = value.trim();
    if (trimmed.length > maximums[key]) return { error: 'Some fields are too long.' };
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(trimmed))
      return { error: 'Please remove unsupported characters.' };
    if (key !== 'message' && /[\r\n]/.test(trimmed))
      return { error: 'Please remove line breaks from single-line fields.' };
    contact[key] = trimmed;
  }
  if (!contact.name || !contact.email || !contact.projectType || !contact.message)
    return { error: 'Name, email, service, and project details are required.' };
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact.email))
    return { error: 'Please enter a valid email address.' };
  if (!(PROJECT_TYPES as readonly string[]).includes(contact.projectType))
    return { error: 'Please choose a valid service.' };
  if (
    !(BUDGETS as readonly string[]).includes(contact.budget) ||
    !(TIMELINES as readonly string[]).includes(contact.timeline)
  )
    return { error: 'Please choose valid budget and timing options.' };
  return { contact };
}
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
export function notificationContent(
  contact: ContactData,
  reference: string,
): { subject: string; text: string; html: string } {
  const rows = [
    ['Reference', reference],
    ['Name', contact.name],
    ['Email', contact.email],
    ['Business', contact.company || 'Not provided'],
    ['Service', contact.projectType],
    ['Budget (NZD)', contact.budget || 'Not specified'],
    ['Timing', contact.timeline || 'Not specified'],
    ['Project details', contact.message],
  ];
  return {
    subject: 'Website enquiry: ' + contact.name.replace(/[\r\n]/g, ' ').slice(0, 80),
    text: rows.map(([label, value]) => label + ': ' + value).join('\n\n'),
    html:
      '<h2>New Sue Web Studio enquiry</h2>' +
      rows
        .map(
          ([label, value]) =>
            '<p><strong>' +
            escapeHtml(label) +
            '</strong><br>' +
            escapeHtml(value).replace(/\n/g, '<br>') +
            '</p>',
        )
        .join(''),
  };
}
export function createContactRouter(
  dependencies: ContactDependencies,
  allowedOrigins: readonly string[],
): express.Router {
  const router = express.Router();
  const requests = new Map<string, { count: number; expires: number }>();
  const windowMs = 15 * 60 * 1000;
  router.use((_request, response, next) => {
    response.setHeader('Cache-Control', 'no-store');
    next();
  });
  router.use((request, response, next) => {
    const origin = request.get('origin');
    if (origin && !allowedOrigins.includes(origin)) {
      response.status(403).json({ message: 'Please send your enquiry from this website.' });
      return;
    }
    if (origin) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.vary('Origin');
    }
    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      response.sendStatus(204);
      return;
    }
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST, OPTIONS');
      response.status(405).json({ message: 'Please use the contact form.' });
      return;
    }
    const now = Date.now();
    for (const [key, value] of requests) if (value.expires <= now) requests.delete(key);
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const previous = requests.get(ip);
    if ((previous?.count ?? 0) >= 5 || (!previous && requests.size >= 10000)) {
      response.setHeader(
        'Retry-After',
        String(Math.ceil(((previous?.expires ?? now + windowMs) - now) / 1000)),
      );
      response
        .status(429)
        .json({ message: 'Please wait 15 minutes before sending another enquiry.' });
      return;
    }
    requests.set(ip, {
      count: (previous?.count ?? 0) + 1,
      expires: previous?.expires ?? now + windowMs,
    });
    if (!request.is('application/json')) {
      response.status(415).json({ message: 'Please send the form as JSON.' });
      return;
    }
    next();
  });
  router.use(express.json({ limit: '20kb', strict: true }));
  router.post('/', async (request, response) => {
    const validated = validateContact(request.body);
    if (validated.spam) {
      response
        .status(201)
        .json({
          message: 'Your enquiry has been received.',
          notification: 'sent',
        } satisfies ContactResponse);
      return;
    }
    if (!validated.contact) {
      response.status(400).json({ message: validated.error });
      return;
    }
    const contact = validated.contact;
    let reference: string;
    try {
      reference = await dependencies.saveContact(contact);
    } catch {
      dependencies.log('Enquiry could not be saved. Check database availability.');
      response
        .status(503)
        .json({
          message: 'The form is temporarily unavailable. Please email or call Sue directly.',
        });
      return;
    }
    let sent = false;
    try {
      await dependencies.sendNotification(contact, reference);
      sent = true;
      dependencies.log('Enquiry ' + reference + ' notification accepted by email provider.');
    } catch (error: unknown) {
      const providerStatus =
        typeof error === 'object' &&
        error !== null &&
        'providerStatus' in error &&
        typeof error.providerStatus === 'number'
          ? error.providerStatus
          : undefined;
      dependencies.log(
        'Enquiry ' +
          reference +
          ' saved; email notification pending.' +
          (providerStatus ? ' Provider HTTP ' + providerStatus + '.' : ''),
      );
    }
    try {
      await dependencies.markNotification(reference, sent ? 'notified' : 'notification_pending');
    } catch {
      dependencies.log('Enquiry ' + reference + ' notification status could not be updated.');
    }
    response.status(sent ? 201 : 202).json({
      message: sent
        ? 'Your enquiry has been received.'
        : 'Your enquiry is saved; email notification is delayed.',
      reference,
      notification: sent ? 'sent' : 'pending',
    } satisfies ContactResponse);
  });
  return router;
}

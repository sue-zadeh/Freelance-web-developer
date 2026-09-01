import type { NextFunction, Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildContactEmailHtml,
  buildContactEmailText,
  createContactHandler,
  createContactRouter,
  DEFAULT_CONTACT_RATE_LIMIT_MAX,
  validateContactSubmission,
  type ContactSubmission,
} from './contact';

const validSubmission = {
  name: 'Sue Client',
  email: 'client@example.com',
  company: 'Example Limited',
  projectType: 'Business Website',
  budget: '$3,000 - $6,000',
  timeline: 'Within 1 month',
  message: 'Please build a secure website.',
  website: '',
};

function createHarness(options?: {
  failStore?: boolean;
  failNotifier?: boolean;
}) {
  const saved: ContactSubmission[] = [];
  const notified: ContactSubmission[] = [];
  const handler = createContactHandler({
    store: {
      async save(submission) {
        if (options?.failStore) {
          throw new Error('Synthetic database failure');
        }
        saved.push(submission);
        return saved.length;
      },
    },
    notifier: {
      async send(submission) {
        if (options?.failNotifier) {
          throw new Error('Synthetic email failure');
        }
        notified.push(submission);
      },
    },
  });

  async function invoke(body: unknown) {
    let statusCode = 200;
    let responseBody: Record<string, unknown> = {};
    let ended = false;
    const request = { body } as Request;
    const response = {
      status(code: number) {
        statusCode = code;
        return response;
      },
      json(value: Record<string, unknown>) {
        responseBody = value;
        return response;
      },
      end() {
        ended = true;
        return response;
      },
    } as unknown as Response;

    await handler(request, response, vi.fn() as NextFunction);
    return { statusCode, responseBody, ended };
  }

  return { invoke, saved, notified };
}

describe('contact security boundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('accepts a valid submission and returns no database identifier', async () => {
    const { invoke, saved, notified } = createHarness();
    const result = await invoke(validSubmission);

    expect(result.statusCode).toBe(201);
    expect(result.responseBody['id']).toBeUndefined();
    expect(saved).toHaveLength(1);
    expect(notified).toHaveLength(1);
  });

  it('trims input and converts optional empty fields to null', () => {
    const result = validateContactSubmission({
      ...validSubmission,
      name: '  Sue Client  ',
      email: '  CLIENT@EXAMPLE.COM ',
      company: ' ',
      budget: '',
      timeline: '',
    });

    expect(result.name).toBe('Sue Client');
    expect(result.email).toBe('client@example.com');
    expect(result.company).toBeNull();
    expect(result.budget).toBeNull();
  });

  it('rejects a missing required field before storage', async () => {
    const { invoke, saved } = createHarness();
    const result = await invoke({ ...validSubmission, message: '' });

    expect(result.statusCode).toBe(400);
    expect(saved).toHaveLength(0);
  });

  it('rejects an invalid email address', async () => {
    const { invoke } = createHarness();
    expect((await invoke({ ...validSubmission, email: 'not-an-email' })).statusCode).toBe(400);
  });

  it('rejects email header injection', async () => {
    const { invoke } = createHarness();
    const result = await invoke({
      ...validSubmission,
      email: 'client@example.com\r\nBcc:evil@example.com',
    });
    expect(result.statusCode).toBe(400);
  });

  it('rejects non-string values instead of coercing them', async () => {
    const { invoke } = createHarness();
    expect((await invoke({ ...validSubmission, name: { value: 'Sue' } })).statusCode).toBe(400);
  });

  it('rejects an unapproved project type', async () => {
    const { invoke } = createHarness();
    expect(
      (await invoke({ ...validSubmission, projectType: 'DROP TABLE contact' })).statusCode,
    ).toBe(400);
  });

  it('rejects an oversized message', async () => {
    const { invoke } = createHarness();
    expect((await invoke({ ...validSubmission, message: 'a'.repeat(3001) })).statusCode).toBe(400);
  });

  it('escapes HTML in email output', () => {
    const submission = validateContactSubmission({
      ...validSubmission,
      name: '<img src=x onerror=alert(1)>',
      message: '<script>alert(1)</script>\nSafe line',
    });
    const html = buildContactEmailHtml(submission);

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;<br>Safe line');
  });

  it('creates a plain-text email fallback', () => {
    const text = buildContactEmailText(validateContactSubmission(validSubmission));
    expect(text).toContain('Name: Sue Client');
    expect(text).toContain('Please build a secure website.');
  });

  it('silently discards a bot honeypot submission', async () => {
    const { invoke, saved, notified } = createHarness();
    const result = await invoke({ ...validSubmission, website: 'https://spam.example' });

    expect(result.statusCode).toBe(204);
    expect(result.ended).toBe(true);
    expect(saved).toHaveLength(0);
    expect(notified).toHaveLength(0);
  });

  it('configures a five-request default and a rate-limited router', () => {
    expect(DEFAULT_CONTACT_RATE_LIMIT_MAX).toBe(5);
    expect(
      createContactRouter({
        store: { save: async () => 1 },
        notifier: { send: async () => undefined },
      }),
    ).toBeTruthy();
  });

  it('keeps a saved inquiry when notification delivery fails', async () => {
    const { invoke, saved } = createHarness({ failNotifier: true });
    const result = await invoke(validSubmission);

    expect(result.statusCode).toBe(202);
    expect(saved).toHaveLength(1);
  });

  it('returns a safe error when storage fails', async () => {
    const { invoke } = createHarness({ failStore: true });
    const result = await invoke(validSubmission);

    expect(result.statusCode).toBe(500);
    expect(result.responseBody['message']).not.toContain('database');
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressInfo } from 'node:net';
import { Server } from 'node:http';
import { createHttpApp } from './http-app';
import { ContactDependencies, notificationContent, validateContact } from './contact';
import { emptyContact } from '../shared/contact';

const valid = {
  ...emptyContact(),
  name: 'Aroha Test',
  email: 'aroha@example.com',
  projectType: 'Business Website',
  message: 'A website for my cafe.\nPlease show the menu.',
};

describe('contact validation and email rendering', () => {
  it('keeps international names and multiline project details', () => {
    const result = validateContact({ ...valid, name: '  سارا 李  ' });
    expect(result.contact?.name).toBe('سارا 李');
    expect(result.contact?.message).toContain('\n');
  });
  it.each([
    null,
    [],
    'text',
    10,
    { ...valid, email: {} },
    { ...valid, message: ['text'] },
    { ...valid, name: '   ' },
    { ...valid, email: 'invalid' },
    { ...valid, email: 'x@example.com\r\nBcc: bad@example.com' },
    { ...valid, name: 'a'.repeat(101) },
    { ...valid, message: 'x'.repeat(5001) },
    { ...valid, projectType: 'Tampered' },
    { ...valid, budget: 'Free' },
    { ...valid, timeline: 'Yesterday' },
  ])('rejects invalid, oversized, and tampered data %#', (body) => {
    expect(validateContact(body).contact).toBeUndefined();
    expect(validateContact(body).error).toBeTruthy();
  });
  it('ignores honeypot submissions before database or email work', () =>
    expect(validateContact({ ...valid, website: 'spam.invalid' }).spam).toBe(true));
  it('escapes submitted HTML in emails and provides a plain text version', () => {
    const content = notificationContent(
      { ...valid, message: '<img src=x onerror=alert(1)>\nHello & goodbye' },
      '42',
    );
    expect(content.html).not.toContain('<img');
    expect(content.html).toContain('&lt;img');
    expect(content.html).toContain('&amp; goodbye');
    expect(content.text).toContain('Reference: 42');
    expect(content.subject).not.toMatch(/[\r\n]/);
  });
});

describe('HTTP enquiry flow and security', () => {
  let server: Server;
  let baseUrl: string;
  let dependencies: ContactDependencies;
  beforeEach(async () => {
    dependencies = {
      saveContact: vi.fn().mockResolvedValue('42'),
      sendNotification: vi.fn().mockResolvedValue(undefined),
      markNotification: vi.fn().mockResolvedValue(undefined),
      log: vi.fn(),
    };
    const app = createHttpApp(dependencies, { production: true });
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve) => server.once('listening', resolve));
    baseUrl = 'http://127.0.0.1:' + (server.address() as AddressInfo).port;
  });
  afterEach(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  function post(body: unknown, headers: Record<string, string> = {}) {
    return fetch(baseUrl + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  }
  it('saves first, notifies the fixed inbox, then marks a successful notification', async () => {
    const response = await post(valid, { Origin: 'https://suewebstudio.com' });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      message: 'Your enquiry has been received.',
      reference: '42',
      notification: 'sent',
    });
    expect(dependencies.saveContact).toHaveBeenCalledWith(valid);
    expect(dependencies.sendNotification).toHaveBeenCalledWith(valid, '42');
    expect(vi.mocked(dependencies.saveContact).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(dependencies.sendNotification).mock.invocationCallOrder[0],
    );
    expect(dependencies.markNotification).toHaveBeenCalledWith('42', 'notified');
  });
  it('accepts all newly offered service types', async () => {
    const response = await post({ ...valid, projectType: 'Interactive / 3D Experience' });
    expect(response.status).toBe(201);
  });
  it('preserves a lead and reports pending status if the email provider fails', async () => {
    vi.mocked(dependencies.sendNotification).mockRejectedValue(
      new Error('private-provider-secret'),
    );
    const response = await post(valid);
    expect(response.status).toBe(202);
    expect((await response.json()).notification).toBe('pending');
    expect(dependencies.markNotification).toHaveBeenCalledWith('42', 'notification_pending');
    expect(dependencies.log).not.toHaveBeenCalledWith(
      expect.stringContaining('private-provider-secret'),
    );
  });
  it('does not email or claim receipt when database save fails', async () => {
    vi.mocked(dependencies.saveContact).mockRejectedValue(new Error('secret-database-password'));
    const response = await post(valid);
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret-database-password');
    expect(dependencies.sendNotification).not.toHaveBeenCalled();
  });
  it('keeps a successful submission successful if status bookkeeping fails', async () => {
    vi.mocked(dependencies.markNotification).mockRejectedValue(new Error('down'));
    expect((await post(valid)).status).toBe(201);
  });
  it('does not save or email honeypot spam', async () => {
    expect((await post({ ...valid, website: 'spam' })).status).toBe(201);
    expect(dependencies.saveContact).not.toHaveBeenCalled();
    expect(dependencies.sendNotification).not.toHaveBeenCalled();
  });
  it('rejects a foreign origin before side effects', async () => {
    expect((await post(valid, { Origin: 'https://attacker.example' })).status).toBe(403);
    expect(dependencies.saveContact).not.toHaveBeenCalled();
  });
  it('rejects invalid fields before side effects', async () => {
    expect((await post({ ...valid, email: 'broken' })).status).toBe(400);
    expect(dependencies.saveContact).not.toHaveBeenCalled();
  });
  it('treats SQL-looking input as ordinary data for the parameterized store', async () => {
    const name = "Robert'); DROP TABLE contact;--";
    expect((await post({ ...valid, name })).status).toBe(201);
    expect(dependencies.saveContact).toHaveBeenCalledWith(expect.objectContaining({ name }));
  });
  it('limits a connection to five attempts and includes retry guidance', async () => {
    for (let count = 0; count < 5; count++) expect((await post(valid)).status).toBe(201);
    const blocked = await post(valid);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
    expect(dependencies.saveContact).toHaveBeenCalledTimes(5);
  });
  it('expires limiter entries so a visitor can retry later', async () => {
    for (let count = 0; count < 5; count++) await post(valid);
    const now = vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 16 * 60 * 1000);
    try {
      expect((await post(valid)).status).toBe(201);
    } finally {
      now.mockRestore();
    }
  });
  it('returns 400 for malformed JSON without exposing an exception', async () => {
    const response = await fetch(baseUrl + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"broken":',
    });
    expect(response.status).toBe(400);
    expect(await response.text()).not.toMatch(/SyntaxError|stack/);
  });
  it('rejects large request bodies and wrong content types', async () => {
    expect((await post({ ...valid, message: 'x'.repeat(22000) })).status).toBe(413);
    const response = await fetch(baseUrl + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'text',
    });
    expect(response.status).toBe(415);
    expect(dependencies.saveContact).not.toHaveBeenCalled();
  });
  it('supports only POST/OPTIONS and does not expose enquiry records', async () => {
    const response = await fetch(baseUrl + '/api/contact');
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST, OPTIONS');
  });
  it('sets security and no-store headers', async () => {
    const response = await post(valid);
    expect(response.headers.get('x-powered-by')).toBeNull();
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('content-security-policy')).toContain("script-src 'self'");
    expect(response.headers.get('strict-transport-security')).toBe('max-age=31536000');
  });
  it.each([
    ['about', 'about'],
    ['projects', 'projects'],
    ['contact', 'contact'],
  ])('permanently redirects the old %s URL to its section', async (path, anchor) => {
    const response = await fetch(baseUrl + '/' + path, { redirect: 'manual' });
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('/#' + anchor);
  });
  it('keeps unknown API routes as 404 instead of returning a fake successful page', async () => {
    expect((await fetch(baseUrl + '/api/missing')).status).toBe(404);
  });
});

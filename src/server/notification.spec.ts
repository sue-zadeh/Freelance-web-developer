import { describe, expect, it, vi } from 'vitest';
import { createNotificationSender, NotificationFailure } from './notification';
import { emptyContact } from '../shared/contact';
const contact = {
  ...emptyContact(),
  name: 'Cafe Test',
  email: 'visitor@example.com',
  projectType: 'Business Website',
  message: 'Please build a website.',
};
describe('Outbound email boundary', () => {
  it('sends to Sue’s fixed inbox with the visitor in Reply-To', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('{"id":"test-only"}', { status: 200 }));
    await createNotificationSender('test-key-for-isolated-test', fetcher)(contact, '42');
    const [url, request] = fetcher.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    const body = JSON.parse(request!.body as string);
    expect(body.to).toEqual(['suezadeh@suewebstudio.com']);
    expect(body.reply_to).toBe('visitor@example.com');
    expect(body.from).toBe('Sue Web Studio <contact@suewebstudio.com>');
    expect(body.text).toContain('Reference: 42');
  });
  it('uses a stable idempotency key and bounded provider timeout', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}'));
    await createNotificationSender('test-only', fetcher)(contact, '42');
    const request = fetcher.mock.calls[0][1]!;
    expect(request.headers).toMatchObject({ 'Idempotency-Key': 'website-enquiry/42' });
    expect(request.signal).toBeInstanceOf(AbortSignal);
  });
  it('does not attempt an outbound request without a configured key', async () => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(
      createNotificationSender(undefined, fetcher)(contact, '42'),
    ).rejects.toBeInstanceOf(NotificationFailure);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('reports a provider error without exposing the provider response body', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('private-provider-details', { status: 403 }));
    try {
      await createNotificationSender('test-only', fetcher)(contact, '42');
      throw new Error('Expected notification to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationFailure);
      expect((error as NotificationFailure).providerStatus).toBe(403);
      expect(String(error)).not.toContain('private-provider-details');
    }
  });
});

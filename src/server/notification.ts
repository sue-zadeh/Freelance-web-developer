import { CONTACT_EMAIL, ContactData } from '../shared/contact';
import { notificationContent } from './contact';

export class NotificationFailure extends Error {
  constructor(readonly providerStatus?: number) {
    super(
      providerStatus ? 'Email provider rejected the request' : 'Email sending is not configured',
    );
  }
}
export function createNotificationSender(
  apiKey: string | undefined,
  fetcher: typeof fetch = fetch,
) {
  return async (contact: ContactData, reference: string): Promise<void> => {
    if (!apiKey) throw new NotificationFailure();
    const content = notificationContent(contact, reference);
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'website-enquiry/' + reference,
      },
      body: JSON.stringify({
        from: 'Sue Web Studio <contact@suewebstudio.com>',
        to: [CONTACT_EMAIL],
        reply_to: contact.email,
        ...content,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new NotificationFailure(response.status);
  };
}

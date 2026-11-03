# Sue Web Studio

Angular 21 one-page business website for Sue Zadeh. Production: https://suewebstudio.com/.
The Express server handles contact enquiries and Angular server rendering.

## Local development

Use Node 24 (see `.nvmrc`), then:

```sh
npm ci
npm start
```

For frontend + the real contact backend together:

```sh
npm run build
npm run start:prod
```

Copy `.env.example` to an ignored `.env` for local settings. Set up a **separate development database** using `database.psql`. No production secret is stored in this repository. Angular's `npm start` frontend server does not proxy the contact API; use the production build/server to test the integrated form.

## Verification

```sh
npm run verify
npm audit --omit=dev
```

`verify` runs HTTP validation/security/contact tests against an isolated in-memory test double, Angular UI/form tests in jsdom, the production build, checks of actual prerendered HTML, and HTTP checks against the running built production server. These tests do not contact a real database or send email. Live inbox delivery requires a separate test.

The GitHub quality workflow runs verification and checks production dependencies for known moderate/high/critical advisories.

## Production

Keep the existing Railway service, PostgreSQL database, domain, and GitHub connection. Build with `npm run build`, start with `npm run start:prod`. The existing health endpoint is `/api/health`.

Required service variables:

- `NODE_ENV=production`
- `RAILPACK_NO_SPA=1`
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
- `RESEND_API_KEY`: a valid Resend sending key with the sender domain verified
- `CLIENT_ORIGIN=https://suewebstudio.com` (optional; the canonical origin is always allowed)

The destination is fixed to **suezadeh@suewebstudio.com**. Customer addresses go in Reply-To, never the sender or recipient. The browser never receives provider credentials. Zoho is the receiving mailbox; it does not need a Zoho SMTP password. Sender: `contact@suewebstudio.com`.

The form saves a lead before attempting email. HTTP 201 means the email provider accepted the notification; it does **not** prove inbox delivery. HTTP 202 means the lead was saved but notification is delayed; the UI tells the visitor. HTTP 503 means saving failed, so the UI retains their draft and offers direct contact.

Existing contact rows remain unchanged. New submissions use the existing schema. New statuses:

- `new`: stored, before email attempt
- `notified`: accepted by email provider
- `notification_pending`: provider unavailable or not configured

Check notification failures in service logs and the contact table. There is no unattended email retry worker in this release. Investigate pending records, then resend through the provider using the original reference and idempotency key `website-enquiry/<id>` within its supported retention window. Do not repeatedly resend a lead with a new key.

SQL uses parameter values. Private Railway database hosts use the platform's private network; external production database hosts require verified TLS. Public rate limiting allows five attempts per IP in 15 minutes, with a bounded in-memory map. It resets on restart and is per replica; add a shared store before scaling beyond one instance.

Old `/about`, `/projects`, and `/contact` links permanently redirect to their sections. The canonical page is prerendered so visitors and search engines receive the content without waiting for JavaScript. Unknown pages and API routes return 404.

CSP restricts scripts and connections to this origin. Inline styles are permitted for Angular styles and the interactive scene; inline executable scripts are not permitted. There are no remote fonts, icon CDNs, analytics, advertising cookies, or production source maps.

## Project previews

Lion & Sun is described as in progress. Its public URL is a frontend preview; donation work is test-only. Private project screenshots do not grant operational account access. No revenue, search ranking, or client result statistics are invented.

See `docs/UPDATE_AND_QA_REPORT.md` for release evidence, remaining checks, and the practical plan for attracting enquiries.

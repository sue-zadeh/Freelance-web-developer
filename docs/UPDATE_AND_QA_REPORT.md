# Sue Web Studio: change and QA record

Date: 3 November 2026 (New Zealand)

## Scope

Updates the existing Angular repository and Railway application. Keeps the current domain and PostgreSQL contact storage. No new hosting, paid service, or customer project deployment is introduced.

## Delivered behaviour

- One public page with services, an interactive concept, nine project examples, about, process, FAQ, and contact sections.
- Sticky navigation at the component host, with native hash links and instant scrolling. The mobile menu is Angular-controlled, with Escape support and expanded state.
- Existing /about, /projects, and /contact URLs permanently redirect to their corresponding sections.
- Rewritten project descriptions, visible case-study details, accessible links, and correctly labelled in-progress work.
- Lion & Sun added from its actual source and public preview. Backend work is described accurately; donation work is test-only.
- SAMCT's old public URL returned 404 during this review; its broken outgoing link was removed.
- A lightweight CSS 3D restaurant concept with keyboard-operable view and lighting controls. It is a concept, not an invented client project or a full virtual tour.
- A shorter required enquiry form with optional budget, business, and timing fields.
- Missing HttpClient provisioning fixed. Browser and server validation share the same service choices.
- Email destination remains suezadeh@suewebstudio.com. Sending uses Resend HTTPS, with the visitor in Reply-To.
- Save-first contact storage, explicit pending-email state, HTML-safe email content, parameterized SQL, request limits, bounded rate limiting, timeouts, safe errors, and no public enquiry-list API.
- Self-hosted fonts/icons approach using system fonts and inline decorative markup; external font/icon/script CDNs and unused packages removed.
- WebP previews: 457,476 bytes across ten images, compared with 12,091,105 bytes for the old screenshot PNGs. This comparison includes a new Lion & Sun preview and an optimized portrait, so it is a useful scale comparison rather than an exact image-for-image compression percentage.
- Canonical metadata, social image, structured data, robots, one-URL sitemap, and the existing Google verification file retained.

## Automated verification

Command: `npm run verify`.

| Check                                                                  | Result                       |
| ---------------------------------------------------------------------- | ---------------------------- |
| Server validation, HTTP/security, and outbound email payload tests     | 40 passed                    |
| Angular page, navigation, filters, 3D controls, form, and footer tests | 15 passed                    |
| Production Angular build                                               | Passed; one page prerendered |
| Built HTML / SEO checks                                                | 12 passed                    |
| Production dependency audit                                            | 0 known vulnerabilities      |
| Diff whitespace check                                                  | Passed                       |
| Credential-pattern scan of source                                      | No matches                   |

Server tests use isolated dependency doubles and an ephemeral HTTP listener. They do not write to a production database or send external email.

Coverage includes malformed and oversized JSON, invalid types, whitespace, Unicode names, multiline messages, invalid options, email header injection, HTML escaping, foreign origins, honeypot spam, rate limiting and expiry, database failures, email failures, notification status updates, fixed recipient, Reply-To, provider idempotency key, redirects, headers, and unknown API routes.

UI tests cover missing fields, email validation, whitespace, multiline details, success/pending/error states, retained drafts, repeat-submit prevention, filtering, menu state/Escape, native hash destinations, and restaurant controls.

## Browser QA

Chromium on the managed preview:

- Desktop live Angular page reviewed visually.
- Sticky header observed at top 0 after a section jump; the section begins below the header.
- Native anchor navigation, category filters, lighting change, and keyboard range control exercised.
- Real form validation exercised. A submission against the isolated unconfigured development backend correctly showed an error, retained the draft, and restored the submit button.
- Responsive layout reviewed in temporary 375 px and 768 px frames containing the exact prerendered HTML/CSS. Effective content widths were 360 px and 753 px after scrollbars. No horizontal document overflow was observed.
- Mobile menu behaviour was covered by Angular tests; those static responsive frames did not run JavaScript.
- Browser-console review found no site CSP or Angular error; extension metadata errors belong to the browser environment.
- Temporary responsive fixtures live only in ignored build output and are not source files. A clean deployment build does not contain them.

These checks are not a real-device Safari/Firefox test, a formal WCAG certification, a penetration test, a Lighthouse score, or measured production Core Web Vitals. No such score or certification is claimed.

## Remaining technical limits

- Full `npm audit` reports 16 moderate development-tool findings derived from the minimatch advisory GHSA-g3hv-75wg-m249 in the Angular CLI dependency chain. Production dependencies have zero findings. The advertised automatic fix crosses into Angular 22; that major migration was not forced into this release.
- Rate limiting is per running instance and resets on restart. Use shared storage before adding replicas.
- Pending email notifications are saved with status notification_pending. No unattended retry worker is included; see README for handling pending records and idempotency.
- Provider acceptance is not proof that the email arrived in the Zoho inbox. A separate live test is required.
- Existing unrelated customer websites were not modified. Their portfolio descriptions and published links were reviewed.

## References

- Angular security: https://angular.dev/best-practices/security
- Railway email restrictions: https://docs.railway.com/networking/outbound-networking
- Resend idempotency: https://resend.com/changelog/idempotency-keys
- Google link guidance: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Search Essentials: https://developers.google.com/search/docs/essentials

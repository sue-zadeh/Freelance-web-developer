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
- SAMCT Villages is now featured first as a launched platform. Its live domain was verified as https://samplvillages.org.nz/ (without the e in sample). Senior Healthcare is last.
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
| Angular page, navigation, filters, 3D controls, form, and footer tests | 24 passed                    |
| Production Angular build                                               | Passed; one page prerendered |
| Built HTML / SEO checks                                                | 14 passed                    |
| Running production-server HTTP checks                                  | 11 passed                    |
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

## Live verification follow-up

Live HTTP checks caught a hosting fallback that returned the client shell rather than the prerendered document. The server now explicitly serves the verified prerendered home document, and the production environment sets NODE_ENV=production and RAILPACK_NO_SPA=1. The verify command also starts the built production server and checks actual HTTP HTML, headers, redirects, health, robots, sitemap, and missing pages. No database or email operation is performed by those checks.

The root component explicitly skips client hydration. The server still sends full content; Angular replaces that root once when it starts. This avoids duplicate sections when hosting transforms HTML whitespace/comment markers. The browser regression check verifies one heading, nine projects, and one form after startup, filtering, and section navigation.

## Motion, room controls, and portfolio follow-up — 3 November 2026

- Fixed the navbar hover selector that made the purple “Let’s talk” label disappear into its purple background. Hover and keyboard focus now keep white text. The observed hover colours give 9.50:1 contrast; the brightest point of the limited shine gives approximately 5.25:1.
- Restored scroll reveals with a shared IntersectionObserver and native Web Animations. HTML content is visible by default; no opacity gate is shipped. Each entry animates once, staggers are bounded, removed filter cards are cleaned up, and enabling reduced motion cancels active and pending reveals.
- Added button shine and coloured edge lines, animated link underlines, card lift, and small arrow/showcase interactions. CSS transitions and animations respect reduced motion. No new dependency, continuous auto-spin, or external asset request was added.
- Expanded the restaurant concept to a full 0–360° turn, overhead view, tilt slider, perspective preset, and reset. Pointer drag, arrow keys, Home, labelled range controls, and independent lighting are supported. Touch preserves vertical page scrolling.
- Featured SAMCT as the first project, with a launched badge and details drawn from its actual project source: two villages, resident/manager/administration areas, maintenance, documents, property listings, and purchase orders. The configured live domain, https://samplvillages.org.nz/, was opened successfully. The originally supplied spelling with an extra e did not load in this browser.
- Expanded Lion & Sun’s description with its donation page, contact/membership forms, email notifications, and private owner content/media area. Its preview status and the lack of live payment processing in that preview remain explicit. No private management route is published in the portfolio.
- Moved Senior Healthcare Auckland to the end, including when filtering its category.

Verification for this follow-up:

| Check                                                  | Result                                                      |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| Server/security/email regression tests                 | 40 passed                                                   |
| Angular UI and reveal tests                            | 24 passed                                                   |
| Built HTML, SEO, ordering, and visible fallback checks | 14 passed                                                   |
| Running production-server HTTP checks                  | 11 passed                                                   |
| Production build                                       | Passed; one page prerendered and initial bundle below the 500 kB budget |
| Diff whitespace check                                  | Passed                                                      |

Browser QA used the production build on the managed Chromium preview. The actual navbar hover reported white text on rgb(82, 50, 143), an active shine animation, and a visible edge line. The top-view preset and range End key produced 0° tilt and 360° rotation. A real pointer drag changed the view to 159° / 67° and released its dragging state. The floor fit the scene; no horizontal desktop overflow appeared. After navigation, there was one H1, nine project cards, and one form, and the sticky header remained at top 0.

Phone and tablet CSS were reviewed in temporary 375 px / 768 px frames using the exact prerendered markup and styles, with effective content widths of 360 px / 753 px. The phone's maximum diagonal overhead view fit the scene and all preset buttons remained visible. These static frames do not run Angular; pointer/keyboard behaviour is covered separately in the live preview and unit tests. No physical-device or cross-browser certification is claimed. This follow-up does not send another live enquiry or test payments or private accounts on client projects.

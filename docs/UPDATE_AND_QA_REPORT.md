# Sue Web Studio: change and QA record

Updated: 4 November 2026 (New Zealand)

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
| Angular page, navigation, filters, 3D controls, form, and footer tests | 31 passed                    |
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

| Check                                                  | Result                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| Server/security/email regression tests                 | 40 passed                                                               |
| Angular UI and reveal tests                            | 26 passed                                                               |
| Built HTML, SEO, ordering, and visible fallback checks | 14 passed                                                               |
| Running production-server HTTP checks                  | 11 passed                                                               |
| Production build                                       | Passed; one page prerendered and initial bundle below the 500 kB budget |
| Diff whitespace check                                  | Passed                                                                  |

Browser QA used the production build on the managed Chromium preview. The actual navbar hover reported white text on rgb(82, 50, 143), an active shine animation, and a visible edge line. The top-view preset and range End key produced 0° tilt and 360° rotation. A real pointer drag changed the view to 159° / 67° and released its dragging state. The floor fit the scene; no horizontal desktop overflow appeared. After navigation, there was one H1, nine project cards, and one form, and the sticky header remained at top 0.

Phone and tablet CSS were reviewed in temporary 375 px / 768 px frames using the exact prerendered markup and styles, with effective content widths of 360 px / 753 px. The phone's maximum diagonal overhead view fit the scene and all preset buttons remained visible. These static frames do not run Angular; pointer/keyboard behaviour is covered separately in the live preview and unit tests. No physical-device or cross-browser certification is claimed. This follow-up does not send another live enquiry or test payments or private accounts on client projects.

## Brighter interaction and two 3D concepts — 3 November 2026

Requested refinements are included in this release:

- Every native button and every link styled as a button shares a visible 3 px teal, purple, pink and gold frame that moves on hover or keyboard focus. The diagonal shine repeats while the control is active. Disabled controls do not animate. The frame is masked to the border so it does not cover the label.
- Restored the original purple/pink SVG wave under “Web Studio” and used a light lavender navbar. Section washes alternate lavender, sage, warm neutral, and dark purple; content contrast remains the priority.
- Added a short welcome float and a stronger hover float/tilt to the ShowerPower preview. The automatic welcome ends within five seconds; continued motion is tied to hover or focus. Reintroduced the original About-style diagonal card sweep on the About highlights, service cards and portfolio cards.
- Centred the work heading, introduction, filter buttons and project count, preserving all nine projects and their existing order.
- Created a three-column interactive section with the room on the left, explanatory text in the centre, and a six-layer sandwich on the right. Tablet uses the copy above two demos; phone stacks the copy, room, and sandwich. These are illustrative CSS 3D concepts, not photographed client models.
- Replaced both room range sliders with a draggable spherical control. Both demos use the reusable two-axis orb with pointer capture, touch drag, arrow keys, Home reset, a readable angle summary, and an accessible name/instructions. The room retains top-view/perspective/reset and lighting buttons. The scene itself still supports direct dragging and keeps vertical touch page scrolling; only the orb captures both touch axes.
- The sandwich supports assembly and separation with animated layer transitions, independent orbit controls and a status message.
- Added the requested AOS library, pinned to 2.3.4 and bundled locally. Its engine loads only in the browser. AOS attributes are added after the module loads, so prerendered/no-JavaScript content stays visible. Failed module loading and reduced motion keep content visible. The integration refreshes after filter changes and cleans up removed elements. Angular's explicit CommonJS allow-list contains AOS because that stable release uses CommonJS; its browser chunk is lazy, approximately 4.53 kB estimated transfer.

Automated verification: 40 server tests, 26 Angular UI/AOS/orb tests, 14 built HTML/SEO checks and 11 running-server HTTP checks passed. Production build passed without budget warnings (approximately 407.44 kB initial raw / 102.28 kB estimated transfer). `npm audit --omit=dev --audit-level=moderate` reported zero vulnerabilities. No real enquiry or client payment was submitted during this release.

Chromium QA exercised actual orb dragging (room changed to 39° rotation / 73° tilt, then released), keyboard turning of the sandwich, sandwich assembly/separation, filters (3 website cards, then 9 cards with AOS initialized), real button border animation, the wave, and the ShowerPower hover float/tilt. The page retained exactly one H1 and one contact form. Visible project images loaded successfully and site console errors were absent (browser-extension messages excluded).

Responsive layout used exact prerendered markup and built styles in temporary 375 px / 768 px frames (360 px / 753 px content widths). No horizontal overflow was measured, all sandwich layers fit the scene, and the one-/two-column demo arrangements were visually reviewed. These frames are static CSS checks; Angular interactions are covered separately by the live Chromium preview and unit tests. No physical-device, Safari/Firefox, formal accessibility certification, or measured engagement increase is claimed. Existing reduced-motion CSS disables decorative motion, and AOS tests cover enabling that preference while the page is active.

## Gold sheen, photographic sandwich, and clearer filters — 4 November 2026

This release replaces the previous colourful hover frames with a narrow gold-and-white reflected-light sweep across button surfaces. It also applies the sweep to the ShowerPower browser card and its caption badge. Button corners are now 25 px; circular orbit and arrow controls retain their circular shape. Keyboard focus outlines remain visible, and reduced-motion settings disable decorative animation.

The ShowerPower preview now leans toward the text, with its transform origin on the inner edge. Chromium measured its left edge moving from 696.89 px to 664.24 px on hover, approximately 32.7 px inward. The mobile translation is reduced to keep the card within its column.

The opening text has staggered AOS entrances, and the ShowerPower preview enters from the right. The main heading and preview use 1.1-second entrances. The AOS adapter now allows the initial pose one browser paint before applying the final pose, so opening-viewport elements visibly animate. New tests cover that staging, reduced motion during preparation, and a visible fallback if AOS initialization fails. Prerendered and no-JavaScript content remains visible.

The sandwich now uses six photorealistic ingredient textures on independently rotating CSS 3D layers, replacing the drawn shapes. A single transparent 1200 × 800 WebP atlas is reused by every layer, including the bread depth faces. It is 267,258 bytes and loads lazily. Asset generation details and the full prompt are recorded in [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md). Assembly, separation, orbit dragging, keyboard turning, and Home reset remain available.

Portfolio filters now describe the client's needs rather than splitting websites from apps or mixing status into the category list. Projects support multiple categories, so SAMCT can appear under its public website, organisation, and administration capabilities. Featured and in-progress badges remain separate; SAMCT stays first and Senior Healthcare stays last.

| Filter | Matching projects |
| --- | --- |
| All work | 9 |
| Business websites | 4: SAMCT, ShowerPower, Smart Panel Homes, Senior Healthcare |
| Organisations & communities | 5: SAMCT, Lion & Sun, FieldSafe, Lodge Matariki, TreeTalk |
| Admin dashboards | 5: SAMCT, Lion & Sun, FieldSafe, Lodge Matariki, Voting Center |

Verification: `npm run verify` passed all 94 checks: 40 server/security/email tests, 29 Angular UI tests, 14 built HTML/SEO checks, and 11 running production-server HTTP checks. The production build passed without budget warnings, with 407.57 kB initial raw JavaScript/CSS and 102.38 kB estimated transfer. The separate lazy AOS chunk remains approximately 4.53 kB estimated transfer. No dependency or contact-backend changes are included.

Chromium QA confirmed the inward preview motion, gold-sweep animation with no border mask, readable white navbar CTA text, 25 px button corners, heading/preview AOS attributes, loaded ingredient textures, sandwich assembly/separation, keyboard rotation, and real pointer drag to 5° rotation / 66° tilt with its dragging state released. Each portfolio filter was clicked and its exact project titles checked against the table above. No site console errors or warnings were observed, excluding browser-extension messages.

Phone and tablet CSS were reviewed in temporary frames at 360 px and 753 px content widths. The filter buttons wrap centrally, the sandwich and controls fit, and neither document has horizontal overflow. These are static responsive layout checks, with Angular interactions checked separately in the live preview and unit tests; they are not physical-device or cross-browser certification. No real enquiry, client payment, or private client account operation was performed for this release.

## Reference button shine, dark café, centred services, and repeat reveals — 4 November 2026

- Read the actual ShowerPower reference, `sue-zadeh/showerpower/public/main.css` (blob `36acd9951535de68eaecad9a1b350e3b3b90d843`). Buttons now use its soft white sweep: 40% width, 180% height, 18° angle, 2 px blur, 45% white opacity, moving from left −30% to 120% in one 0.9-second pass. The effect applies on hover and keyboard focus, with no repeating gold line or animated border. Existing studio colours and 25 px button corners remain.
- Removed the shine from both the ShowerPower browser picture and its caption badge. Chromium reported no generated `::after` content on either. The preview pivots at its bottom-left corner and leans inward; its measured left edge moved from 693.30 px to 649.56 px and its right edge from 1244.72 px to 1176.89 px. Smaller screens use a gentler translation and angle.
- Centred the services heading and stacked its introduction underneath. Browser geometry confirmed both share the same horizontal centre and the paragraph begins below the heading.
- Applied a dark purple background to the interactive section and darker green/warm panels behind the café and sandwich. Text, badges, buttons and orbit instructions have light colours appropriate to those backgrounds. The approved sandwich ingredient textures are unchanged.
- Rebuilt the café's appearance with six generated photographic textures: oak parquet, sage shelving, courtyard windows, a set dining table, plants, and a stone coffee counter. The 195,152-byte total is reused across separate CSS 3D floor, walls and furniture, retaining the full turn, top view, presets, direct/orb dragging and lighting control. Texture images load lazily. Details, saved asset paths and the full generation prompt are in `docs/ASSET_PROVENANCE.md`.
- AOS no longer uses a once-only setting. Because installed AOS 2.3.4 has no working bidirectional mirror option, a native visibility observer animates visible entries through the Web Animations API using the same effect directions, durations and delays. This includes the first visible entry after navigating past a section, and re-entry from either scroll direction. AOS supplies the entrance styles and initial painted poses. Leaving the viewport cancels a pending replay; filtering removes its observer/animation; reduced motion cancels active replays and restores visible content immediately. Server-rendered content has no animation gate.

`npm run verify` passed 96 checks: 40 server/security/email tests, 31 Angular UI tests, 14 built HTML/SEO checks, and 11 running-server HTTP checks. The new tests cover first entry, re-entry from above and below, removed targets and cancellation when reduced motion is enabled. The production build passed without budget warnings: 410.41 kB initial raw / 103.41 kB estimated transfer, plus the separate 4.53 kB estimated-transfer lazy AOS chunk.

Chromium review confirmed the reference shine's timing, opacity and single iteration, readable white navbar CTA text, the inward preview pose without shine, centred services, loaded café/sandwich textures, top-view fit, and independent evening lighting without flattening the room's 3D geometry. Returning between sections and the unchanged portfolio filters remained usable. No site console errors or warnings were observed, excluding browser-extension messages.

Temporary exact-source responsive frames at 360 px and 753 px content widths showed the correct stacked/two-column demo arrangements, loaded café images and no horizontal overflow. These are static CSS layout checks; JavaScript interactions were checked separately in Chromium and unit tests. No real enquiry or client payment was sent. These checks do not claim physical-device or cross-browser certification.

## Hero tilt direction correction — 4 November 2026

The earlier change moved the ShowerPower card toward the text, but its positive Y rotation still faced outward to the right. This correction reverses the actual sideways rotation in both states: −8° at rest and −14° on hover or keyboard focus. The pivot is now the card's centre. Its existing inward translation, rounded shape and shine-free picture are preserved.

The production build, 14 built HTML/SEO checks, 11 production-server HTTP checks and whitespace check passed. This is a CSS-only correction; no additional unit tests were added. The managed preview could not start because its relay is unavailable in this session, so visual verification of this revision uses the published page after deployment. The review criterion is the direction of the card's face in both states, rather than its horizontal position alone.

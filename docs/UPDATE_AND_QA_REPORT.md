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
| Angular page, navigation, filters, 3D controls, form, and footer tests | 44 passed                    |
| Production Angular build                                               | Passed; one page prerendered |
| Built HTML / SEO checks                                                | 15 passed                    |
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

## Layered live-project showcase — 4 November 2026

The hero now presents SAMCT Villages behind ShowerPower as two overlapping browser previews. Both retain an inward-facing Y rotation, while a positive X rotation brings the lower edge closer. Separate soft shadows establish the depth between the pages; hover and keyboard focus gently separate the layers and increase the foreground pitch. The pictures have no shine effect.

The caption identifies both live projects and links to the portfolio. The former floating note is removed to keep the two-page composition clear. The heading and enquiry action retain their own column. The design is intended to show a wider range of real work without adding competing controls; no measured engagement or conversion increase is claimed.

The showcase is a small standalone Angular component, keeping its styles and the home component below their existing per-component budgets. It reuses the existing optimized images with their actual dimensions: ShowerPower 1200 × 587, SAMCT 920 × 912. The foreground image retains high fetch priority; the rear image is lazy-loaded with low priority. No image generation, new external request destination, dependency, iframe, contact-form or backend change is introduced. Existing AOS entrances and reduced-motion handling are retained.

`npm run verify` passed all 96 checks: 40 server, 31 Angular UI, 14 built HTML/SEO, and 11 production HTTP checks. The build passed without budget warnings at 412.51 kB initial raw / 103.78 kB estimated transfer, plus the separate lazy AOS chunk. The whitespace check passed. No redundant unit tests were added for this reversible visual change.

The managed preview relay remains unavailable. This release therefore uses the published page for visual review of the overlap, shadows, inward-facing rotation, bottom-forward pitch, caption clearance and project link. Mobile-specific CSS preserves a proportional stack with smaller toolbar text and gentler horizontal movement; physical-device testing is not claimed.

## Turning project preview pages — 4 November 2026

The hero now starts with Lion & Sun Society NZ above ShowerPower and SAMCT Villages. Three existing optimized screenshots give visitors a view of community websites, service businesses, and larger platforms. Lion & Sun remains labelled in progress; SAMCT remains a launched platform. The caption gives each project a short, useful description rather than implying all three are finished or accepting live donations.

Hovering the picture stack starts a page turn after 2.8 seconds, then leaves 3.6 seconds between turns. Each outgoing page rotates inward and returns behind the next page. The front page retains a negative Y rotation and positive X rotation, with separate shadows and no picture shine. Moving to the caption or controls stops automatic turning. Keyboard focus pauses it; previous/next buttons work with native keyboard activation and on touch screens. Reduced motion disables automatic turns and makes manual changes immediate. Hiding the tab stops the sequence until the pointer enters again. Timers and listeners are cleaned up on component destruction. Only manual changes produce screen-reader status announcements.

“Learn more” is a native link to the existing Projects section. All three preview images, the first caption, and that link are prerendered, so the destination still works without JavaScript. The initial Lion & Sun image has high fetch priority; the other two have low priority and are available for the first turn. No dependency, generated image, external asset destination, or backend change was added.

Navigation now says Projects and About, and the footer's personal creator credit is removed. The homepage project link and footer project link use the same naming. No “See roles” or “View roles” action was present in the source; the redundant “See what I can help with” link was removed, and every remaining local section link has a real target. Meaningful descriptions of staff access and project permissions remain. Three hero button arrows were changed to inline SVG after browser QA caught missing font glyphs.

Automated checks passed: 40 server/security/email tests, 39 Angular UI tests, 15 built HTML/SEO checks, and 11 running production-server HTTP checks (105 total). Eight new UI tests cover initial state, both browsing directions and wrapping, rapid activation, hover timing and cancellation, keyboard focus, touch hover, reduced motion changes, tab visibility, and destruction during queued/active turns. A new build check verifies the server-rendered Lion & Sun preview, honest status, and native Projects link. The production build passed without budget warnings at 417.12 kB initial raw / 104.92 kB estimated transfer. The separate lazy AOS chunk remains 4.53 kB estimated transfer. The production dependency audit found zero known vulnerabilities, and the whitespace check passed. No real enquiry was submitted.

The managed preview became available again for this update. Chromium QA exercised hover turning, previous/next controls, Enter activation, the Learn more jump, the renamed navbar, and the footer cleanup. All three images loaded. The desktop page had one H1, nine project cards, one form, and no horizontal overflow. The header stayed at top 0 after the Projects jump, with the section at approximately 104 px below it. The front face's measured normal pointed inward (negative X), while the bottom edge projected forward. Caption clearance remained positive in both resting and active states. No site console warnings or errors were found; browser-extension metadata messages were excluded.

Static responsive frames used the exact final prerendered markup/CSS at 375 px and 768 px outer widths (360 px and 753 px content widths). Both stacks, captions and Learn more links fit without horizontal document overflow; arrow targets remained 44 × 44 px, with approximately 22 px and 38 px of caption clearance. These frames check layout without running Angular. Interactive behaviour was checked separately in Chromium and unit tests; physical-device and cross-browser testing is not claimed. The temporary QA fixture is confined to ignored build output and is removed before publication. Deployment and live verification are recorded in the associated pull request.


## Five clickable projects, permanent-role invitation, and deeper colours — 4 November 2026

The hero deck now includes Lion & Sun, ShowerPower, SAMCT Villages, Smart Panel Homes and Lodge Matariki 476. It starts with Lion & Sun and shows three layers at a time, with all five available in the sequence. It reuses the existing WebP screenshots; Smart Panel Homes is 1200 × 620 / 77,234 bytes and Lodge Matariki is 1200 × 675 / 40,086 bytes. Project status and capability descriptions stay grounded in the portfolio data. The images favour the left edge when cropped so the main website content remains visible.

Each click turns the top page inward and brings the next one forward. This replaces automatic hover turning. The picture surface is a native button that also works with Space and Enter; separate previous/next buttons and the native Learn more link remain. Only the outgoing page flips, and rapid activations are ignored until the incoming page has settled. The controls use aria-disabled during the turn so keyboard focus stays in place. Reduced motion switches pages immediately. Tab visibility changes settle a pending turn, and destruction cancels timers/listeners. No shine is applied to the clickable picture surface or its images.

Home is now a visible navbar item on desktop and in the hamburger menu. Its native link returns to the hero and closes the mobile menu. QA also caught active-section tracking starting before the routed page had inserted its sections. The navbar now waits for those sections and rebuilds its pixel-based observation area on resize, with observer/listener cleanup. Browser verification confirmed About is active after the hiring-link jump and Services after its section jump.

The hero has a short “Hiring a developer? I’m open to a permanent role” link. It leads to a distinct For employers panel in About: “I’m also open to a full-time, permanent software developer role. If your team needs someone who can build, test and support useful applications, I’d love to talk.” A Talk about a role email link uses the existing public business address and a software-developer-role subject. This gives employers a clear route while retaining the client enquiry flow. It does not advertise a vacancy or invent a testimonial, availability date, or employment history.

The light backgrounds now use deeper lavender, plum-tinted neutrals and sage, including the navbar, services, projects, process, FAQ and contact sections. Main muted text, teal headings, project counts and contact/privacy text are darker to retain contrast. Selected body copy, filters, FAQs, process, contact and employer-callout text measured at least 4.97:1 in the browser. This is a targeted contrast check, not a claim of complete accessibility certification. Remaining arrow glyphs that appeared as squares in the browser were replaced by decorative inline SVGs.

Verification passed 108 checks: 40 server/security/email, 42 Angular UI, 15 built HTML/SEO, and 11 running production-server HTTP checks. The ten deck tests cover initial state, all five pages and wrapping, both controls, rapid clicks during both turn phases, focus preservation, reduced motion at start and during a turn, visibility and teardown. The navbar tests cover Home closing the menu and activating correctly, delayed section insertion, active-section updates, resize and cleanup. Production dependencies have zero known vulnerabilities. The final build passed without budget warnings at 420.61 kB initial raw / 105.50 kB estimated transfer, plus the separate 4.53 kB lazy AOS chunk. No dependency, backend, payment, or live enquiry operation was introduced.

Chromium preview QA exercised click, Space and Enter turns through the added previews, the employer link and its mailto destination, Home and Services navigation, active menu state, image loading, inward-facing rotation, caption clearance, lack of picture shine and console output. All five screenshots loaded; three layers were visible. Static responsive layouts used final prerendered markup/CSS at 375, 768 and 920 px outer widths (360, 753 and 905 px content). They had no horizontal overflow, retained 44 × 44 px arrow controls and positive caption clearance of approximately 22, 38 and 22 px. A separate static open-menu state showed Home above Services, Projects and About. These frames check layout; menu and deck behaviour are covered separately by Angular tests and desktop browser interaction. Physical-device testing is not claimed. The temporary fixture is removed from ignored build output before publication. Deployment and live verification are recorded in the associated pull request.


## Inline privacy, larger hiring card, and a unified dark purple theme — 4 November 2026

The ineffective Privacy details jump beside the form has been replaced by a native “How I use your details” disclosure within the form. Clicking, Space and Enter visibly expand/collapse the existing privacy explanation in place. The explanation is retained because the form collects contact details and stores/sends an enquiry; no new data-use claim is introduced. The old detached disclosure below the contact layout is removed. The footer Privacy link targets content inside the new disclosure, with client handling for hash changes and direct #privacy loads. Repeated footer activation after closing the disclosure works, including while the hash is already #privacy. The control has a 44 px minimum height, and its copy is larger than the previous 10 px note.

The hiring link is now a separate, full-width card in the hero with an 18 px heading and 16 px permanent-role statement. These sizes stay intact on narrow phones. The card still links to the employer panel in About, whose body text is now 16 px and email action 15 px. At 320/375 px outer frame widths, the hiring card measured approximately 112 px tall, with no horizontal overflow. The desktop card measured approximately 88 px tall and fit within the initial 936 px viewport.

Services, Projects, Process, FAQ and Contact now use two closely related deep plum backgrounds (#2a2236 and #32273f). The former green FAQ field is removed. Light text, muted lavender introductions and clearer filter states suit the darker fields. Service, project and enquiry cards retain light surfaces with explicitly dark text; the service cards use related lavender neutrals. The header retains its established lavender treatment, including the mobile menu. Existing hero imagery, page turns, animations and 3D concepts remain available. A targeted browser contrast check of 84 text samples found no ratio below 4.5:1; the minimum was 4.68:1. This is not a full accessibility certification.

Verification passed 110 checks: 40 server/security/email tests, 44 Angular UI tests, 15 built HTML/SEO checks and 11 running production HTTP checks. The two new privacy tests cover native opening/closing with draft retention and no submission, plus hash navigation and initial direct-link loading. The production dependency audit found zero known vulnerabilities. The production build passed without budget warnings at 429.78 kB initial raw / 107.71 kB estimated transfer, plus the separate 4.53 kB lazy AOS chunk. Diff whitespace checks passed. No real enquiry was submitted or email sent.

The connected browser did not respond during setup, so visual QA used managed Chromium. The real Angular preview exercised privacy clicks, Space, Enter, footer links, repeated same-hash links and a reload of #privacy. The disclosure opened visibly; the local test draft was retained while toggling and navigating. The expanded desktop privacy body was approximately 219 px tall, fully visible with the submit action still available below it. No site console warnings or errors were found, excluding browser-extension metadata messages.

Static responsive frames used the final prerendered HTML/CSS without Angular scripts at 320, 375 and 768 px outer widths (305, 360 and 753 px content). Hiring typography stayed at 18/16 px and the cards fit. Native privacy controls were activated with Enter in both phone frames; their expanded text fitted without horizontal overflow. These frames verify layout and native disclosure behaviour, with Angular behaviour checked separately in the real preview and unit tests. Physical-device and cross-browser testing are not claimed. The temporary fixture is removed from ignored build output before publication. Live deployment verification is recorded in the associated pull request.

## Clearer process cards and project side fades — 4 November 2026

The four process steps now have distinct plum surfaces, a full lavender outline, 20 px corners, inset spacing, subtle shadows and numbered badges. A purple gradient spreads from the top-left corner across the hovered card using a clipped pseudo-element beneath the text. The effect is limited to devices with a fine pointer and hover support; cards remain clearly defined without hovering. The existing reduced-motion rule disables the decorative transition. These remain ordinary ordered-list items, with no misleading button role or extra keyboard stops.

Project cards now request alternating `fade-right` and `fade-left` AOS entrances instead of `zoom-in`. The existing repeated-scroll reveal and reduced-motion behaviour are retained. Managed Chromium confirmed the expected alternating directions on all nine initial project cards. The process hover reached a complete `circle(150% at 0 0)` fill, with the text above the effect. All four desktop process cards measured 278.5 × 225.5 px. No site console warnings or errors were observed, excluding browser-extension metadata messages.

Static responsive checks used the exact built process markup and CSS in 320 and 768 px frames. The phone showed one column with 280 px-wide cards; the tablet showed two columns with 337 px-wide cards. All card text fitted, body copy remained 14 px, and neither frame had horizontal overflow. These are CSS layout checks, not physical-device or cross-browser testing. Fifteen text/gradient-stop colour combinations exceeded 4.5:1 contrast, including the hover colours. The temporary fixture was removed by the final clean build before publication.

`npm run verify` passed all 110 checks: 40 server/security/email tests, 44 Angular UI tests, 15 built HTML/SEO checks and 11 running production HTTP checks. The production build passed without budget warnings at 430.53 kB initial raw / 107.95 kB estimated transfer, plus the separate 4.53 kB lazy AOS chunk. Diff whitespace checks passed. This update changes presentation only; no dependencies, backend behaviour or live enquiry operations were introduced. Deployment and live verification are recorded in the associated pull request.

## Centred process introduction — 5 November 2026

Applied the existing centred section-heading layout to the process introduction. The eyebrow and title now sit above the centred introduction, followed by the four existing cards. Managed Chromium confirmed that the title and introduction share the same horizontal centre, with a 22 px gap below the title. The production build, 15 built HTML/SEO checks and diff whitespace checks passed. Publication and CI results are recorded in the associated pull request.

## Worldwide availability and test commands — 12 November 2026

The site now describes remote work worldwide in its page copy, FAQ, contact section and search metadata. The sharing card, portrait description, privacy wording and project labels were updated. Five portfolio previews use crops of the existing screenshots to remove embedded place names. The displayed phone number uses its international format. Project links and the enquiry form’s NZD budget currency retain their original meaning.

`npm test` runs both test suites once and exits. `npm run verify` adds the build and production checks. All 111 checks passed, including the new check for location wording in the rendered copy and metadata. The production build had no budget warnings. Chromium loaded all nine project images and opened the revised FAQ and privacy details. Text recognition on the nine displayed previews and sharing card found no matching location wording.

The homepage returned HTTP 200 with a self-canonical URL. The sitemap lists only the homepage. The three old page URLs redirect to their corresponding sections, and the HTTP and hosting aliases lead to the HTTPS homepage. The Search Console emails describe redirect and 404 exclusions without listing their example URLs. The exact examples and Google’s current index status require the signed-in report.

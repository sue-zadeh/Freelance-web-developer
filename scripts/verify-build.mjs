import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const browserDirectory = join(process.cwd(), 'dist/sue-portfolio/browser');
const html = readFileSync(join(browserDirectory, 'index.html'), 'utf8');
const document = new JSDOM(html).window.document;
let passed = 0;
function check(label, test) {
  test();
  passed++;
  console.log('PASS ' + label);
}
check('All sections are present in prerendered HTML', () => {
  for (const id of [
    'home',
    'services',
    'demo',
    'projects',
    'about',
    'process',
    'faq',
    'contact',
    'privacy',
  ])
    assert.ok(document.getElementById(id), id);
});
check('One H1 and one main landmark', () => {
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelectorAll('main').length, 1);
});
check('Canonical URL, title and description are complete', () => {
  assert.equal(
    document.querySelector('link[rel=canonical]')?.getAttribute('href'),
    'https://suewebstudio.com/',
  );
  assert.ok(document.title.includes('Sue Web Studio'));
  assert.ok(document.title.length < 65);
  const description =
    document.querySelector('meta[name=description]')?.getAttribute('content') || '';
  assert.ok(description.length > 100 && description.length < 165);
});
check('Public text and metadata describe worldwide availability', () => {
  const publicText = [
    document.documentElement.lang,
    document.title,
    document.body.textContent,
    document.querySelector('script[type="application/ld+json"]').textContent,
  ];
  for (const attribute of ['alt', 'aria-label', 'title', 'content']) {
    for (const element of document.querySelectorAll('[' + attribute + ']')) {
      publicText.push(element.getAttribute(attribute));
    }
  }
  assert.doesNotMatch(publicText.join('\n'), /\b(?:auckland|new zealand|north shore)\b|(?<!\.)\bnz\b/i);
  assert.match(document.querySelector('#home').textContent, /remote projects worldwide/i);
});
check('Every internal section link has a target', () => {
  for (const anchor of document.querySelectorAll('a[href]')) {
    const url = new URL(anchor.getAttribute('href'), 'https://suewebstudio.com/');
    if (url.origin === 'https://suewebstudio.com' && url.hash)
      assert.ok(document.getElementById(decodeURIComponent(url.hash.slice(1))), url.href);
  }
});
check('All portfolio projects are rendered for search engines', () => {
  assert.equal(document.querySelectorAll('.project-card').length, 9);
  assert.ok(html.includes('Lion &amp; Sun Society'));
});
check(
  'Project previews start with Lion & Sun and link to a real Projects section without JavaScript',
  () => {
    const showcase = document.querySelector('app-work-showcase');
    assert.equal(showcase.querySelectorAll('.browser-card').length, 5);
    assert.equal(showcase.querySelector('.browser-stack').tagName, 'BUTTON');
    assert.ok(showcase.querySelector('img[src="/images/smartpanel.webp"]'));
    assert.ok(showcase.querySelector('img[src="/images/lodge.webp"]'));
    assert.equal(
      showcase.querySelector('[data-position="0"] img').getAttribute('src'),
      '/images/lionandsun.webp',
    );
    assert.equal(showcase.querySelector('.preview-link').getAttribute('href'), '#projects');
    assert.ok(document.getElementById('projects'));
    assert.ok(showcase.querySelector('.showcase-caption').textContent.includes('In progress'));
  },
);
check('Portfolio launch status, ordering and owner features survive prerendering', () => {
  const cards = document.querySelectorAll('.project-card');
  assert.equal(cards[0].querySelector('h3').textContent, 'SAMCT Villages');
  assert.equal(cards[0].querySelector('a').getAttribute('href'), 'https://samplvillages.org.nz/');
  assert.ok(cards[0].querySelector('.project-category').textContent.includes('Launched'));
  assert.equal(cards[8].querySelector('h3').textContent, 'Senior Healthcare');
  assert.ok(cards[1].textContent.includes('email notifications'));
  assert.ok(cards[1].textContent.includes('private owner area'));
  assert.ok(cards[1].textContent.includes('donation page'));
});
check('Animated content stays visible without JavaScript and room controls are prerendered', () => {
  for (const element of document.querySelectorAll('[appReveal]')) {
    assert.notEqual(element.style.opacity, '0');
    assert.notEqual(element.style.visibility, 'hidden');
  }
  assert.equal(document.querySelectorAll('app-orbit-control').length, 2);
  assert.equal(document.querySelectorAll('.ingredient').length, 6);
  assert.equal(document.querySelectorAll('input[type=range]').length, 0);
  assert.equal(document.querySelectorAll('[data-aos]').length, 0);
  assert.equal(document.querySelectorAll('form').length, 1);
});
check('All local images exist and have alt text and dimensions', () => {
  for (const image of document.querySelectorAll('img')) {
    const source = image.getAttribute('src');
    assert.ok(source?.startsWith('/'));
    assert.ok(existsSync(join(browserDirectory, source.slice(1))), source);
    assert.ok(image.getAttribute('alt'));
    assert.ok(image.getAttribute('width'));
    assert.ok(image.getAttribute('height'));
  }
});
check('Structured data is valid and does not invent ratings', () => {
  const data = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(data['@graph'][0].name, 'Sue Web Studio');
  assert.equal(data['@graph'][0].email, 'suezadeh@suewebstudio.com');
  assert.ok(!JSON.stringify(data).includes('aggregateRating'));
});
check('Social sharing image and site verification file exist', () => {
  assert.ok(existsSync(join(browserDirectory, 'social-card.jpg')));
  assert.ok(existsSync(join(browserDirectory, 'google78581829b989c995.html')));
  assert.equal(
    document.querySelector('meta[property="og:image"]').content,
    'https://suewebstudio.com/social-card.jpg',
  );
});
check('Sitemap contains the canonical page without duplicate section URLs', () => {
  const sitemap = readFileSync(join(browserDirectory, 'sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  assert.ok(sitemap.includes('https://suewebstudio.com/'));
});
check('Contact form is rendered and all displayed controls have labels', () => {
  assert.ok(document.querySelector('form'));
  assert.equal(document.querySelector('form').getAttribute('method'), 'post');
  assert.equal(document.querySelector('form').getAttribute('action'), '/api/contact');
  for (const control of document.querySelectorAll('input, select, textarea'))
    assert.ok(document.querySelector('label[for="' + control.id + '"]'), control.id);
});
check('No external script/font dependency or inline executable script', () => {
  for (const script of document.querySelectorAll('script')) {
    const source = script.getAttribute('src');
    if (source) assert.ok(!/^https?:/.test(source));
    else if (!['application/json', 'application/ld+json'].includes(script.type))
      assert.equal(script.textContent.trim(), '', 'Inline executable script conflicts with CSP');
  }
  assert.ok(!html.includes('fonts.googleapis.com'));
  assert.ok(!html.includes('cdn.jsdelivr.net'));
});
check('WebP project images remain under 150 KB each', () => {
  for (const image of document.querySelectorAll('.project-card img'))
    assert.ok(statSync(join(browserDirectory, image.getAttribute('src').slice(1))).size < 150000);
});
console.log(passed + ' production HTML/SEO checks passed.');

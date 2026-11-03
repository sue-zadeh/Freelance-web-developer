import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { JSDOM } from 'jsdom';

const probe = createServer();
probe.listen(0, '127.0.0.1');
await once(probe, 'listening');
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
let serverOutput = '';
const server = spawn(process.execPath, ['dist/sue-portfolio/server/server.mjs'], {
  env: { ...process.env, PORT: String(port), NODE_ENV: 'production', RESEND_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
server.stdout.on('data', (chunk) => {
  serverOutput += chunk;
});
server.stderr.on('data', (chunk) => {
  serverOutput += chunk;
});
const baseUrl = 'http://127.0.0.1:' + port;
let passed = 0;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error('Production server exited before it was ready.');
    try {
      const response = await fetch(baseUrl + '/api/health', { signal: AbortSignal.timeout(500) });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Production server did not become ready.');
  const root = await fetch(baseUrl + '/');
  const document = new JSDOM(await root.text()).window.document;
  assert.equal(root.status, 200);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelectorAll('.project-card').length, 9);
  assert.ok(document.body.textContent.includes('Lion & Sun Society NZ'));
  console.log('PASS Running production server sends the full prerendered page');
  passed++;
  assert.equal(root.headers.get('strict-transport-security'), 'max-age=31536000');
  assert.ok(root.headers.get('content-security-policy').includes("script-src 'self'"));
  assert.equal(root.headers.get('x-powered-by'), null);
  console.log('PASS Running production server sends security headers');
  passed++;
  const routes = [
    ['/about', 301, '/#about'],
    ['/projects', 301, '/#projects'],
    ['/contact', 301, '/#contact'],
    ['/page-that-does-not-exist', 404],
    ['/api/health', 200],
    ['/robots.txt', 200],
    ['/sitemap.xml', 200],
    ['/__qa-layout-375.html', 404],
  ];
  for (const [path, status, location] of routes) {
    const response = await fetch(baseUrl + path, { redirect: 'manual' });
    assert.equal(response.status, status, path);
    if (location) assert.equal(response.headers.get('location'), location);
    console.log('PASS Running production route ' + path + ' returns ' + status);
    passed++;
  }
  const alias = await fetch(baseUrl + '/', {
    redirect: 'manual',
    headers: { 'X-Forwarded-Host': 'freelance-dev-sue.up.railway.app' },
  });
  assert.equal(alias.status, 301);
  assert.equal(alias.headers.get('location'), 'https://suewebstudio.com/');
  console.log('PASS Hosting alias redirects to the canonical domain');
  passed++;
  console.log(passed + ' running-server checks passed without database or email side effects.');
} catch (error) {
  console.error(serverOutput);
  throw error;
} finally {
  server.kill('SIGTERM');
  if (server.exitCode === null) await once(server, 'exit');
}

import { execFileSync } from 'node:child_process';

function gitText(ref, path) {
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function gitFiles(ref) {
  return execFileSync('git', ['ls-tree', '-r', '--name-only', ref], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
}

function packageAt(ref) {
  try {
    return JSON.parse(gitText(ref, 'package.json'));
  } catch {
    return {};
  }
}

export function evaluateProject(ref) {
  const files = gitFiles(ref);
  const packageJson = packageAt(ref);
  const dependencies = packageJson.dependencies || {};
  const server = gitText(ref, 'src/server.ts');
  const contact = gitText(ref, 'src/server/contact.ts');
  const contactTests = gitText(ref, 'src/server/contact.spec.ts');
  const routes = gitText(ref, 'src/app/app.routes.ts');
  const workflow = gitText(ref, '.github/workflows/release-guardian.yml');

  const checks = [
    {
      id: 'dependency-hygiene',
      description: 'Security middleware is present and unused high-risk packages are absent.',
      pass:
        Boolean(dependencies.helmet && dependencies['express-rate-limit']) &&
        !dependencies.nodemailer &&
        !dependencies.mysql2,
      evidence: 'package.json',
    },
    {
      id: 'security-headers',
      description: 'Helmet and a Content Security Policy protect server responses.',
      pass: server.includes("from 'helmet'") && server.includes('contentSecurityPolicy'),
      evidence: 'src/server.ts',
    },
    {
      id: 'request-size-limit',
      description: 'JSON bodies have an explicit small size limit.',
      pass: /express\.json\(\{\s*limit:\s*['"]16kb['"]/.test(server),
      evidence: 'src/server.ts',
    },
    {
      id: 'rate-limit',
      description: 'The public contact endpoint limits repeated requests.',
      pass: contact.includes("from 'express-rate-limit'") && contact.includes('contactRateLimiter'),
      evidence: 'src/server/contact.ts',
    },
    {
      id: 'strict-validation',
      description: 'The server validates email, types, lengths, and allowed option values.',
      pass:
        contact.includes('EMAIL_PATTERN') &&
        contact.includes('requireAllowedValue') &&
        contact.includes("rawValue !== 'string'"),
      evidence: 'src/server/contact.ts',
    },
    {
      id: 'safe-email-rendering',
      description: 'User content is escaped before it is placed into HTML email.',
      pass: contact.includes('escapeHtml') && contact.includes('buildContactEmailHtml'),
      evidence: 'src/server/contact.ts',
    },
    {
      id: 'bot-honeypot',
      description: 'Automated form spam is discarded before storage.',
      pass: contact.includes("'website'") && contact.includes('response.status(204)'),
      evidence: 'src/server/contact.ts',
    },
    {
      id: 'privacy-minimisation',
      description: 'The solution does not store visitor IP or user-agent telemetry.',
      pass:
        !server.includes('req.ip') &&
        !server.includes("req.get('user-agent')") &&
        !gitText(ref, 'database.psql').includes('ip_address'),
      evidence: 'src/server.ts and database.psql',
    },
    {
      id: 'safe-errors',
      description: 'Clients receive generic failures rather than raw infrastructure errors.',
      pass:
        contact.includes('The form could not be submitted.') &&
        contact.includes("error instanceof Error ? error.message"),
      evidence: 'src/server/contact.ts',
    },
    {
      id: 'behavioral-tests',
      description: 'At least 12 contact security tests exercise the boundary.',
      pass:
        files.includes('src/server/contact.spec.ts') &&
        (contactTests.match(/\bit\(/g) || []).length >= 12,
      evidence: 'src/server/contact.spec.ts',
    },
    {
      id: 'ci-release-gate',
      description: 'CI runs tests, build, release evaluation, and production dependency audit.',
      pass:
        workflow.includes('npm run test') &&
        workflow.includes('npm run build') &&
        workflow.includes('npm run guardian:evaluate') &&
        workflow.includes('npm audit --omit=dev'),
      evidence: '.github/workflows/release-guardian.yml',
    },
    {
      id: 'seo-evidence',
      description: 'Route titles, robots.txt, and sitemap.xml are included.',
      pass:
        routes.includes('title:') &&
        files.includes('public/robots.txt') &&
        files.includes('public/sitemap.xml'),
      evidence: 'src/app/app.routes.ts and public SEO files',
    },
  ];

  const passed = checks.filter((check) => check.pass).length;
  return {
    ref,
    primaryMetric: 'release controls passed',
    passed,
    total: checks.length,
    scorePercent: Math.round((passed / checks.length) * 100),
    checks,
  };
}

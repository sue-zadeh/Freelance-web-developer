# Security policy

## Supported version

The `freelance--Challenge` branch is the security-hardened challenge version.

## Reporting a vulnerability

Please report vulnerabilities privately to `suezadeh@suewebstudio.com`. Do not
open a public issue containing exploit details, credentials, or personal data.

## Implemented controls

- strict server-side input types, lengths, email format, and option allowlists;
- parameterized PostgreSQL queries;
- HTML escaping plus a plain-text email alternative;
- contact rate limiting and a honeypot field;
- Helmet security headers and a 16 KB JSON request limit;
- restricted CORS origins;
- no storage of visitor IP addresses or browser user-agent strings;
- generic client errors with detailed server-side logging;
- CI checks for tests, production build, release controls, and dependency audit.

Secrets are loaded from environment variables. Real `.env` files are ignored by Git.

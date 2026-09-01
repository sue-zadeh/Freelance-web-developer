# Clean-environment reproduction guide

## Environment

- Git 2.40 or later
- Node.js 22.x
- npm 10 or later
- Windows, macOS, or Linux
- Approximate disk space: 700 MB after `npm ci`

No private data or paid API key is needed for the baseline, final evaluation, tests,
or production build.

## 1. Clone the exact challenge branch

```bash
git clone --branch freelance--Challenge --single-branch \
  https://github.com/sue-zadeh/Freelance-web-developer.git
cd Freelance-web-developer
npm ci
```

Expected install time: about 30-60 seconds on a normal connection.

## 2. Run the fair baseline

```bash
npm run guardian:baseline
```

Expected primary result:

```text
"passed": 0,
"total": 12
```

The command evaluates the untouched baseline commit
`56567bbb61d287d445ae3b00ef553fb2c7e0baa4`. It does not rewrite the worktree.

To reproduce the raw baseline commands as well:

```bash
git worktree add --detach ../portfolio-baseline 56567bbb61d287d445ae3b00ef553fb2c7e0baa4
cd ../portfolio-baseline
npm ci
npm test -- --watch=false
npm run build
npm audit --omit=dev --json
```

Expected raw baseline: tests fail, build passes with four warnings, and the audit
reports 12 production vulnerabilities.

## 3. Run the advanced solution

From the challenge branch directory:

```bash
npm run test
npm run build
npm run guardian:final
npm audit --omit=dev --audit-level=high
```

Expected results:

- 3 test files pass;
- 18 tests pass;
- production build succeeds without warnings;
- 12 of 12 release controls pass;
- production dependency audit reports zero vulnerabilities.

## 4. Run the full evaluation in one command

```bash
npm run verify
```

This runs tests, production build, baseline/final comparison, and the production
dependency audit. Approximate runtime: 60-120 seconds. Additional runtime cost: $0.

## 5. Optional local website run

The challenge page and all portfolio pages can be built without secrets:

```bash
npm run build
npm run start:prod
```

Open `http://localhost:4000/release-guardian`.

To test real contact delivery, create a local `.env` from `.env.example`, create the
PostgreSQL table with `database.psql`, and supply your own Resend key. This optional
step may incur the provider's normal cost. Never commit the key or real submissions.

## Data and safety

All automated tests use synthetic names, email addresses, attack strings, database
failures, and email failures. The evaluator reads public source only. No real contact
submission, IP address, browser fingerprint, credential, or production database is
included.

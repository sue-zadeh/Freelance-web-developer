# Baseline evidence

Baseline commit: `56567bbb61d287d445ae3b00ef553fb2c7e0baa4`

The challenge branch and `main` pointed to the same commit before challenge work.

| Command | Baseline result |
| --- | --- |
| `npm test -- --watch=false` | Failed: 0 passing tests, 2 failing tests, and 1 empty test suite |
| `npm run build` | Passed with 4 warnings: initial bundle, 2 component styles, and AOS CommonJS |
| `npm audit --omit=dev --json` | Failed: 12 production vulnerabilities (9 high, 2 moderate, 1 low) |
| `npm run guardian:baseline` | 0 of 12 release controls passed |

The raw baseline commands were run before implementation on 1 September 2026 UTC.
No credentials, private contact submissions, or production database data were used.

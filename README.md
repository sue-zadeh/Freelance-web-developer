# Release Guardian

Evidence-driven security hardening for a real Angular and Node.js portfolio.

This is Sue Zadeh's individual submission for the micro1 Frontier Engineering
Challenge 2026. The work is isolated on the `freelance--Challenge` branch. The
original `main` branch is not changed.

## The user and the problem

The intended user is a freelance developer who maintains a client-facing portfolio
and contact API. Before a release, build output, dependency warnings, input handling,
email safety, spam protection, privacy, and deployment checks live in different
places. A convincing UI can therefore ship while the release boundary is still weak.

The bottleneck is not writing one more feature. It is proving, quickly and
repeatably, that the smallest public attack surface is ready to release.

## What existed before the challenge

Baseline commit: `56567bbb61d287d445ae3b00ef553fb2c7e0baa4`

- Angular 21 SSR portfolio with an Express server;
- PostgreSQL contact storage and Resend notification;
- four portfolio routes and responsive styling;
- two broken app tests and one empty test file;
- no release evaluator, challenge evidence, agent instructions, or CI gate.

## The solution

Release Guardian uses one coding agent in a controlled four-stage workflow:

1. **Inspect** - record the untouched build, tests, dependency audit, and attack surface.
2. **Fix** - harden the contact boundary with small, evidence-backed changes.
3. **Prove** - run the same 12 release controls on the baseline and final source.
4. **Approve** - keep GitHub push, deployment, and challenge submission as human checkpoints.

The final solution adds strict validation, HTML-safe email rendering, rate limiting,
a bot honeypot, security headers, a request-size limit, privacy-minimised storage,
18 passing tests, SEO evidence, CI, and a reproducible baseline/final evaluator.

## Measured improvement

| Primary evidence | Baseline | Final | Change |
| --- | ---: | ---: | ---: |
| Release controls passed | 0/12 | 12/12 | +12 |
| Automated tests passing | 0 | 18 | +18 |
| Production dependency vulnerabilities | 12 | 0 | -12 |
| Production build warnings | 4 | 0 | -4 |

Every claim above links to reproducible commands in
[`challenge/REPRODUCTION.md`](challenge/REPRODUCTION.md) and stored evidence in
[`challenge/evidence`](challenge/evidence).

## Quick verification

Requirements: Node.js 22 and npm 10 or later.

```bash
npm ci
npm run verify
```

Expected result: 18 tests pass, the production build succeeds without warnings,
the final evaluator passes 12/12 controls, and the production dependency audit
reports zero vulnerabilities.

Useful commands:

```bash
npm run guardian:baseline
npm run guardian:final
npm run guardian:evaluate
npm run test
npm run build
```

The evaluator needs only public source code and synthetic test inputs. It does not
need a database, email API key, production data, or paid model API.

## Project structure

| Area | Purpose |
| --- | --- |
| `src/server/contact.ts` | Validated, rate-limited contact security boundary |
| `src/server/contact.spec.ts` | Behavioral security and failure-mode tests |
| `challenge/evaluation` | Same baseline/final release controls |
| `challenge/evidence` | Measured results tied to commands and commits |
| `challenge/trajectories` | Representative coding-agent trajectory |
| `.github/workflows/release-guardian.yml` | Clean-environment CI release gate |

## Improvement Changelog

The complete experiment-by-experiment story is in
[`challenge/IMPROVEMENT_CHANGELOG.md`](challenge/IMPROVEMENT_CHANGELOG.md).

## Main failure mode and hot take

**Main failure mode:** a general coding agent can produce a polished patch and still
miss a boundary condition, silently weaken privacy, or trust its own explanation.

**Hot take:** the agent should not be allowed to declare its own work finished. The
reliable finish line is a deterministic gate that can reject the agent's patch, plus
a human checkpoint before consequential actions.

## Full submission package

- [Reproduction guide](challenge/REPRODUCTION.md)
- [Improvement changelog](challenge/IMPROVEMENT_CHANGELOG.md)
- [Agent instructions and disclosure](challenge/AGENT_INSTRUCTIONS.md)
- [Representative trajectory](challenge/trajectories/codex-work.md)
- [Five-minute video script](challenge/VIDEO_SCRIPT.md)
- [Submission checklist and copy](challenge/SUBMISSION_CHECKLIST.md)
- [Security policy](SECURITY.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

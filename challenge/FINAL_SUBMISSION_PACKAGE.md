# Final submission package

This file is the single upload checklist for **Release Guardian: Evidence-Driven
Security Hardening for Freelance Web Apps**.

## 1. The four required deliverables

| Required deliverable | Ready item |
| --- | --- |
| Complete solution code plus Improvement Changelog | Exact public branch below; changelog at `challenge/IMPROVEMENT_CHANGELOG.md` |
| Clean-environment Reproduction Guide | `challenge/REPRODUCTION.md` |
| Solution video, maximum five minutes | Exact recording script at `challenge/VIDEO_SCRIPT.md`; add the uploaded video URL to the form |
| Representative trajectory for every coding agent used | One agent was used; trajectory at `challenge/trajectories/codex-work.md` |

## 2. Complete-code URL to submit

Submit this exact branch URL, not the generic repository URL and not `main`:

```text
https://github.com/sue-zadeh/Freelance-web-developer/tree/freelance--Challenge
```

The branch is the complete code deliverable. A ZIP is not needed unless the form
specifically asks for a file upload. A judge can reproduce the same branch with:

```bash
git clone --branch freelance--Challenge --single-branch \
  https://github.com/sue-zadeh/Freelance-web-developer.git
```

The untouched baseline is commit `56567bbb61d287d445ae3b00ef553fb2c7e0baa4`.

## 3. Direct evidence links

- README and project story:
  `https://github.com/sue-zadeh/Freelance-web-developer/blob/freelance--Challenge/README.md`
- Improvement Changelog:
  `https://github.com/sue-zadeh/Freelance-web-developer/blob/freelance--Challenge/challenge/IMPROVEMENT_CHANGELOG.md`
- Reproduction Guide:
  `https://github.com/sue-zadeh/Freelance-web-developer/blob/freelance--Challenge/challenge/REPRODUCTION.md`
- Agent trajectory:
  `https://github.com/sue-zadeh/Freelance-web-developer/blob/freelance--Challenge/challenge/trajectories/codex-work.md`
- Baseline evidence:
  `https://github.com/sue-zadeh/Freelance-web-developer/blob/freelance--Challenge/challenge/evidence/baseline.md`
- Final evidence:
  `https://github.com/sue-zadeh/Freelance-web-developer/blob/freelance--Challenge/challenge/evidence/final-verification.md`

## 4. Ready-to-paste submission form text

### Project title

```text
Release Guardian: Evidence-Driven Security Hardening for Freelance Web Apps
```

### One-line pitch

```text
Release Guardian lets a coding agent harden a real Angular and Node.js portfolio, then uses behavioral tests, a deterministic 12-case gate, and a human checkpoint to prove whether it is ready.
```

### Problem and intended user

```text
Freelance web developers can ship a portfolio that looks finished while its public contact boundary, tests, dependencies, and privacy controls are still weak. Release Guardian is for solo developers and small teams that need an evidence-based release decision without a large security team.
```

### Solution and measurable value

```text
Codex first captured the untouched baseline, then hardened the highest-risk public boundary and added deterministic verification. The same evaluator moved from 0/12 to 12/12 release controls. Passing tests moved from 0 to 18, production vulnerabilities from 12 to 0, and build warnings from 4 to 0. The workflow keeps coding-agent speed, but independent evidence and a human checkpoint decide whether the result can leave the sandbox.
```

### What existed before

```text
The baseline was an Angular SSR portfolio with an Express contact API, PostgreSQL storage, Resend email delivery, and portfolio pages. It had no challenge evaluator, no clean CI release gate, broken or empty tests, weak contact-boundary controls, 12 production dependency vulnerabilities, and four build warnings.
```

### What was added or changed

```text
I added strict type, length, email, and allowlist validation; escaped HTML and plain-text email; parameterized database values; rate limiting; a honeypot; Helmet security headers; a 16 KB JSON limit; restricted CORS; generic error responses; and data minimization that removes IP and browser collection. I also added 18 tests, a 12-case baseline/final evaluator, CI, stored evidence, exact reproduction documentation, an agent trajectory, and a polished Release Guardian case-study page.
```

### Tools and agent disclosure

```text
I used Codex inside ChatGPT Work as the single coding agent, together with Git/GitHub, Node.js 22, npm, Angular CLI, Vitest, and npm audit. The agent worked in scoped inspect, implement, verify, and human-approval stages. The representative trajectory discloses its instructions, tool responses, feedback, retry, and human checkpoints. No model API key, paid service, private production data, or real contact submission is required to reproduce the evaluation.
```

### Primary metric

```text
Primary metric: the same deterministic release evaluator improved from 0 of 12 controls at the untouched baseline to 12 of 12 controls in the final solution.
```

### Biggest contributing change

```text
The biggest contributing change was hardening the public contact boundary and making the security behavior directly testable. This converted hidden application-layer risks into deterministic pass/fail evidence.
```

### Removed experiment

```text
I removed the experiment of treating npm audit as the entire release decision. It found vulnerable packages, but it could not detect unsafe email HTML, weak validation, spam controls, privacy over-collection, or broken behavioral tests. It remains one signal inside the complete release gate.
```

### Failure mode and hot take

```text
Failure mode: a coding agent can produce a convincing patch that builds successfully while security, privacy, runtime behavior, and tests remain incomplete. Hot take: an agent should not be allowed to declare its own work finished; independent tests and a human checkpoint should approve the release.
```

### Code URL

```text
https://github.com/sue-zadeh/Freelance-web-developer/tree/freelance--Challenge
```

### Video URL

```text
PASTE THE TESTED UNLISTED VIDEO URL HERE
```

## 5. Clean-environment reproduction guide

### Requirements

- Git 2.40 or later
- Node.js 22.x
- npm 10 or later
- Windows, macOS, or Linux
- About 700 MB after dependency installation

No paid API, private database, secret, or real user data is needed for evaluation.

### Exact commands

```bash
git clone --branch freelance--Challenge --single-branch \
  https://github.com/sue-zadeh/Freelance-web-developer.git
cd Freelance-web-developer
npm ci
npm run guardian:baseline
npm run guardian:final
npm run verify
```

### Expected output

- baseline evaluator: `0/12`
- final evaluator: `12/12`
- tests: 3 files and 18 tests pass
- production build: 5 routes prerendered with zero warnings
- production dependency audit: zero vulnerabilities
- approximate full runtime: 60-120 seconds after `npm ci`
- additional evaluation cost: $0

### Optional website demonstration

```bash
npm run build
npm run start:prod
```

Open `http://localhost:4000/release-guardian`.

The real contact delivery path is optional and is not needed for judging. It requires
the submitter's own PostgreSQL database and Resend key. Never upload `.env`, API keys,
database exports, real email, or real contact submissions.

## 6. Final human upload order

1. Record the video by following `challenge/VIDEO_SCRIPT.md` exactly.
2. Verify the video is at most five minutes and contains no secrets or private tabs.
3. Upload it as **Unlisted** and confirm the URL plays in an incognito window.
4. Open the HackerEarth submission page from the official email/link.
5. Paste the prepared title, pitch, problem, solution, tool disclosure, and metrics into
   the closest matching fields. Field labels may differ slightly.
6. For complete code, paste the exact `freelance--Challenge` branch URL.
7. Paste the tested unlisted video URL.
8. If the form has separate evidence fields, paste the Reproduction Guide, Improvement
   Changelog, and agent-trajectory links from section 3.
9. Check that the form shows the correct repository branch and accessible video.
10. Read the participation and ownership agreement, confirm it is acceptable, and only
    then click final **Submit**.

## 7. Final safety check

- Submit `freelance--Challenge`, never `main`.
- Do not upload `.env`, credentials, private messages, production database records, or
  a video that exposes them.
- Do not claim a real deployment or real contact delivery as evaluation evidence; the
  reproducible synthetic test suite is the submitted evidence.
- Do not mark the package complete until the video URL has been tested and the final
  HackerEarth form has been submitted.

# Representative trajectory - Codex in ChatGPT Work

Date: 1 September 2026 UTC

This is one representative trajectory for the one coding agent used. It is condensed
for readability but keeps the instructions, tool responses, feedback, retry, and
human checkpoints needed to understand the work.

## 1. Human instruction

The human asked the agent to use the existing `Freelance-web-developer` repository,
work only on its challenge branch, avoid changing the main project, add all tests and
security files needed, make the result polished, and explain the complete submission.

**Human checkpoint:** branch-only modification was an explicit constraint.

## 2. Rules and repository discovery

The agent read the 10-page official challenge PDF and the public HackerEarth tabs.
It identified four required deliverables: full code plus improvement changelog,
clean-environment reproduction guide, video up to five minutes, and representative
agent trajectories.

The GitHub integration returned:

```text
Repository: sue-zadeh/Freelance-web-developer
Default branch: main
Challenge branch: freelance--Challenge
```

Local Git then confirmed both branches initially pointed to:

```text
56567bbb61d287d445ae3b00ef553fb2c7e0baa4
```

## 3. Baseline tool responses

The agent ran the same project before editing:

```text
npm test -- --watch=false
Exit 1: 0 passing, 2 failed, 1 empty suite

npm run build
Exit 0: 4 warnings

npm audit --omit=dev --json
Exit 1: 12 vulnerabilities (9 high, 2 moderate, 1 low)
```

**Feedback that shaped the next step:** the build looked convincing, but tests and
dependency evidence proved the release was not ready. Reading `src/server.ts` also
found missing rate limiting, weak input validation, raw HTML interpolation, and
unnecessary IP/user-agent collection.

## 4. Engineering action

The agent:

- removed unused vulnerable dependencies and updated compatible packages;
- split contact validation and routing into a testable security boundary;
- added type, length, email, and allowlist checks;
- escaped HTML email and added a plain-text alternative;
- added rate limiting, a honeypot, CSP/security headers, and a 16 KB body limit;
- stopped storing IP and user-agent values;
- fixed broken tests and added 14 security/failure-mode tests;
- added CI, a 12-case baseline/final evaluator, evidence, and the challenge page.

## 5. Retry and correction

The first local SSR verification reported that `localhost:4000` was not in Angular's
SSR host allowlist. The agent did not ignore the warning. It added explicit allowed
hosts for localhost and the production domain, rebuilt, and reran the check.

The original test command also failed because `ActivatedRoute` was missing and the
footer spec contained no test suite. The agent added the router test provider and
replaced the empty file with real tests.

## 6. Final tool responses

```text
npm run test
Exit 0: 3 files passed, 18 tests passed

npm run build
Exit 0: 5 routes prerendered, no warnings

npm audit --omit=dev --json
Exit 0: 0 production vulnerabilities

npm run guardian:evaluate
Baseline 0/12, final 12/12
```

## 7. Final human checkpoints

- Branch push: authorised by the user, limited to `freelance--Challenge`.
- Production deployment: not performed automatically.
- Video recording/upload: remains a human action using `challenge/VIDEO_SCRIPT.md`.
- HackerEarth final submission: remains a human action after reviewing ownership and
  participation terms and confirming the final repository and video URLs.

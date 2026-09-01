# Solution video - maximum 5 minutes

This is a final demo video, not a recording of every minute spent in Codex.

Recommended tool: Windows Snipping Tool screen recording, Clipchamp, Loom, or Zoom.
Record the screen at 1080p. Use the script below and keep the final video near 4:30.

## Before recording

1. Close email, messages, `.env`, Railway variables, and anything private.
2. Open the repository on branch `freelance--Challenge`.
3. Open a terminal in the project and run `npm ci` before recording.
4. Open `http://localhost:4000/release-guardian` after `npm run build` and `npm run start:prod`.
5. Keep `README.md`, `challenge/IMPROVEMENT_CHANGELOG.md`, and the terminal ready.

## 0:00-0:30 - Problem and user

Say:

> Hi, I am Sue. Freelance developers can ship a portfolio that looks finished while
> its public contact boundary, tests, dependencies, and privacy checks are still weak.
> Release Guardian uses a coding agent to improve that boundary, then makes a
> deterministic gate and a human checkpoint decide whether it is ready.

Show the Release Guardian title and the “Inspect. Fix. Prove. Approve.” workflow.

## 0:30-1:05 - Simple baseline

Show `challenge/evidence/baseline.md` and say:

> The untouched baseline is commit 56567bb. Its build passed, but the tests had zero
> passing, npm audit found 12 production vulnerabilities, and the release evaluator
> passed zero of 12 controls. This proves a successful build was not enough.

## 1:05-1:40 - Coding-agent workflow

Show `challenge/AGENT_INSTRUCTIONS.md` and the trajectory. Say:

> I used Codex in ChatGPT Work as one coding agent. It first captured the baseline,
> then focused on the smallest high-risk boundary, reran all gates after changes, and
> left push, deployment, and final submission as human-approved actions.

## 1:40-3:05 - One realistic execution

In the terminal, run:

```bash
npm run verify
```

While it runs, briefly show `src/server/contact.ts` and `contact.spec.ts`. Say:

> The final contact boundary validates types, lengths, email, and allowed selections.
> It escapes HTML email, uses parameterized database values, limits request size and
> rate, discards bot honeypot submissions, and no longer stores IP or browser data.
> Synthetic tests cover XSS, header injection, oversized input, spam, rate limiting,
> database failure, and email failure.

Return to the terminal and show the final passing output.

## 3:05-3:45 - Final comparison

Show the metric cards on `/release-guardian` and say:

> The same 12 release controls moved from zero to 12. Passing tests moved from zero to
> 18. Production vulnerabilities moved from 12 to zero, and build warnings moved from
> four to zero. Every claim has a command and stored evidence in the repository.

## 3:45-4:20 - Changelog and removed experiment

Show the changelog and say:

> The largest improvement came from hardening the public contact boundary and making
> its security behavior testable. I removed the experiment of using npm audit as the
> entire release decision. Audit found packages, but it missed unsafe email HTML,
> weak validation, spam, privacy over-collection, and broken tests.

## 4:20-4:40 - Hot take and close

Say:

> My hot take is that an agent should not be allowed to declare its own work finished.
> Let the agent move quickly, but let independent tests and a human checkpoint decide
> whether the result can leave the sandbox. Thank you.

Stop recording. Do not wait for five minutes.

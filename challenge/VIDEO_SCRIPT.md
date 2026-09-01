# Solution video - exact recording plan (maximum 5 minutes)

This is a short final demonstration, not a recording of every minute spent working in
Codex. Aim for 4:20-4:40 so the upload remains safely below the five-minute limit.

## A. Prepare before pressing Record

1. Close email, messages, `.env`, Railway variables, browser password prompts, and
   every tab that contains private information.
2. Set browser zoom to 90-100% and terminal text large enough to read in the video.
3. Open the GitHub branch page and confirm the branch selector says
   `freelance--Challenge`, not `main`.
4. In the project terminal, run `npm ci` before the recording.
5. Build and start the local site in terminal 1:

   ```bash
   npm run build
   npm run start:prod
   ```

6. Open `http://localhost:4000/release-guardian` and confirm the page loads.
7. Open terminal 2 in the repository and leave it ready for `npm run verify`.
8. Prepare these tabs/files in this exact order:
   - `/release-guardian`
   - `challenge/evidence/baseline.md`
   - `challenge/AGENT_INSTRUCTIONS.md`
   - `challenge/trajectories/codex-work.md`
   - terminal 2
   - `src/server/contact.ts`
   - `src/server/contact.spec.ts`
   - `challenge/IMPROVEMENT_CHANGELOG.md`
9. Use Windows Snipping Tool > Record, Clipchamp, Loom, or Zoom. Record the screen at
   1080p if possible. A webcam is optional; clear voice and readable evidence matter.
10. Do one short sound test, then start the final recording.

## B. Record in this exact order

### 0:00-0:15 - Title

**Show:** the top of `/release-guardian` with the title and
“Inspect. Fix. Prove. Approve.”

**Say:**

> Hi, I am Sue. This is Release Guardian, an evidence-driven security improvement for
> a real Angular and Node.js freelance portfolio.

### 0:15-0:40 - Problem and intended user

**Show:** stay on the workflow and problem section of the page.

**Say:**

> Freelance developers can ship a website that looks finished while its public contact
> API, tests, dependencies, and privacy checks are still weak. Release Guardian lets a
> coding agent improve the project, but independent tests and a human checkpoint decide
> whether the release is ready.

### 0:40-1:05 - Simple baseline

**Show:** `challenge/evidence/baseline.md`. Point to the four baseline results.

**Say:**

> I first measured the untouched baseline at commit 56567bb. The build passed, but
> there were zero passing tests, 12 production vulnerabilities, four build warnings,
> and zero of 12 release controls passed. A successful build was not enough.

### 1:05-1:35 - Agent instructions and trajectory

**Show:** first `challenge/AGENT_INSTRUCTIONS.md`, then
`challenge/trajectories/codex-work.md`. Scroll just enough to show the instruction,
tool responses, retry, and human checkpoints.

**Say:**

> I used Codex in ChatGPT Work as one coding agent. Its instruction was to inspect,
> fix, prove, and then stop for human approval. The trajectory records the prompt,
> tool results, implementation, retry, and final checkpoints. Push, deployment, and
> final submission remained human-approved actions.

### 1:35-1:45 - Start one realistic execution

**Show:** terminal 2. Type and run:

```bash
npm run verify
```

**Say:**

> Now I will reproduce the complete evaluation with one command.

### 1:45-2:35 - Explain the implemented solution while verification runs

**Show:** `src/server/contact.ts`, then `src/server/contact.spec.ts`. Do not expose an
`.env` file or any real contact data.

**Say:**

> The final contact boundary validates data types, lengths, email format, and allowed
> selections. It escapes HTML email, adds plain text email, uses parameterized database
> values, limits request size and request rate, and discards honeypot spam. It also no
> longer stores IP address or browser data. Synthetic tests cover XSS, header injection,
> oversized input, spam, rate limiting, database failure, and email failure.

### 2:35-3:05 - Show the live proof

**Show:** return to terminal 2. If verification is still running, briefly point to each
completed stage and wait only until the final audit line appears.

**Say:**

> The same command runs the behavioral tests, production build, baseline and final
> evaluator, and production dependency audit. The final result is 18 passing tests,
> a clean build, 12 of 12 controls, and zero production vulnerabilities.

If the command needs more time, keep speaking over the relevant output; never leave a
long silent section. Do not stop recording until the final command exits successfully.

### 3:05-3:35 - Final comparison and value

**Show:** return to `/release-guardian` and point to the four metric cards.

**Say:**

> Compared with the same baseline, release controls improved from zero to 12, passing
> tests from zero to 18, production vulnerabilities from 12 to zero, and build warnings
> from four to zero. Every claim has a command and stored evidence in the repository.

### 3:35-4:05 - Changelog and biggest change

**Show:** `challenge/IMPROVEMENT_CHANGELOG.md`. Point to Iteration 2 and the Final row.

**Say:**

> The biggest contributing change was hardening the public contact boundary and making
> its security behavior testable. The improvement changelog connects every meaningful
> iteration to evidence and records whether the change was kept or removed.

### 4:05-4:25 - Removed experiment

**Show:** point to Iteration 4 in the changelog.

**Say:**

> I removed the experiment of using npm audit as the entire release decision. Audit
> found vulnerable packages, but it missed unsafe email HTML, weak validation, spam,
> privacy over-collection, and broken tests. Audit remains one part of the full gate.

### 4:25-4:40 - Hot take and finish

**Show:** return to the Release Guardian title or final metric cards.

**Say:**

> My hot take is that an agent should not declare its own work finished. Let the agent
> move quickly, but let independent tests and a human checkpoint approve the result.
> Thank you.

Stop the recording immediately after “Thank you.” Do not add an outro that could push
the video beyond five minutes.

## C. Check and upload the video

1. Play the exported video once from beginning to end.
2. Confirm it is at most 5:00, voice is clear, terminal output is readable, and no
   secret, email inbox, private message, `.env`, API key, or production data appears.
3. Name it `Release Guardian - micro1 Frontier Engineering Challenge 2026`.
4. Upload it to YouTube as **Unlisted** (not Private), or use another host that judges
   can open without signing in.
5. Open the share URL in an incognito/private browser window. If it plays there, copy
   that exact URL into the HackerEarth submission form.

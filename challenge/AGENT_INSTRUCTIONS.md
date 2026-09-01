# Coding-agent instructions and disclosure

## Tool disclosure

- Coding agent: Codex inside ChatGPT Work
- Repository access: Git and the connected GitHub integration
- Engineering tools: Node.js, npm, Angular CLI, Vitest, Supertest, and npm audit
- Research evidence: the official challenge PDF and public HackerEarth challenge page

No model API key was added to the solution. One coding agent was used, with scoped
stages rather than claiming several agents that were not actually run.

## Agent mission

Improve the existing Angular SSR and Node.js portfolio for the challenge without
changing `main`. Work only on `freelance--Challenge`. Produce a correct, testable,
reproducible, clearly explained result and connect every result claim to evidence.

## Stage 1 - Inspect and baseline

1. Confirm the repository, branch, and baseline commit.
2. Read the server, public contact boundary, tests, build configuration, and README.
3. Run tests, production build, and production dependency audit before editing.
4. Record exact exit status, test count, warnings, and vulnerability severity counts.
5. Do not change code until the baseline is captured.

## Stage 2 - Implement the smallest high-value change

1. Focus on the public contact boundary instead of adding unrelated features.
2. Treat all request fields as untrusted.
3. Validate types, lengths, email format, and allowed selections on the server.
4. Use parameterized database values and escape all user content in HTML email.
5. Limit request size and request rate; add a low-friction bot control.
6. Remove unnecessary personal telemetry and unused vulnerable dependencies.
7. Keep secrets in environment variables and use synthetic test data only.

## Stage 3 - Verification and retry

1. Add behavioral tests for normal use, attacks, spam, and service failures.
2. Run tests, build, dependency audit, and the 12-case evaluator.
3. If any gate fails, inspect the evidence, revise the patch, and rerun all gates.
4. Report exact results. Do not replace a failed result with an explanation.

## Stage 4 - Human checkpoint

The agent may prepare commits and a branch after the user authorises it. The agent
must not deploy production, upload the video, accept new terms, or submit the final
HackerEarth entry without a human reviewing the evidence and approving the action.

## Success definition

- `main` remains unchanged;
- 12/12 release controls pass on final source;
- all automated tests pass;
- production build succeeds without warnings;
- production dependency audit reports zero vulnerabilities;
- all four required submission items are present or, for the video, fully scripted.

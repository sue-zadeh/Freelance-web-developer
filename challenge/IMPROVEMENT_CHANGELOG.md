# Improvement Changelog

The same 12-case evaluator is used for the baseline and final source.

| Stage | What was tried and why | Evidence | Decision / learning |
| --- | --- | --- | --- |
| Baseline | Used the existing project and its generic build, test, and dependency commands. | 0/12 release controls; 0 passing tests; 12 production vulnerabilities; 4 build warnings. | Established the untouched starting point at commit `56567bb`. |
| Iteration 1 | Removed unused Nodemailer, MySQL, and Tailwind packages and updated compatible dependencies. | `npm audit --omit=dev`: 12 vulnerabilities became 0. | Kept. Dependency hygiene removed known risk and reduced production dependencies. |
| Iteration 2 | Refactored the public contact boundary with type/length/allowlist validation, email escaping, parameterized storage, request-size limits, rate limiting, and a bot honeypot. | 14 focused contact tests pass, including XSS, header injection, oversized input, spam, rate limit, and service failure cases. | Kept. One small boundary produced the largest practical risk reduction. |
| Iteration 3 | Removed IP address and user-agent collection because they were not needed to answer an inquiry. | Privacy control changes from fail to pass; the schema and store no longer include those fields. | Kept. Data that is never collected cannot leak later. |
| Iteration 4 | Tried treating `npm audit` as the entire release decision. | It found vulnerable packages but could not detect unsafe email HTML, weak validation, spam, privacy over-collection, or broken tests. | Removed as a standalone approach. Audit remains one input inside the full gate. |
| Iteration 5 | Added one deterministic 12-case evaluator, behavioral tests, clean CI, exact commands, and human approval boundaries. | 12/12 controls, 18/18 tests, clean build, zero production vulnerabilities. | Kept. The verifier can reject an agent's plausible but incomplete patch. |
| Final | Combined the changes that produced measurable evidence and added a polished Release Guardian case-study page. | `npm run verify` passes from a clean install. | Main contribution: agent speed constrained by deterministic proof and human approval. |

## Main failure mode

The agent's first confident answer can be incomplete because security problems sit
across code, dependencies, runtime behavior, privacy, and release process. A clean
build by itself is not proof of a safe release.

## Hot take / insight

Agents become more reliable when “done” is removed from the agent's discretion. Give
the agent freedom to inspect and improve, but make an independent gate and a human
checkpoint decide whether the result can leave the sandbox.

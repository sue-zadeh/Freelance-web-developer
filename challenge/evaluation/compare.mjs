import { writeFileSync } from 'node:fs';
import { evaluateProject } from './evaluator.mjs';

const baselineRef = '56567bbb61d287d445ae3b00ef553fb2c7e0baa4';
const baseline = evaluateProject(baselineRef);
const final = evaluateProject('HEAD');
const comparison = {
  baselineRef,
  finalRef: 'HEAD',
  primaryMetric: final.primaryMetric,
  baseline: { passed: baseline.passed, total: baseline.total },
  final: { passed: final.passed, total: final.total },
  absoluteImprovement: final.passed - baseline.passed,
  checks: final.checks.map((finalCheck) => ({
    id: finalCheck.id,
    baseline: baseline.checks.find((check) => check.id === finalCheck.id)?.pass ?? false,
    final: finalCheck.pass,
    evidence: finalCheck.evidence,
  })),
};

writeFileSync(
  new URL('../evidence/latest-comparison.json', import.meta.url),
  `${JSON.stringify(comparison, null, 2)}\n`,
);
console.log(JSON.stringify(comparison, null, 2));

if (final.passed !== final.total) {
  process.exitCode = 1;
}

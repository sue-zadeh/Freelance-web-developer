import { evaluateProject } from './evaluator.mjs';

const ref = process.argv[2] || 'HEAD';
const result = evaluateProject(ref);
console.log(JSON.stringify(result, null, 2));

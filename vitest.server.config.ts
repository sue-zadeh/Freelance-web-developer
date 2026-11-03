import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'node', include: ['src/server/**/*.spec.ts'], testTimeout: 10000 },
});

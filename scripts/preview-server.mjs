import { spawn } from 'node:child_process';
const argumentsList = process.argv.slice(2);
const portIndex = argumentsList.indexOf('--port');
const port = portIndex >= 0 ? argumentsList[portIndex + 1] : process.env.PORT || '4000';
if (!/^\d{1,5}$/.test(port || '')) throw new Error('A valid preview port is required.');
const server = spawn(process.execPath, ['dist/sue-portfolio/server/server.mjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://terminal.local:' + port,
  },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', (code) => process.exit(code ?? 0));

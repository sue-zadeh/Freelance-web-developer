import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { ContactData } from './shared/contact';
import { createNotificationSender } from './server/notification';
import { createHttpApp } from './server/http-app';
dotenv.config({ quiet: true });

const production = process.env['NODE_ENV'] === 'production';
const databaseHost = process.env['PGHOST'] || 'localhost';
const pool = new Pool({
  host: databaseHost,
  port: Number(process.env['PGPORT']) || 5432,
  user: process.env['PGUSER'],
  password: process.env['PGPASSWORD'],
  database: process.env['PGDATABASE'],
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  query_timeout: 5000,
  // Railway private networking is encrypted by the platform. Public DB connections verify TLS.
  ssl:
    production && !databaseHost.endsWith('.railway.internal')
      ? { rejectUnauthorized: true }
      : false,
});
pool.on('error', () => console.error('Database connection error; check database availability.'));
const apiKey = process.env['RESEND_API_KEY'];
if (!apiKey)
  console.warn(
    'Email is not configured. Enquiries will be saved with notification_pending status.',
  );

async function saveContact(contact: ContactData): Promise<string> {
  const result = await pool.query(
    'INSERT INTO contact (name, email, company, project_type, budget_range, timeline, message, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [
      contact.name,
      contact.email,
      contact.company || null,
      contact.projectType,
      contact.budget || null,
      contact.timeline || null,
      contact.message,
      'new',
    ],
  );
  return String(result.rows[0].id);
}
const sendNotification = createNotificationSender(apiKey);
const app = createHttpApp(
  {
    saveContact,
    sendNotification,
    markNotification: async (reference, status) => {
      await pool.query('UPDATE contact SET status = $1 WHERE id = $2', [status, reference]);
    },
    log: (message) => console.info(message),
  },
  { production, clientOrigin: process.env['CLIENT_ORIGIN'] },
);

const browserDistFolder = join(import.meta.dirname, '../browser');
const angularApp = new AngularNodeAppEngine();
// Serve the verified prerendered document directly. Search engines and visitors
// receive the complete page even if the hosting platform falls back to CSR.
app.get('/', (_request, response, next) => {
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.sendFile(join(browserDistFolder, 'index.html'), (error) => {
    if (error) next(error);
  });
});
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    maxAge: '1h',
    setHeaders: (response, filePath) => {
      if (/[-.][A-Z0-9]{8,}\.(?:js|css)$/i.test(filePath))
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      if (/\.(?:html|txt|xml)$/i.test(filePath))
        response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    },
  }),
);
app.use((request, response, next) => {
  // Missing assets must stay 404 instead of becoming a successful app shell.
  if (/\.[^/]+$/.test(request.path)) {
    response.status(404).type('text').send('File not found.');
    return;
  }
  angularApp
    .handle(request)
    .then((result) => (result ? writeResponseToNodeResponse(result, response) : next()))
    .catch(next);
});
app.use((_request, response) => {
  response.status(404).send('Page not found. Visit https://suewebstudio.com/');
});
app.use(
  (
    _error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('Page rendering failed.');
    response.status(500).send('This page is temporarily unavailable. Please try again.');
  },
);
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const server = app.listen(process.env['PORT'] || 4000, () =>
    console.info('Sue Web Studio server is listening.'),
  );
  server.requestTimeout = 20000;
  server.headersTimeout = 15000;
  process.on('SIGTERM', () => {
    server.close(() => {
      void pool.end();
    });
  });
}
export const reqHandler = createNodeRequestHandler(app);

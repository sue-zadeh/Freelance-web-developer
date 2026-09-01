import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { join } from 'node:path';
import { Pool } from 'pg';
import { Resend } from 'resend';
import {
  buildContactEmailHtml,
  buildContactEmailText,
  createContactRouter,
  type ContactNotifier,
  type ContactStore,
  type ContactSubmission,
} from './server/contact';

dotenv.config();

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();
const pool = new Pool({
  host: process.env['PGHOST'] || 'localhost',
  port: Number(process.env['PGPORT']) || 5432,
  user: process.env['PGUSER'],
  password: process.env['PGPASSWORD'],
  database: process.env['PGDATABASE'],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

class PostgresContactStore implements ContactStore {
  async save(submission: ContactSubmission): Promise<number> {
    const result = await pool.query<{ id: number }>(
      `
        INSERT INTO contact
        (name, email, company, project_type, budget_range, timeline, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `,
      [
        submission.name,
        submission.email,
        submission.company,
        submission.projectType,
        submission.budget,
        submission.timeline,
        submission.message,
        'new',
      ],
    );

    const id = result.rows[0]?.id;
    if (!id) {
      throw new Error('The database did not return a contact ID.');
    }
    return id;
  }
}

class ResendContactNotifier implements ContactNotifier {
  async send(submission: ContactSubmission): Promise<void> {
    const resendApiKey = process.env['RESEND_API_KEY'];
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured.');
    }

    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: 'Sue Web Studio <contact@suewebstudio.com>',
      to: ['suezadeh@suewebstudio.com'],
      replyTo: submission.email,
      subject: `New project inquiry from ${submission.name.replace(/[\r\n]/g, ' ')}`,
      html: buildContactEmailHtml(submission),
      text: buildContactEmailText(submission),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}

const allowedOrigins = new Set(
  (
    process.env['CLIENT_ORIGINS'] ||
    'http://localhost:4200,http://localhost:4000,https://suewebstudio.com,https://www.suewebstudio.com'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        upgradeInsecureRequests:
          process.env['NODE_ENV'] === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed.'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: '16kb', strict: true }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use(
  '/api/contact',
  createContactRouter({
    store: new PostgresContactStore(),
    notifier: new ResendContactNotifier(),
  }),
);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((request, response, next) => {
  angularApp
    .handle(request)
    .then((angularResponse) =>
      angularResponse
        ? writeResponseToNodeResponse(angularResponse, response)
        : next(),
    )
    .catch(next);
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('Unhandled request error.', {
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
    response.status(500).json({ message: 'The request could not be completed.' });
  },
);

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT']) || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export { app };
export const reqHandler = createNodeRequestHandler(app);

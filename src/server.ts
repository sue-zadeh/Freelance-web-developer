// Import Angular SSR tools used to render the Angular app on the server
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { join } from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

dotenv.config();

if (!process.env['ZOHO_SMTP_USER'] || !process.env['ZOHO_SMTP_PASSWORD']) {
  console.warn('Zoho SMTP credentials are missing. Contact form emails will not send.');
}

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

const CONTACT_EMAIL = 'suezadeh@suewebstudio.com';
const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 5;
const contactRequestTimes = new Map<string, number[]>();

const allowedProjectTypes = new Set([
  'Business Website',
  'Portfolio Website',
  'Admin Dashboard',
  'Custom Web App',
  'API / Backend Integration',
  'Website Redesign',
  'Other',
]);

const allowedBudgets = new Set([
  '',
  'Under $1,000',
  '$1,000 - $3,000',
  '$3,000 - $6,000',
  '$6,000+',
  'Not sure yet',
]);

const allowedTimelines = new Set([
  '',
  'ASAP',
  'Within 2 weeks',
  'Within 1 month',
  '1 to 3 months',
  'Flexible',
]);

function getString(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function contactRateLimit(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const recent = (contactRequestTimes.get(ip) || []).filter(
    (time) => now - time < CONTACT_RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= CONTACT_RATE_LIMIT_MAX) {
    res.setHeader('Retry-After', Math.ceil(CONTACT_RATE_LIMIT_WINDOW_MS / 1000).toString());
    res.status(429).json({
      message: 'Too many messages were sent from this connection. Please try again later.',
    });
    return;
  }

  recent.push(now);
  contactRequestTimes.set(ip, recent);
  next();
}

// Railway and other reverse proxies provide the real client IP through proxy headers.
app.set('trust proxy', 1);

// Do not advertise the Express framework in response headers.
app.disable('x-powered-by');

// Low-risk security headers that do not interfere with Angular SSR or external fonts/icons.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(
  cors({
    origin: process.env['CLIENT_ORIGIN'] || 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

// Keep request bodies small because the public API only accepts a short contact form.
app.use(express.json({ limit: '20kb' }));

const pool = new Pool({
  host: process.env['PGHOST'] || 'localhost',
  port: Number(process.env['PGPORT']) || 5432,
  user: process.env['PGUSER'],
  password: process.env['PGPASSWORD'],
  database: process.env['PGDATABASE'],
  ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
});

app.get('/api/health', async (_req, res) => {
  res.json({ message: 'API is running' });
});

app.post('/api/contact', contactRateLimit, async (req, res) => {
  try {
    const body = req.body ?? {};

    const name = getString(body.name);
    const email = getString(body.email);
    const company = getString(body.company) ?? '';
    const projectType = getString(body.projectType);
    const budget = getString(body.budget) ?? '';
    const timeline = getString(body.timeline) ?? '';
    const message = getString(body.message);

    // Hidden honeypot field. Real visitors never fill this in.
    const website = getString(body.website) ?? '';
    if (website) {
      res.status(201).json({ message: 'Contact form submitted successfully.' });
      return;
    }

    if (!name || !email || !projectType || !message) {
      res.status(400).json({
        message: 'Name, email, project type, and message are required.',
      });
      return;
    }

    if (
      name.length > 100 ||
      email.length > 150 ||
      company.length > 150 ||
      projectType.length > 100 ||
      budget.length > 100 ||
      timeline.length > 100 ||
      message.length > 5000
    ) {
      res.status(400).json({ message: 'Some fields are too long.' });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ message: 'Please enter a valid email address.' });
      return;
    }

    if (!allowedProjectTypes.has(projectType)) {
      res.status(400).json({ message: 'Please select a valid project type.' });
      return;
    }

    if (!allowedBudgets.has(budget) || !allowedTimelines.has(timeline)) {
      res.status(400).json({ message: 'Please select valid form options.' });
      return;
    }

    const sql = `
      INSERT INTO contact
      (
        name,
        email,
        company,
        project_type,
        budget_range,
        timeline,
        message,
        ip_address,
        user_agent,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

    const values = [
      name,
      email,
      company || null,
      projectType,
      budget || null,
      timeline || null,
      message,
      req.ip,
      (req.get('user-agent') || '').slice(0, 500) || null,
      'new',
    ];

    // Save first so a genuine lead is not lost if the email provider has a temporary problem.
    const result = await pool.query(sql, values);
    const contactId = result.rows[0].id;

    const smtpUser = process.env['ZOHO_SMTP_USER'];
    const smtpPassword = process.env['ZOHO_SMTP_PASSWORD'];

    if (!smtpUser || !smtpPassword) {
      console.error(`Contact #${contactId} saved, but Zoho SMTP credentials are missing.`);
      res.status(202).json({
        message: 'Your message was received successfully.',
        id: contactId,
      });
      return;
    }

    const smtpPort = Number(process.env['ZOHO_SMTP_PORT']) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env['ZOHO_SMTP_HOST'] || 'smtppro.zoho.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company || '-');
    const safeProjectType = escapeHtml(projectType);
    const safeBudget = escapeHtml(budget || '-');
    const safeTimeline = escapeHtml(timeline || '-');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const safeSubjectName = name.replace(/[\r\n]+/g, ' ').slice(0, 100);

    try {
      const info = await transporter.sendMail({
        from: `Sue Web Studio <${smtpUser}>`,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `New project inquiry from ${safeSubjectName}`,
        text: [
          `Reference: #${contactId}`,
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || '-'}`,
          `Project Type: ${projectType}`,
          `Budget: ${budget || '-'}`,
          `Timeline: ${timeline || '-'}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Reference:</strong> #${contactId}</p>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Project Type:</strong> ${safeProjectType}</p>
          <p><strong>Budget:</strong> ${safeBudget}</p>
          <p><strong>Timeline:</strong> ${safeTimeline}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      });

      console.log(`Contact #${contactId} Zoho notification sent:`, info.messageId);
    } catch (emailError: any) {
      console.error(
        `Contact #${contactId} Zoho SMTP notification failed:`,
        emailError?.message || emailError,
      );

      res.status(202).json({
        message: 'Your message was received successfully.',
        id: contactId,
      });
      return;
    }

    res.status(201).json({
      message: 'Contact form submitted successfully.',
      id: contactId,
    });
    return;
  } catch (error: any) {
    console.error('Error handling contact form:', error);

    res.status(500).json({
      message: 'Something went wrong while submitting the contact form.',
    });
    return;
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

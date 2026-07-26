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
import { Resend } from 'resend';

dotenv.config();

if (!process.env['RESEND_API_KEY']) {
  console.warn('RESEND_API_KEY is missing. Contact form emails will not send.');
}

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  cors({
    origin: process.env['CLIENT_ORIGIN'] || 'http://localhost:4200',
  }),
);

app.use(express.json());

const pool = new Pool({
  host: process.env['PGHOST'] || 'localhost',
  port: Number(process.env['PGPORT']) || 5432,
  user: process.env['PGUSER'],
  password: process.env['PGPASSWORD'],
  database: process.env['PGDATABASE'],
  ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
});

const resend = new Resend(process.env['RESEND_API_KEY']);

app.get('/api/health', async (_req, res) => {
  res.json({ message: 'API is running' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, projectType, budget, timeline, message } = req.body;

    if (!name || !email || !projectType || !message) {
      res.status(400).json({
        message: 'Name, email, project type, and message are required.',
      });
      return;
    }

    if (name.length > 100 || email.length > 150 || projectType.length > 100) {
      res.status(400).json({
        message: 'Some fields are too long.',
      });
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
      name.trim(),
      email.trim(),
      company ? company.trim() : null,
      projectType.trim(),
      budget ? budget.trim() : null,
      timeline ? timeline.trim() : null,
      message.trim(),
      req.ip,
      req.get('user-agent') || null,
      'new',
    ];

    const result = await pool.query(sql, values);

    const emailResult = await resend.emails.send({
      from: 'Sue Web Studio <contact@suewebstudio.com>',
      to: ['suezadeh@suewebstudio.com'],
      replyTo: email.trim(),
      subject: `New project inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || '-'}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget:</strong> ${budget || '-'}</p>
        <p><strong>Timeline:</strong> ${timeline || '-'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('Resend email result:', emailResult);

    res.status(201).json({
      message: 'Contact form submitted successfully.',
      id: result.rows[0].id,
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
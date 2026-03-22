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
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
dotenv.config();

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  cors({
    origin: process.env['CLIENT_ORIGIN'] || 'http://localhost:4200',
  }),
);

app.use(express.json());

const pool = mysql.createPool({
  host: process.env['DB_HOST'] || 'localhost',
  user: process.env['DB_USER'] || 'freelance_user',
  password: process.env['DB_PASSWORD'] || '',
  database: process.env['DB_NAME'] || 'freelance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASS'],
  },
});

/**
 * API health check
 */
app.get('/api/health', async (_req, res) => {
  res.json({ message: 'API is running' });
});

/**
 * Contact form submission
 */
app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
      message,
    } = req.body;

    if (!name || !email || !projectType || !message) {
      res.status(400).json({
        message: 'Name, email, project type, and message are required.',
      });
      return;
    }

    if (
      name.length > 100 ||
      email.length > 150 ||
      projectType.length > 100
    ) {
      res.status(400).json({
        message: 'Some fields are too long.',
      });
      return;
    }

    const sql = `
      INSERT INTO contact
      (name, email, company, project_type, budget_range, timeline, message, ip_address, user_agent, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    const [result] = await pool.execute(sql, values);

    await transporter.sendMail({
      from: process.env['EMAIL_USER'],
      to: process.env['EMAIL_USER'],
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

    res.status(201).json({
      message: 'Contact form submitted successfully.',
      id: (result as mysql.ResultSetHeader).insertId,
    });
    return;
  } catch (error: any) {
    console.error('Error saving contact form:');
    console.error('message:', error?.message);
    console.error('code:', error?.code);
    console.error('sqlMessage:', error?.sqlMessage);
    console.error('full error:', error);

    res.status(500).json({
      message: 'Something went wrong while saving the contact form.',
    });
    return;
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by Angular CLI
 */
export const reqHandler = createNodeRequestHandler(app);
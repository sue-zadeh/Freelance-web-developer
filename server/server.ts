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
      return res.status(400).json({
        message: 'Name, email, project type, and message are required.',
      });
    }

    if (
      name.length > 100 ||
      email.length > 150 ||
      projectType.length > 100
    ) {
      return res.status(400).json({
        message: 'Some fields are too long.',
      });
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

    res.status(201).json({
      message: 'Contact form submitted successfully.',
      id: (result as mysql.ResultSetHeader).insertId,
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({
      message: 'Something went wrong while saving the contact form.',
    });
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
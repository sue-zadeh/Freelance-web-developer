// Import Angular SSR Node engine utilities for server-side rendering execution
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
// Import Express web framework to handle HTTP routes and middleware
import express from 'express';
// Import path join utility from Node core modules for resolving directories safely across platforms
import { join } from 'node:path';
// Import CORS middleware to enable cross-origin resource sharing requests
import cors from 'cors';
// Import dotenv to load environment variables from local .env files during development
import dotenv from 'dotenv';
// Import PostgreSQL client Pool manager from pg module for managing DB connection pools
import { Pool } from 'pg';
// Import Nodemailer library to manage outbound SMTP connections and send emails
import nodemailer from 'nodemailer';

// Initialize and parse environment variables into process.env
dotenv.config();

// Define distribution folder path pointing to browser assets output from Angular build
const browserDistFolder = join(import.meta.dirname, '../browser');

// Create Express application instance
const app = express();
// Instantiate Angular Node App Engine to handle server-side rendering of page routes
const angularApp = new AngularNodeAppEngine();

// Mount CORS middleware to allow cross-origin requests from configured client origin URL
app.use(
  cors({
    origin: process.env['CLIENT_ORIGIN'] || 'http://localhost:4200',
  }),
);

// Mount Express JSON body-parsing middleware to parse incoming JSON payloads in req.body
app.use(express.json());

// Initialize PostgreSQL connection pool using environment variables or localhost defaults
const pool = new Pool({
  host: process.env['PGHOST'] || 'localhost',
  port: Number(process.env['PGPORT']) || 5432,
  user: process.env['PGUSER'],
  password: process.env['PGPASSWORD'],
  database: process.env['PGDATABASE'],
  ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
});

// Convert EMAIL_PORT environment variable to number, defaulting to port 465 if omitted
const emailPort = Number(process.env['EMAIL_PORT']) || 465;

// Configure Nodemailer SMTP transport instance with server settings and auth credentials
const transporter = nodemailer.createTransport({
  host: process.env['EMAIL_HOST'] || 'smtp.zoho.com.au',
  port: emailPort,
  secure: emailPort === 465, // True for implicit SSL (465), false for STARTTLS (587 or 2525)
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASS'],
  },
  // Set timeouts to prevent hanging background connections when ports are blocked
  connectionTimeout: 10000, // Max 10s allowed to establish TCP connection
  greetingTimeout: 10000,    // Max 10s allowed to receive SMTP greeting banner
  socketTimeout: 10000,      // Max 10s allowed for socket inactivity
});

// Verify SMTP connection status immediately upon server boot-up
transporter.verify((error, success) => {
  if (error) {
    // Log clear error directly in server boot logs if SMTP credentials or port fail
    console.error('SMTP Connection Error during boot:', error?.message || error);
  } else {
    // Confirm successful SMTP handshake and authentication in Railway startup logs
    console.log('SMTP Server is ready to send messages');
  }
});

/**
 * Health check endpoint for basic uptime monitoring
 */
app.get('/api/health', async (_req, res) => {
  res.json({ message: 'API is running' });
});

/**
 * Handle contact form submission (POST /api/contact)
 */
app.post('/api/contact', async (req, res) => {
  try {
    // Destructure required contact form payload fields from client request body
    const {
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
      message,
    } = req.body;

    // Validate mandatory input presence
    if (!name || !email || !projectType || !message) {
      res.status(400).json({
        message: 'Name, email, project type, and message are required.',
      });
      return;
    }

    // Enforce character length restrictions to prevent database column overflow
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

    // SQL query template using parameterized variables ($1..$10) to prevent SQL injection
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

    // Map input fields to SQL parameter array, trimming whitespace and setting empty values to null
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

    // Execute database insert query against PostgreSQL connection pool
    const result = await pool.query(sql, values);

    // Isolated try-catch block for email dispatching so mail failure won't rollback DB insertion
    try {
      await transporter.sendMail({
        from: process.env['EMAIL_USER'], // Zoho sender address (must match authenticated account)
        to: process.env['EMAIL_USER'],   // Recipient address (receives new client inquiry)
        replyTo: email.trim(),           // Reply directly to client email address upon clicking reply
        subject: `New project inquiry from ${name}`, // Email subject line
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
    } catch (emailError: any) {
      // Log explicit error message if sending email fails inside background task
      console.error('Failed to send email notification:', emailError?.message || emailError);
    }

    // Return HTTP 201 Created response to client along with saved record database ID
    res.status(201).json({
      message: 'Contact form submitted successfully.',
      id: result.rows[0].id,
    });
    return;
  } catch (error: any) {
    // Log unexpected internal database or general server errors to standard error stream
    console.error('Error saving contact form:');
    console.error('message:', error?.message);
    console.error('code:', error?.code);
    console.error('detail:', error?.detail);
    console.error('full error:', error);

    // Send HTTP 500 status code indicating server failure to client
    res.status(500).json({
      message: 'Something went wrong while saving the contact form.',
    });
    return;
  }
});

/**
 * Serve pre-built static client assets from the /browser folder
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Fallback middleware to handle client route requests via Angular Server-Side Rendering
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
 * Start listening on configured port when module is executed directly
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
 * Export request handler for Angular CLI integration
 */
export const reqHandler = createNodeRequestHandler(app);
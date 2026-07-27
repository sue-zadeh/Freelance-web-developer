// Import Angular SSR tools used to render the Angular app on the server
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

// Import Express to create the backend server
import express from 'express';

// Import join to safely create file/folder paths
import { join } from 'node:path';

// Import CORS so the frontend can call the backend API
import cors from 'cors';

// Import dotenv so local .env variables can be loaded during local development
import dotenv from 'dotenv';

// Import PostgreSQL connection pool
import { Pool } from 'pg';

// Import Resend email service
import { Resend } from 'resend';

// Load environment variables from .env locally
dotenv.config();

// Warn in logs if the Resend API key is missing
// Do not create Resend here, because Railway/Angular build can fail during SSR build
if (!process.env['RESEND_API_KEY']) {
  console.warn('RESEND_API_KEY is missing. Contact form emails will not send.');
}

// Set the folder where Angular browser build files are stored
const browserDistFolder = join(import.meta.dirname, '../browser');

// Create the Express app
const app = express();

// Create the Angular SSR engine
const angularApp = new AngularNodeAppEngine();

// Enable CORS so the frontend can send requests to this backend
app.use(
  cors({
    // Use CLIENT_ORIGIN from Railway/local .env, or localhost for development
    origin: process.env['CLIENT_ORIGIN'] || 'http://localhost:4200',
  }),
);

// Allow Express to read JSON body data from requests
app.use(express.json());

// Create PostgreSQL connection pool
const pool = new Pool({
  // Database host, local fallback is localhost
  host: process.env['PGHOST'] || 'localhost',

  // Database port, local PostgreSQL usually uses 5432
  port: Number(process.env['PGPORT']) || 5432,

  // Database username
  user: process.env['PGUSER'],

  // Database password
  password: process.env['PGPASSWORD'],

  // Database name
  database: process.env['PGDATABASE'],

  // Use SSL only in production, needed for Railway PostgreSQL
  ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
});

// Simple API route to check if backend is running
app.get('/api/health', async (_req, res) => {
  // Send success response
  res.json({ message: 'API is running' });
});

// Contact form API route
app.post('/api/contact', async (req, res) => {
  try {
    // Get form values from frontend request body
    const { name, email, company, projectType, budget, timeline, message } = req.body;

    // Check required fields
    if (!name || !email || !projectType || !message) {
      // Return bad request if required fields are missing
      res.status(400).json({
        message: 'Name, email, project type, and message are required.',
      });

      // Stop the function here
      return;
    }

    // Check basic field length limits
    if (name.length > 100 || email.length > 150 || projectType.length > 100) {
      // Return bad request if fields are too long
      res.status(400).json({
        message: 'Some fields are too long.',
      });

      // Stop the function here
      return;
    }

    // SQL query to insert the contact form data into PostgreSQL
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

    // Values for the SQL query
    const values = [
      // Clean name
      name.trim(),

      // Clean email
      email.trim(),

      // Company is optional, so save null if empty
      company ? company.trim() : null,

      // Clean project type
      projectType.trim(),

      // Budget is optional, so save null if empty
      budget ? budget.trim() : null,

      // Timeline is optional, so save null if empty
      timeline ? timeline.trim() : null,

      // Clean message
      message.trim(),

      // Save visitor IP address
      req.ip,

      // Save browser/user agent info if available
      req.get('user-agent') || null,

      // Default status for new messages
      'new',
    ];

    // Save contact form data into PostgreSQL
    const result = await pool.query(sql, values);

    // Get Resend API key from environment variables
    const resendApiKey = process.env['RESEND_API_KEY'];

    // If Resend API key is missing, return an error instead of fake success
    if (!resendApiKey) {
      // Log clear server-side error
      console.error('RESEND_API_KEY is missing.');

      // Tell frontend that form was saved but email failed
      res.status(500).json({
        message: 'Form saved, but email service is not configured.',
      });

      // Stop the function here
      return;
    }

    // Create Resend only here, inside the route, so Angular/Railway build does not fail
    const resend = new Resend(resendApiKey);

    // Send email notification using Resend
    try {
      // Send email to your business email
      const emailResult = await resend.emails.send({
        // Sender must use your verified Resend domain
        from: 'Sue Web Studio <contact@suewebstudio.com>',

        // Email receiver
        to: ['suezadeh@suewebstudio.com'],

        // When you click reply, it replies to the client/customer
        replyTo: email.trim(),

        // Email subject
        subject: `New project inquiry from ${name}`,

        // Email HTML body
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

      // Log Resend result so you can check Railway logs
      console.log('Resend email result:', JSON.stringify(emailResult));
    } catch (emailError: any) {
      // Log exact email error in Railway logs
      console.error('Resend email failed:', emailError?.message || emailError);

      // Return error so frontend does not show fake success
      res.status(500).json({
        message: 'Form saved, but email notification failed.',
      });

      // Stop the function here
      return;
    }

    // If database save and email send both worked, return success
    res.status(201).json({
      message: 'Contact form submitted successfully.',
      id: result.rows[0].id,
    });

    // Stop the function here
    return;
  } catch (error: any) {
    // Log any database or unexpected server error
    console.error('Error handling contact form:', error);

    // Return server error to frontend
    res.status(500).json({
      message: 'Something went wrong while submitting the contact form.',
    });

    // Stop the function here
    return;
  }
});

// Serve Angular static browser files
app.use(
  express.static(browserDistFolder, {
    // Cache static files for one year
    maxAge: '1y',

    // Do not automatically serve index.html here
    index: false,

    // Do not redirect automatically
    redirect: false,
  }),
);

// Let Angular SSR handle all other routes
app.use((req, res, next) => {
  // Ask Angular SSR to handle the request
  angularApp
    .handle(req)

    // If Angular returns a response, write it to Express response
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))

    // If Angular has an error, pass it to Express error handler
    .catch(next);
});

// Start server only when this file is the main running module
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  // Use Railway PORT or fallback to 4000 locally
  const port = process.env['PORT'] || 4000;

  // Start listening for requests
  app.listen(port, (error) => {
    // If server fails to start, throw error
    if (error) {
      throw error;
    }

    // Log the server URL
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Export request handler for Angular SSR
export const reqHandler = createNodeRequestHandler(app);
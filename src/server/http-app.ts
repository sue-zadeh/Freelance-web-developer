import express from 'express';
import { ContactDependencies, createContactRouter } from './contact';

export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  '/about': '/#about',
  '/projects': '/#projects',
  '/contact': '/#contact',
};
export function createHttpApp(
  dependencies: ContactDependencies,
  options: { production?: boolean; clientOrigin?: string } = {},
): express.Express {
  const app = express();
  app.disable('x-powered-by');
  // Exactly one trusted Railway edge hop; do not trust arbitrary forwarded chains.
  app.set('trust proxy', 1);
  app.use((request, response, next) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()',
    );
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    );
    if (options.production) response.setHeader('Strict-Transport-Security', 'max-age=31536000');
    if (
      options.production &&
      request.hostname === 'freelance-dev-sue.up.railway.app' &&
      request.method === 'GET' &&
      !request.path.startsWith('/api/')
    ) {
      response.redirect(301, 'https://suewebstudio.com' + request.originalUrl);
      return;
    }
    const destination = LEGACY_REDIRECTS[request.path.replace(/\/$/, '')];
    if (destination && (request.method === 'GET' || request.method === 'HEAD')) {
      response.redirect(301, destination);
      return;
    }
    next();
  });
  app.get('/api/health', (_request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.json({ status: 'ok' });
  });
  const origins = ['https://suewebstudio.com', 'https://www.suewebstudio.com'];
  if (options.clientOrigin) origins.push(options.clientOrigin);
  if (!options.production) origins.push('http://localhost:4200', 'http://localhost:4000');
  app.use('/api/contact', createContactRouter(dependencies, origins));
  app.use('/api', (_request, response) => {
    response.status(404).json({ message: 'API route not found.' });
  });
  app.use(
    (
      error: { type?: string; status?: number },
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      if (error.type === 'entity.too.large') {
        response.status(413).json({ message: 'Your message is too large.' });
        return;
      }
      if (error instanceof SyntaxError) {
        response.status(400).json({ message: 'Please check the contact form data.' });
        return;
      }
      dependencies.log('A request failed without exposing private details.');
      response.status(500).json({ message: 'The request could not be completed.' });
    },
  );
  return app;
}

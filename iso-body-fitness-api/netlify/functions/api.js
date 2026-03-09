/**
 * netlify/functions/api.js
 *
 * Wraps the Express application with serverless-http so it can run as a
 * Netlify serverless function.
 *
 * How it works
 * ─────────────
 * serverless-http translates the Netlify Lambda event/context objects into a
 * standard Node.js IncomingMessage + ServerResponse pair that Express can
 * process.  The response is then converted back into the Lambda format that
 * Netlify expects.
 *
 * Route mapping (configured in netlify.toml)
 * ───────────────────────────────────────────
 *   /api/*  →  /.netlify/functions/api/:splat  (200 rewrite)
 *   /*      →  /.netlify/functions/api          (200 rewrite, health / catch-all)
 *
 * This means every inbound request hits this function; Express then matches
 * the path against its registered routes exactly as it would in a long-lived
 * process.
 */

import serverless from 'serverless-http';

// esbuild (Netlify's bundler) resolves the .js extension to .ts at build time,
// so this import transparently compiles and bundles src/app.ts.
import app from '../../src/app.js';

export const handler = serverless(app);

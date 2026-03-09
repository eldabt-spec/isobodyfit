/**
 * src/server.ts
 *
 * Local development entry point.
 * Imports the configured Express app and binds it to a port.
 * Not used in production — the Netlify function (netlify/functions/api.js)
 * imports src/app.ts directly.
 */

import app from './app.js';

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`🚀  Iso-Body API running on http://localhost:${PORT}`);
});

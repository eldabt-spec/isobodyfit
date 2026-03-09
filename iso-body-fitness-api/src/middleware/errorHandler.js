/**
 * Global error handler — must be registered last with app.use().
 */
export function errorHandler(err, req, res, _next) {
  console.error(err);

  // Prisma known request errors (e.g. unique constraint violations)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that value already exists.' });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

import type { Request, Response, NextFunction } from 'express';

interface PrismaError extends Error {
  code?: string;
}

/**
 * Global error handler — must be the last middleware registered with app.use().
 * Handles Prisma-specific error codes and falls back to a generic 500.
 */
export function errorHandler(
  err: PrismaError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  console.error(err);

  // Prisma: unique constraint violation
  if (err.code === 'P2002') {
    res.status(409).json({ error: 'A record with that value already exists.' });
    return;
  }

  // Prisma: record not found
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Record not found.' });
    return;
  }

  const status = (err as { status?: number; statusCode?: number }).status
    ?? (err as { status?: number; statusCode?: number }).statusCode
    ?? 500;

  res.status(status).json({ error: err.message || 'Internal server error.' });
}

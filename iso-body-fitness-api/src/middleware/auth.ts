import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/index.js';

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set in environment variables.');
  return secret;
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.split(' ')[1];
  return token?.trim() || null;
}

// ─────────────────────────────────────────
// authenticate
// ─────────────────────────────────────────

/**
 * Verifies the `Authorization: Bearer <token>` header.
 *
 * On success  → attaches the decoded payload to `req.user` and calls `next()`.
 * On failure  → responds 401 immediately; `next()` is never called.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);

  if (!token) {
    res.status(401).json({ error: 'Authorization header missing or malformed. Expected: Bearer <token>' });
    return;
  }

  try {
    const payload = jwt.verify(token, getSecret()) as JwtPayload;

    // Sanity-check the shape — guards against tokens issued by other services
    if (!payload.sub || !payload.role) {
      res.status(401).json({ error: 'Token payload is invalid.' });
      return;
    }

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token has expired. Please log in again.' });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token is invalid.' });
      return;
    }
    // Unexpected error — let the global error handler deal with it
    next(err);
  }
}

// ─────────────────────────────────────────
// authorize
// ─────────────────────────────────────────

/**
 * Role-based access guard.  Must be used **after** `authenticate`.
 *
 * @example
 * router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);
 * router.get('/all',    authenticate, authorize('ADMIN', 'CLIENT'), listItems);
 */
export function authorize(...roles: JwtPayload['role'][]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      // Should never happen if `authenticate` ran first, but guard anyway
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}

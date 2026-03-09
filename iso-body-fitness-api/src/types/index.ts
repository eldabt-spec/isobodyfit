// ─────────────────────────────────────────
// JWT
// ─────────────────────────────────────────

/** Shape of the decoded JWT payload attached to every authenticated request. */
export interface JwtPayload {
  /** User's cuid — used as the database lookup key. */
  sub: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  tier: 'STUDIO' | 'REMOTE';
  iat?: number;
  exp?: number;
}

// ─────────────────────────────────────────
// Express Request augmentation
// ─────────────────────────────────────────

/**
 * Extend Express's Request interface so `req.user` is typed everywhere
 * without a cast.  Populated by the `authenticate` middleware.
 */
declare global {
  namespace Express {
    interface Request {
      /** Present on all routes guarded by `authenticate()`. */
      user?: JwtPayload;
    }
  }
}

// Required to make this file a module (enables global augmentation above)
export {};

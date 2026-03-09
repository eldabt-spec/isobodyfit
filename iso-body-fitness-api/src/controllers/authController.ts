import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import type { JwtPayload } from '../types/index.js';

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

const USER_SELECT = {
  id:        true,
  firstName: true,
  lastName:  true,
  email:     true,
  role:      true,
  tier:      true,
  isActive:  true,
  createdAt: true,
} as const;

/** Minimum fields returned in every auth response. */
type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  tier: 'STUDIO' | 'REMOTE';
};

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not configured.');
  return s;
}

function signToken(user: AuthUser): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub:   user.id,
    email: user.email,
    role:  user.role,
    tier:  user.tier,
  };
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  });
}

// ─────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterBody(body: Record<string, unknown>): string | null {
  const { firstName, lastName, email, password } = body;
  if (!firstName || typeof firstName !== 'string' || !firstName.trim())
    return 'firstName is required.';
  if (!lastName || typeof lastName !== 'string' || !lastName.trim())
    return 'lastName is required.';
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email))
    return 'A valid email address is required.';
  if (!password || typeof password !== 'string' || password.length < 8)
    return 'Password must be at least 8 characters.';
  return null;
}

function validateLoginBody(body: Record<string, unknown>): string | null {
  const { email, password } = body;
  if (!email || typeof email !== 'string') return 'email is required.';
  if (!password || typeof password !== 'string') return 'password is required.';
  return null;
}

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────

/**
 * Creates a new user account, hashes the password, and returns a signed JWT.
 *
 * Body: { firstName, lastName, email, password, tier? }
 * Returns: { user, token }
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validationError = validateRegisterBody(req.body as Record<string, unknown>);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const {
      firstName,
      lastName,
      email,
      password,
      tier = 'REMOTE',
    } = req.body as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      tier?: 'STUDIO' | 'REMOTE';
    };

    // Reject unknown tier values
    if (tier !== 'STUDIO' && tier !== 'REMOTE') {
      res.status(400).json({ error: 'tier must be STUDIO or REMOTE.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.toLowerCase().trim(),
        passwordHash,
        tier,
        // Auto-create an empty profile on registration
        profile: { create: {} },
      },
      select: USER_SELECT,
    });

    const token = signToken(user as AuthUser);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────

/**
 * Validates credentials and returns a signed JWT.
 *
 * Body: { email, password }
 * Returns: { user, token }
 *
 * Deliberately uses a generic error message for both "user not found" and
 * "wrong password" to prevent user-enumeration attacks.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validationError = validateLoginBody(req.body as Record<string, unknown>);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Single generic message — never reveal whether the email exists
    const INVALID = 'Invalid email or password.';

    if (!user) {
      res.status(401).json({ error: INVALID });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ error: INVALID });
      return;
    }

    const token = signToken(user as AuthUser);

    res.json({
      user: {
        id:        user.id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
        tier:      user.tier,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────

/**
 * Returns the currently authenticated user with their profile.
 * Requires `authenticate` middleware.
 */
export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // req.user is guaranteed by the authenticate middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: { ...USER_SELECT, profile: true },
    });

    if (!user) {
      // Token was valid but the account was deleted after it was issued
      res.status(404).json({ error: 'User account no longer exists.' });
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

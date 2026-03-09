import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/register
 * Body: { firstName, lastName, email, password, tier? }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 */
router.get('/me', authenticate, me);

export default router;

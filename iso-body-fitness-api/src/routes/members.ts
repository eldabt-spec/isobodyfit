import { Router } from 'express';
import {
  listMembers,
  getMember,
  updateMember,
  deleteMember,
} from '../controllers/membersController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All members routes require a valid JWT
router.use(authenticate);

/**
 * GET /api/members
 * Admin only.
 * Returns a paginated list of all members with tier, latest assessment
 * status, active program, and aggregate stats.
 *
 * Query params:
 *   page    number  (default: 1)
 *   limit   number  (default: 20, max: 100)
 *   tier    STUDIO | REMOTE
 *   active  true | false
 */
router.get(
  '/',
  authorize('ADMIN'),
  listMembers,
);

/**
 * GET /api/members/:id
 * Admin OR own profile.
 * Returns full member detail: profile, all assessments, active program
 * with exercises, and last 5 workout logs.
 */
router.get(
  '/:id',
  getMember,
);

/**
 * PUT /api/members/:id
 * Admin OR own profile.
 * Updates user name fields and/or profile data (goals, injury history,
 * equipment access, contact info).
 *
 * Body (all fields optional):
 *   firstName       string
 *   lastName        string
 *   goals           string[]
 *   injuryHistory   string
 *   equipmentAccess string[]
 *   phone           string
 *   avatarUrl       string
 *   dateOfBirth     ISO date string  e.g. "1990-06-15"
 */
router.put(
  '/:id',
  updateMember,
);

/**
 * DELETE /api/members/:id
 * Admin only.
 * Soft-deletes the member by setting isActive = false.
 * Returns 204 No Content on success.
 * The account is preserved in the database; the user cannot log in.
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  deleteMember,
);

export default router;

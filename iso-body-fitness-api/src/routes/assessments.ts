import { Router } from 'express';
import {
  createAssessment,
  listAssessments,
  listPendingAssessments,
  getAssessment,
  modifyAssessment,
  approveAssessment,
  rejectAssessment,
  addMobilityResults,
} from '../controllers/assessmentsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All assessment routes require a valid JWT
router.use(authenticate);

/**
 * GET /api/assessments
 * ADMIN  → all assessments (full list)
 * CLIENT → own assessments only
 */
router.get('/', listAssessments);

/**
 * POST /api/assessments
 * CLIENT submits a new assessment request.
 *
 * Body:
 *   type              "IN_PERSON" | "SELF_GUIDED"   (required)
 *   mobilityResults?  MobilityResult[]               (optional initial results)
 */
router.post('/', createAssessment);

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: /pending MUST be registered before /:id so Express does not treat
// the literal string "pending" as a dynamic id segment.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/assessments/pending
 * ADMIN only.
 * Returns all assessments with status PENDING or MODIFIED,
 * ordered oldest-first (FIFO review queue), with client info,
 * mobility results, and any existing program draft.
 */
router.get('/pending', authorize('ADMIN'), listPendingAssessments);

/**
 * GET /api/assessments/:id
 * ADMIN → any assessment.
 * CLIENT → own assessment only (enforced in controller).
 */
router.get('/:id', getAssessment);

/**
 * PUT /api/assessments/:id/modify
 * ADMIN only.
 * Edit clinical data (inhibitedMuscles, romLimitations, asymmetries,
 * coachNotes, adminModNotes) and optionally build/replace the program
 * draft (blocks).  Assessment status is set to MODIFIED.
 *
 * Body (all optional):
 *   inhibitedMuscles  string[]
 *   romLimitations    string[]
 *   asymmetries       string[]
 *   coachNotes        string
 *   adminModNotes     string
 *   blocks            BlockInput[]
 */
router.put('/:id/modify', authorize('ADMIN'), modifyAssessment);

/**
 * PUT /api/assessments/:id/approve
 * ADMIN only.
 * Atomically:
 *   1. Sets assessment status → APPROVED
 *   2. Activates the draft program (or creates a new ACTIVE one from `blocks`)
 *   3. Sends a PROGRAM_ACTIVATED notification to the client
 *
 * Body (all optional):
 *   coachNotes  string
 *   blocks      BlockInput[]   (only if no program was built in /modify)
 */
router.put('/:id/approve', authorize('ADMIN'), approveAssessment);

/**
 * PUT /api/assessments/:id/reject
 * ADMIN only.
 * Sets assessment status → REJECTED and sends an
 * ASSESSMENT_REJECTED notification to the client.
 *
 * Body:
 *   adminModNotes  string  (required — reason for rejection)
 */
router.put('/:id/reject', authorize('ADMIN'), rejectAssessment);

/**
 * POST /api/assessments/:id/mobility
 * CLIENT adds self-guided mobility test results to an existing assessment.
 *
 * Body: MobilityResult[]
 *   testName    string
 *   bodyRegion  string
 *   result      "FULL" | "LIMITED" | "PAIN"
 *   userNotes?  string
 */
router.post('/:id/mobility', addMobilityResults);

export default router;

import { Router } from 'express';
import {
  createAssessment,
  listAssessments,
  getAssessment,
  reviewAssessment,
  addMobilityResults,
} from '../controllers/assessmentsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/',                              createAssessment);
router.get('/',                               listAssessments);
router.get('/:id',                            getAssessment);
router.patch('/:id/review',   authorize('ADMIN'), reviewAssessment);
router.post('/:id/mobility',                  addMobilityResults);

export default router;

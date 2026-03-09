import { Router } from 'express';
import { createWorkoutLog, listWorkoutLogs } from '../controllers/workoutLogsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createWorkoutLog);
router.get('/',  listWorkoutLogs);

export default router;

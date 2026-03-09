import { Router } from 'express';
import { listPrograms, createProgram, getProgram, activateProgram } from '../controllers/programsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/',                listPrograms);
router.post('/',               authorize('ADMIN'), createProgram);
router.get('/:id',             getProgram);
router.patch('/:id/activate',  authorize('ADMIN'), activateProgram);

export default router;

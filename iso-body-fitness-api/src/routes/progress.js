import { Router } from 'express';
import { logProgress, listProgress } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', logProgress);
router.get('/',  listProgress);

export default router;

import { Router } from 'express';
import { listUsers, getUser, updateProfile, signConsent } from '../controllers/usersController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/',                  authorize('ADMIN'), listUsers);
router.get('/:id',               getUser);
router.patch('/:id/profile',     updateProfile);
router.patch('/:id/consent',     signConsent);

export default router;

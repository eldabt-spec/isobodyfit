import { Router } from 'express';
import { listNotifications, markRead, markAllRead } from '../controllers/notificationsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/',                 listNotifications);
router.patch('/read-all',       markAllRead);
router.patch('/:id/read',       markRead);

export default router;

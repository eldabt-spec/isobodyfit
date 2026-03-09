import { Router } from 'express';
import {
  listPosts, createPost, deletePost,
  addComment, toggleLike,
} from '../controllers/communityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/',                listPosts);
router.post('/',               createPost);
router.delete('/:id',          deletePost);
router.post('/:id/comments',   addComment);
router.post('/:id/like',       toggleLike);

export default router;

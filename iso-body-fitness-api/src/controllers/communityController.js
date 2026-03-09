import { prisma } from '../lib/prisma.js';

const POST_INCLUDE = {
  user: { select: { id: true, firstName: true, lastName: true, avatarUrl: false } },
  _count: { select: { likes: true, comments: true } },
};

// GET /api/community  — paginated feed
export async function listPosts(req, res, next) {
  try {
    const page  = parseInt(req.query.page  ?? '1', 10);
    const limit = parseInt(req.query.limit ?? '20', 10);
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        include: POST_INCLUDE,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.communityPost.count(),
    ]);

    res.json({ data: posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

// POST /api/community
export async function createPost(req, res, next) {
  try {
    const { content, mediaUrl, postType } = req.body;

    if (!content) return res.status(400).json({ error: 'content is required.' });

    const post = await prisma.communityPost.create({
      data: {
        userId: req.user.sub,
        content,
        mediaUrl,
        postType: postType ?? 'MEMBER',
      },
      include: POST_INCLUDE,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/community/:id  — own post or ADMIN
export async function deletePost(req, res, next) {
  try {
    const post = await prisma.communityPost.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post.userId !== req.user.sub && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    await prisma.communityPost.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// POST /api/community/:id/comments
export async function addComment(req, res, next) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required.' });

    const comment = await prisma.comment.create({
      data: { postId: req.params.id, userId: req.user.sub, content },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

// POST /api/community/:id/like  — toggle like
export async function toggleLike(req, res, next) {
  try {
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId: req.params.id, userId: req.user.sub } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.json({ liked: false });
    }

    await prisma.like.create({ data: { postId: req.params.id, userId: req.user.sub } });
    res.json({ liked: true });
  } catch (err) {
    next(err);
  }
}

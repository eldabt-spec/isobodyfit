import { prisma } from '../lib/prisma.js';

// POST /api/progress
export async function logProgress(req, res, next) {
  try {
    const { notes, painLevel, energyLevel, date } = req.body;

    const log = await prisma.progressLog.create({
      data: {
        userId: req.user.sub,
        notes,
        painLevel,
        energyLevel,
        date: date ? new Date(date) : undefined,
      },
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
}

// GET /api/progress
export async function listProgress(req, res, next) {
  try {
    const where = req.user.role === 'CLIENT' ? { userId: req.user.sub } : {};

    const logs = await prisma.progressLog.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    res.json(logs);
  } catch (err) {
    next(err);
  }
}

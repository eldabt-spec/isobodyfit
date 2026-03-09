import { prisma } from '../lib/prisma.js';

// POST /api/workout-logs  — log a completed workout session
export async function createWorkoutLog(req, res, next) {
  try {
    const { programId, durationMin, notes, perceived_exertion, loggedSets } = req.body;

    if (!programId) {
      return res.status(400).json({ error: 'programId is required.' });
    }

    const log = await prisma.workoutLog.create({
      data: {
        userId: req.user.sub,
        programId,
        durationMin,
        notes,
        perceived_exertion,
        loggedSets: loggedSets?.length
          ? {
              create: loggedSets.map(s => ({
                exerciseId:   s.exerciseId,
                setNumber:    s.setNumber,
                repsCompleted: s.repsCompleted,
                weightLbs:    s.weightLbs,
                timeSeconds:  s.timeSeconds,
                notes:        s.notes,
              })),
            }
          : undefined,
      },
      include: { loggedSets: { include: { exercise: true } } },
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
}

// GET /api/workout-logs  — CLIENT sees own; ADMIN sees all
export async function listWorkoutLogs(req, res, next) {
  try {
    const where = req.user.role === 'CLIENT' ? { userId: req.user.sub } : {};

    const logs = await prisma.workoutLog.findMany({
      where,
      include: { loggedSets: { include: { exercise: true } } },
      orderBy: { completedAt: 'desc' },
    });

    res.json(logs);
  } catch (err) {
    next(err);
  }
}

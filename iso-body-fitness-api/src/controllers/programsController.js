import { prisma } from '../lib/prisma.js';

const PROGRAM_INCLUDE = {
  blocks: {
    orderBy: { orderIndex: 'asc' },
    include: {
      exercises: {
        orderBy: { orderIndex: 'asc' },
        include: { exercise: true },
      },
    },
  },
};

// GET /api/programs  — CLIENT sees own; ADMIN sees all
export async function listPrograms(req, res, next) {
  try {
    const where = req.user.role === 'CLIENT' ? { userId: req.user.sub } : {};

    const programs = await prisma.program.findMany({
      where,
      include: PROGRAM_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    res.json(programs);
  } catch (err) {
    next(err);
  }
}

// POST /api/programs  — ADMIN only: build a program from an approved assessment
export async function createProgram(req, res, next) {
  try {
    const { userId, assessmentId, blocks } = req.body;

    if (!userId || !assessmentId) {
      return res.status(400).json({ error: 'userId and assessmentId are required.' });
    }

    const program = await prisma.program.create({
      data: {
        userId,
        assessmentId,
        blocks: blocks?.length
          ? {
              create: blocks.map((block, bi) => ({
                blockType: block.blockType,
                orderIndex: bi,
                exercises: {
                  create: block.exercises.map((ex, ei) => ({
                    exerciseId:      ex.exerciseId,
                    sets:            ex.sets,
                    reps:            ex.reps,
                    timeUnderTension: ex.timeUnderTension,
                    restSeconds:     ex.restSeconds,
                    coachingNotes:   ex.coachingNotes,
                    progressionNote: ex.progressionNote,
                    orderIndex:      ei,
                  })),
                },
              })),
            }
          : undefined,
      },
      include: PROGRAM_INCLUDE,
    });

    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
}

// GET /api/programs/:id
export async function getProgram(req, res, next) {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: PROGRAM_INCLUDE,
    });

    if (!program) return res.status(404).json({ error: 'Program not found.' });
    res.json(program);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/programs/:id/activate  — ADMIN activates a program
export async function activateProgram(req, res, next) {
  try {
    const program = await prisma.program.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE', activatedAt: new Date() },
    });
    res.json(program);
  } catch (err) {
    next(err);
  }
}

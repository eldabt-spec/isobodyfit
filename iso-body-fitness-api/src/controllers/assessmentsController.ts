import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { param } from '../utils/request.js';

// ─────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────

interface ExerciseInput {
  exerciseId:       string;
  sets?:            number;
  reps?:            number;
  timeUnderTension?: number;
  restSeconds?:     number;
  coachingNotes?:   string;
  progressionNote?: string;
}

interface BlockInput {
  blockType:  string;   // ACTIVATION | INTEGRATION | STRENGTH | CONDITIONING
  exercises:  ExerciseInput[];
}

/** Valid statuses an assessment may be in before admin action. */
const ACTIONABLE_STATUSES = ['PENDING', 'MODIFIED'] as const;

// ─────────────────────────────────────────
// Notification helper
// ─────────────────────────────────────────

async function notify(
  tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  userId:  string,
  type:    string,
  message: string,
  link?:   string,
) {
  return tx.notification.create({
    data: { userId, type, message, link, isRead: false },
  });
}

// ─────────────────────────────────────────
// POST /api/assessments
// Client submits a new assessment request
// ─────────────────────────────────────────

export async function createAssessment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { type, mobilityResults } = req.body as {
      type: string;
      mobilityResults?: {
        testName: string;
        bodyRegion: string;
        result: 'FULL' | 'LIMITED' | 'PAIN';
        userNotes?: string;
      }[];
    };

    if (!type || !['IN_PERSON', 'SELF_GUIDED'].includes(type)) {
      res.status(400).json({ error: 'type is required: IN_PERSON or SELF_GUIDED.' });
      return;
    }

    const assessment = await prisma.assessment.create({
      data: {
        userId: req.user!.sub,
        type:   type as 'IN_PERSON' | 'SELF_GUIDED',
        mobilityResults: mobilityResults?.length
          ? { create: mobilityResults }
          : undefined,
      },
      include: { mobilityResults: true },
    });

    res.status(201).json(assessment);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// GET /api/assessments
// ADMIN sees all; CLIENT sees own
// ─────────────────────────────────────────

export async function listAssessments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const where = req.user!.role === 'CLIENT' ? { userId: req.user!.sub } : {};

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        user:            { select: { id: true, firstName: true, lastName: true, email: true, tier: true } },
        mobilityResults: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(assessments);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// GET /api/assessments/pending
// ADMIN only — all assessments awaiting review, oldest first
// ─────────────────────────────────────────

export async function listPendingAssessments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        status: { in: ['PENDING', 'MODIFIED'] },
      },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true,
            email: true, tier: true, createdAt: true,
          },
        },
        mobilityResults: true,
        // Include any program draft the admin started
        program: {
          select: {
            id: true, status: true, weekNumber: true,
            blocks: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true, blockType: true, orderIndex: true,
                exercises: {
                  orderBy: { orderIndex: 'asc' },
                  select: {
                    id: true, sets: true, reps: true,
                    coachingNotes: true, orderIndex: true,
                    exercise: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
        _count: { select: { mobilityResults: true } },
      },
      orderBy: { createdAt: 'asc' }, // oldest pending reviews first
    });

    res.json({
      count: assessments.length,
      data:  assessments,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// GET /api/assessments/:id
// ─────────────────────────────────────────

export async function getAssessment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Assessment id is required.' });
      return;
    }

    const assessment = await prisma.assessment.findUnique({
      where:   { id },
      include: { mobilityResults: true, program: true },
    });

    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found.' });
      return;
    }

    // Clients may only view their own
    if (req.user!.role === 'CLIENT' && assessment.userId !== req.user!.sub) {
      res.status(403).json({ error: 'Access denied.' });
      return;
    }

    res.json(assessment);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// PUT /api/assessments/:id/modify
// ADMIN only — edit clinical data + build/update program draft before approval
//
// Body (all optional):
//   inhibitedMuscles  string[]
//   romLimitations    string[]
//   asymmetries       string[]
//   coachNotes        string
//   adminModNotes     string
//   blocks            BlockInput[]   → upserts a draft INACTIVE program
// ─────────────────────────────────────────

export async function modifyAssessment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Assessment id is required.' });
      return;
    }

    const existing = await prisma.assessment.findUnique({
      where:   { id },
      include: { program: { select: { id: true } } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Assessment not found.' });
      return;
    }

    if (!ACTIONABLE_STATUSES.includes(existing.status as typeof ACTIONABLE_STATUSES[number])) {
      res.status(409).json({
        error: `Assessment cannot be modified in its current status: ${existing.status}. Only PENDING or MODIFIED assessments can be edited.`,
      });
      return;
    }

    const {
      inhibitedMuscles, romLimitations, asymmetries,
      coachNotes, adminModNotes, blocks,
    } = req.body as {
      inhibitedMuscles?: string[];
      romLimitations?:   string[];
      asymmetries?:      string[];
      coachNotes?:       string;
      adminModNotes?:    string;
      blocks?:           BlockInput[];
    };

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update assessment clinical data → mark as MODIFIED
      const updated = await tx.assessment.update({
        where: { id },
        data: {
          status:            'MODIFIED',
          reviewedByAdminId: req.user!.sub,
          reviewedAt:        new Date(),
          ...(inhibitedMuscles !== undefined && { inhibitedMuscles }),
          ...(romLimitations   !== undefined && { romLimitations }),
          ...(asymmetries      !== undefined && { asymmetries }),
          ...(coachNotes       !== undefined && { coachNotes }),
          ...(adminModNotes    !== undefined && { adminModNotes }),
        },
        include: { mobilityResults: true },
      });

      // 2. If blocks provided, upsert the draft program (stays INACTIVE)
      let program = null;

      if (blocks !== undefined) {
        if (existing.program) {
          // Replace all existing blocks (cascade deletes exercises)
          await tx.programBlock.deleteMany({
            where: { programId: existing.program.id },
          });

          program = await tx.program.update({
            where: { id: existing.program.id },
            data:  {
              blocks: {
                create: blocks.map((b, bi) => ({
                  blockType:  b.blockType,
                  orderIndex: bi,
                  exercises: {
                    create: b.exercises.map((e, ei) => ({
                      exerciseId:       e.exerciseId,
                      sets:             e.sets,
                      reps:             e.reps,
                      timeUnderTension: e.timeUnderTension,
                      restSeconds:      e.restSeconds,
                      coachingNotes:    e.coachingNotes,
                      progressionNote:  e.progressionNote,
                      orderIndex:       ei,
                    })),
                  },
                })),
              },
            },
            include: { blocks: { include: { exercises: true } } },
          });
        } else {
          // Create a fresh INACTIVE draft program
          program = await tx.program.create({
            data: {
              userId:       existing.userId,
              assessmentId: id,
              status:       'INACTIVE',
              blocks: {
                create: blocks.map((b, bi) => ({
                  blockType:  b.blockType,
                  orderIndex: bi,
                  exercises: {
                    create: b.exercises.map((e, ei) => ({
                      exerciseId:       e.exerciseId,
                      sets:             e.sets,
                      reps:             e.reps,
                      timeUnderTension: e.timeUnderTension,
                      restSeconds:      e.restSeconds,
                      coachingNotes:    e.coachingNotes,
                      progressionNote:  e.progressionNote,
                      orderIndex:       ei,
                    })),
                  },
                })),
              },
            },
            include: { blocks: { include: { exercises: true } } },
          });
        }
      }

      return { assessment: updated, program };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// PUT /api/assessments/:id/approve
// ADMIN only — approve assessment, activate program, and notify client
//
// Body (all optional):
//   coachNotes  string    → final notes visible to client
//   blocks      BlockInput[]  → provide here if not built in /modify
// ─────────────────────────────────────────

export async function approveAssessment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Assessment id is required.' });
      return;
    }

    const existing = await prisma.assessment.findUnique({
      where:   { id },
      include: { program: { select: { id: true, status: true } } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Assessment not found.' });
      return;
    }

    if (!ACTIONABLE_STATUSES.includes(existing.status as typeof ACTIONABLE_STATUSES[number])) {
      res.status(409).json({
        error: `Assessment cannot be approved in its current status: ${existing.status}. Only PENDING or MODIFIED assessments can be approved.`,
      });
      return;
    }

    const { coachNotes, blocks } = req.body as {
      coachNotes?: string;
      blocks?:     BlockInput[];
    };

    // Everything in one atomic transaction:
    //  1. Mark assessment APPROVED
    //  2. Activate existing program OR create new one with provided blocks
    //  3. Fire PROGRAM_ACTIVATED notification to the client
    const result = await prisma.$transaction(async (tx) => {
      // ── Step 1: Approve the assessment ────────────────────────────────
      const assessment = await tx.assessment.update({
        where: { id },
        data:  {
          status:            'APPROVED',
          reviewedByAdminId: req.user!.sub,
          reviewedAt:        new Date(),
          ...(coachNotes !== undefined && { coachNotes }),
        },
      });

      // ── Step 2: Activate or create the program ────────────────────────
      let program;

      if (existing.program) {
        // Program was built during /modify — just flip it to ACTIVE
        program = await tx.program.update({
          where: { id: existing.program.id },
          data:  { status: 'ACTIVE', activatedAt: new Date() },
          include: {
            blocks: {
              orderBy: { orderIndex: 'asc' },
              include: {
                exercises: {
                  orderBy: { orderIndex: 'asc' },
                  include: { exercise: { select: { id: true, name: true, videoUrl: true } } },
                },
              },
            },
          },
        });
      } else {
        // No draft exists — create the program as ACTIVE immediately
        // (blocks can be passed in the approve body, or left empty for later)
        program = await tx.program.create({
          data: {
            userId:       existing.userId,
            assessmentId: id,
            status:       'ACTIVE',
            activatedAt:  new Date(),
            blocks: blocks?.length
              ? {
                  create: blocks.map((b, bi) => ({
                    blockType:  b.blockType,
                    orderIndex: bi,
                    exercises: {
                      create: b.exercises.map((e, ei) => ({
                        exerciseId:       e.exerciseId,
                        sets:             e.sets,
                        reps:             e.reps,
                        timeUnderTension: e.timeUnderTension,
                        restSeconds:      e.restSeconds,
                        coachingNotes:    e.coachingNotes,
                        progressionNote:  e.progressionNote,
                        orderIndex:       ei,
                      })),
                    },
                  })),
                }
              : undefined,
          },
          include: {
            blocks: {
              orderBy: { orderIndex: 'asc' },
              include: {
                exercises: {
                  orderBy: { orderIndex: 'asc' },
                  include: { exercise: { select: { id: true, name: true, videoUrl: true } } },
                },
              },
            },
          },
        });
      }

      // ── Step 3: Notify the client ──────────────────────────────────────
      const notification = await notify(
        tx,
        existing.userId,
        'PROGRAM_ACTIVATED',
        'Your assessment has been reviewed and your program is now active. Head to the Programs tab to get started.',
        `/programs/${program.id}`,
      );

      return { assessment, program, notification };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// PUT /api/assessments/:id/reject
// ADMIN only — reject with a reason; notifies the client
//
// Body:
//   adminModNotes  string  (required — reason for rejection)
// ─────────────────────────────────────────

export async function rejectAssessment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Assessment id is required.' });
      return;
    }

    const { adminModNotes } = req.body as { adminModNotes?: string };

    if (!adminModNotes?.trim()) {
      res.status(400).json({ error: 'adminModNotes (rejection reason) is required.' });
      return;
    }

    const existing = await prisma.assessment.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Assessment not found.' });
      return;
    }

    if (!ACTIONABLE_STATUSES.includes(existing.status as typeof ACTIONABLE_STATUSES[number])) {
      res.status(409).json({
        error: `Assessment cannot be rejected in its current status: ${existing.status}.`,
      });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.update({
        where: { id },
        data: {
          status:            'REJECTED',
          reviewedByAdminId: req.user!.sub,
          reviewedAt:        new Date(),
          adminModNotes:     adminModNotes.trim(),
        },
      });

      const notification = await notify(
        tx,
        existing.userId,
        'ASSESSMENT_REJECTED',
        'Your assessment submission needs some changes. Please review the coach\'s notes and resubmit.',
        '/assessments',
      );

      return { assessment, notification };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// POST /api/assessments/:id/mobility
// Client adds self-guided mobility test results
// ─────────────────────────────────────────

export async function addMobilityResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Assessment id is required.' });
      return;
    }

    const results = req.body as {
      testName:   string;
      bodyRegion: string;
      result:     'FULL' | 'LIMITED' | 'PAIN';
      userNotes?: string;
    }[];

    if (!Array.isArray(results) || results.length === 0) {
      res.status(400).json({ error: 'Body must be a non-empty array of mobility results.' });
      return;
    }

    const created = await prisma.mobilityResult.createMany({
      data: results.map((r) => ({ ...r, assessmentId: id })),
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

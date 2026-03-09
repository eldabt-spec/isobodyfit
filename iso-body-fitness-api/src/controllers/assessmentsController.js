import { prisma } from '../lib/prisma.js';

// POST /api/assessments  — client submits a new assessment request
export async function createAssessment(req, res, next) {
  try {
    const { type, mobilityResults } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'type is required (IN_PERSON or SELF_GUIDED).' });
    }

    const assessment = await prisma.assessment.create({
      data: {
        userId: req.user.sub,
        type,
        // For SELF_GUIDED: optionally seed mobility results in same request
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

// GET /api/assessments  — ADMIN sees all; CLIENT sees own
export async function listAssessments(req, res, next) {
  try {
    const where = req.user.role === 'CLIENT' ? { userId: req.user.sub } : {};

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, tier: true } },
        mobilityResults: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(assessments);
  } catch (err) {
    next(err);
  }
}

// GET /api/assessments/:id
export async function getAssessment(req, res, next) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id },
      include: { mobilityResults: true, program: true },
    });
    if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });
    res.json(assessment);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/assessments/:id/review  — ADMIN reviews and updates an assessment
export async function reviewAssessment(req, res, next) {
  try {
    const {
      status, coachNotes, adminModNotes,
      inhibitedMuscles, romLimitations, asymmetries,
    } = req.body;

    const assessment = await prisma.assessment.update({
      where: { id: req.params.id },
      data: {
        status,
        coachNotes,
        adminModNotes,
        inhibitedMuscles: inhibitedMuscles ?? [],
        romLimitations:   romLimitations   ?? [],
        asymmetries:      asymmetries      ?? [],
        reviewedByAdminId: req.user.sub,
        reviewedAt: new Date(),
      },
    });

    res.json(assessment);
  } catch (err) {
    next(err);
  }
}

// POST /api/assessments/:id/mobility  — CLIENT adds mobility test results
export async function addMobilityResults(req, res, next) {
  try {
    const results = req.body; // array of { testName, bodyRegion, result, userNotes }

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'Body must be an array of mobility results.' });
    }

    const created = await prisma.mobilityResult.createMany({
      data: results.map(r => ({ ...r, assessmentId: req.params.id })),
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

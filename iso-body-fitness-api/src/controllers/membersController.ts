import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { param, queryStr as query } from '../utils/request.js';

// ─────────────────────────────────────────
// Access guard
// ─────────────────────────────────────────

/**
 * Returns true if the requester is ADMIN, or if they are accessing
 * their own record.  Enforces "admin OR own profile" access.
 */
function canAccess(req: Request, targetId: string): boolean {
  return req.user?.role === 'ADMIN' || req.user?.sub === targetId;
}

/** Shared lightweight user fields used in list responses. */
const MEMBER_LIST_SELECT = {
  id:        true,
  firstName: true,
  lastName:  true,
  email:     true,
  role:      true,
  tier:      true,
  isActive:  true,
  createdAt: true,
} as const;

// ─────────────────────────────────────────
// GET /api/members
// Admin only — paginated list of all members with tier + latest assessment status
// ─────────────────────────────────────────

export async function listMembers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page  = Math.max(1, parseInt(query(req.query['page'])  ?? '1',  10));
    const limit = Math.min(100, Math.max(1, parseInt(query(req.query['limit']) ?? '20', 10)));
    const skip  = (page - 1) * limit;

    // Optional filters
    const tierFilter   = query(req.query['tier']);
    const activeFilter = query(req.query['active']);

    const where = {
      ...(tierFilter   ? { tier:     tierFilter as 'STUDIO' | 'REMOTE' } : {}),
      ...(activeFilter !== undefined ? { isActive: activeFilter !== 'false' } : {}),
    };

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          ...MEMBER_LIST_SELECT,
          // Latest assessment — one record, most recent
          assessments: {
            orderBy: { createdAt: 'desc' },
            take:    1,
            select:  { id: true, type: true, status: true, createdAt: true },
          },
          // Active program indicator
          programs: {
            where:  { status: 'ACTIVE' },
            take:   1,
            select: { id: true, status: true, weekNumber: true },
          },
          _count: {
            select: { assessments: true, workoutLogs: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Flatten for a cleaner API response
    const data = members.map((m) => ({
      id:               m.id,
      firstName:        m.firstName,
      lastName:         m.lastName,
      email:            m.email,
      role:             m.role,
      tier:             m.tier,
      isActive:         m.isActive,
      createdAt:        m.createdAt,
      latestAssessment: m.assessments[0] ?? null,
      activeProgram:    m.programs[0]    ?? null,
      stats: {
        totalAssessments: m._count.assessments,
        totalWorkouts:    m._count.workoutLogs,
      },
    }));

    res.json({
      data,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// GET /api/members/:id
// Admin OR own profile — full detail view
// ─────────────────────────────────────────

export async function getMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Member id is required.' });
      return;
    }

    if (!canAccess(req, id)) {
      res.status(403).json({ error: 'Access denied. You can only view your own profile.' });
      return;
    }

    const member = await prisma.user.findUnique({
      where: { id },
      select: {
        ...MEMBER_LIST_SELECT,
        profile: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id:               true,
            type:             true,
            status:           true,
            inhibitedMuscles: true,
            romLimitations:   true,
            asymmetries:      true,
            coachNotes:       true,
            adminModNotes:    true,
            reviewedAt:       true,
            createdAt:        true,
          },
        },
        programs: {
          where:  { status: 'ACTIVE' },
          take:   1,
          select: {
            id:          true,
            status:      true,
            weekNumber:  true,
            activatedAt: true,
            blocks: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id:         true,
                blockType:  true,
                orderIndex: true,
                exercises: {
                  orderBy: { orderIndex: 'asc' },
                  select: {
                    id:         true,
                    sets:       true,
                    reps:       true,
                    orderIndex: true,
                    exercise: {
                      select: { id: true, name: true, videoUrl: true, thumbnailUrl: true },
                    },
                  },
                },
              },
            },
          },
        },
        workoutLogs: {
          orderBy: { completedAt: 'desc' },
          take:    5,
          select: {
            id:                 true,
            completedAt:        true,
            durationMin:        true,
            perceived_exertion: true,
            notes:              true,
          },
        },
        _count: {
          select: { assessments: true, workoutLogs: true },
        },
      },
    });

    if (!member) {
      res.status(404).json({ error: 'Member not found.' });
      return;
    }

    res.json(member);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// PUT /api/members/:id
// Admin OR own profile — update name fields and/or profile
// ─────────────────────────────────────────

interface UpdateMemberBody {
  firstName?:       string;
  lastName?:        string;
  goals?:           string[];
  injuryHistory?:   string;
  equipmentAccess?: string[];
  phone?:           string;
  avatarUrl?:       string;
  dateOfBirth?:     string;
}

function validateUpdateBody(body: UpdateMemberBody): string | null {
  if (body.firstName !== undefined) {
    if (typeof body.firstName !== 'string' || !body.firstName.trim())
      return 'firstName must be a non-empty string.';
  }
  if (body.lastName !== undefined) {
    if (typeof body.lastName !== 'string' || !body.lastName.trim())
      return 'lastName must be a non-empty string.';
  }
  if (body.goals !== undefined) {
    if (!Array.isArray(body.goals) || body.goals.some((g) => typeof g !== 'string'))
      return 'goals must be an array of strings.';
  }
  if (body.equipmentAccess !== undefined) {
    if (!Array.isArray(body.equipmentAccess) || body.equipmentAccess.some((e) => typeof e !== 'string'))
      return 'equipmentAccess must be an array of strings.';
  }
  if (body.dateOfBirth !== undefined) {
    const d = new Date(body.dateOfBirth);
    if (isNaN(d.getTime())) return 'dateOfBirth must be a valid ISO date string (e.g. "1990-06-15").';
    if (d > new Date())      return 'dateOfBirth cannot be in the future.';
  }
  return null;
}

export async function updateMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Member id is required.' });
      return;
    }

    if (!canAccess(req, id)) {
      res.status(403).json({ error: 'Access denied. You can only update your own profile.' });
      return;
    }

    const body = req.body as UpdateMemberBody;
    const validationError = validateUpdateBody(body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const { firstName, lastName, goals, injuryHistory, equipmentAccess, phone, avatarUrl, dateOfBirth } = body;

    // Only include fields that were actually provided
    const userUpdate: Record<string, unknown> = {};
    if (firstName !== undefined) userUpdate['firstName'] = firstName.trim();
    if (lastName  !== undefined) userUpdate['lastName']  = lastName.trim();

    const profileUpdate: Record<string, unknown> = {};
    if (goals           !== undefined) profileUpdate['goals']           = goals;
    if (injuryHistory   !== undefined) profileUpdate['injuryHistory']   = injuryHistory;
    if (equipmentAccess !== undefined) profileUpdate['equipmentAccess'] = equipmentAccess;
    if (phone           !== undefined) profileUpdate['phone']           = phone;
    if (avatarUrl       !== undefined) profileUpdate['avatarUrl']       = avatarUrl;
    if (dateOfBirth     !== undefined) profileUpdate['dateOfBirth']     = new Date(dateOfBirth);

    // Atomically update user + upsert profile
    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data:  Object.keys(userUpdate).length ? userUpdate : {},
      }),
      prisma.profile.upsert({
        where:  { userId: id },
        update: profileUpdate,
        create: { userId: id, ...profileUpdate },
      }),
    ]);

    // Return the fresh record with profile
    const updated = await prisma.user.findUnique({
      where:  { id },
      select: { ...MEMBER_LIST_SELECT, profile: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────
// DELETE /api/members/:id
// Admin only — soft delete (sets isActive = false)
// ─────────────────────────────────────────

export async function deleteMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = param(req.params['id']);

    if (!id) {
      res.status(400).json({ error: 'Member id is required.' });
      return;
    }

    // Prevent an admin from deactivating themselves
    if (req.user?.sub === id) {
      res.status(400).json({ error: 'You cannot deactivate your own account.' });
      return;
    }

    const existing = await prisma.user.findUnique({
      where:  { id },
      select: { id: true, isActive: true },
    });

    if (!existing) {
      res.status(404).json({ error: 'Member not found.' });
      return;
    }

    if (!existing.isActive) {
      res.status(409).json({ error: 'Member account is already inactive.' });
      return;
    }

    await prisma.user.update({
      where: { id },
      data:  { isActive: false },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

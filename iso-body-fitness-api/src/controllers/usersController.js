import { prisma } from '../lib/prisma.js';

const USER_SELECT = {
  id: true, firstName: true, lastName: true,
  email: true, role: true, tier: true, isActive: true, createdAt: true,
};

// GET /api/users  (ADMIN only)
export async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id
export async function getUser(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { ...USER_SELECT, profile: true, assessments: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/:id/profile
export async function updateProfile(req, res, next) {
  try {
    const { goals, injuryHistory, equipmentAccess, phone, avatarUrl, dateOfBirth } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.params.id },
      update: { goals, injuryHistory, equipmentAccess, phone, avatarUrl, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined },
      create: { userId: req.params.id, goals, injuryHistory, equipmentAccess, phone, avatarUrl, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined },
    });

    res.json(profile);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/:id/consent  — sign consent form
export async function signConsent(req, res, next) {
  try {
    const profile = await prisma.profile.upsert({
      where: { userId: req.params.id },
      update: { consentSigned: true, consentSignedAt: new Date() },
      create: { userId: req.params.id, consentSigned: true, consentSignedAt: new Date() },
    });
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

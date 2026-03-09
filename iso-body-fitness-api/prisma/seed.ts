import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ─────────────────────────────────────────
// Users
// ─────────────────────────────────────────
const users = [
  {
    firstName: 'Alex',
    lastName:  'Coach',
    email:     'admin@isobody.com',
    password:  'Admin1234!',
    role:      'ADMIN'  as const,
    tier:      'STUDIO' as const,
  },
  {
    firstName: 'Jordan',
    lastName:  'Rivera',
    email:     'jordan@example.com',
    password:  'Client1234!',
    role:      'CLIENT' as const,
    tier:      'STUDIO' as const,
  },
  {
    firstName: 'Casey',
    lastName:  'Morgan',
    email:     'casey@example.com',
    password:  'Client1234!',
    role:      'CLIENT' as const,
    tier:      'REMOTE' as const,
  },
];

// ─────────────────────────────────────────
// Exercises
// ─────────────────────────────────────────
const exercises = [
  {
    name:         'Hip Flexor Palpation & Activation',
    description:  'Targeted palpation of the psoas and iliacus to re-establish neuromuscular connection before loading.',
    muscleGroups: ['Hip Flexors', 'Psoas', 'Iliacus'],
    equipment:    ['Treatment Table', 'None'],
    videoUrl:     'https://videos.isobody.com/exercises/hip-flexor-activation.mp4',
    thumbnailUrl: 'https://videos.isobody.com/thumbnails/hip-flexor-activation.jpg',
  },
  {
    name:         'Supine Glute Max Isometric',
    description:  'Isolated glute max contraction in a supine position to activate inhibited posterior chain muscles without compensatory patterns.',
    muscleGroups: ['Glute Max', 'Posterior Chain'],
    equipment:    ['Mat'],
    videoUrl:     'https://videos.isobody.com/exercises/supine-glute-isometric.mp4',
    thumbnailUrl: 'https://videos.isobody.com/thumbnails/supine-glute-isometric.jpg',
  },
  {
    name:         'Single-Leg Romanian Deadlift',
    description:  'Unilateral hip hinge pattern targeting hamstring strength and balance. Emphasis on maintaining a neutral spine and full hip ROM.',
    muscleGroups: ['Hamstrings', 'Glute Max', 'Erector Spinae'],
    equipment:    ['Dumbbell', 'Kettlebell'],
    videoUrl:     'https://videos.isobody.com/exercises/sl-romanian-deadlift.mp4',
    thumbnailUrl: 'https://videos.isobody.com/thumbnails/sl-romanian-deadlift.jpg',
  },
  {
    name:         'Quadruped Shoulder Tap',
    description:  'Anti-rotation core stability drill performed on hands and knees. Develops shoulder and scapular stability while resisting rotational forces.',
    muscleGroups: ['Core', 'Serratus Anterior', 'Rotator Cuff'],
    equipment:    ['Mat'],
    videoUrl:     'https://videos.isobody.com/exercises/quadruped-shoulder-tap.mp4',
    thumbnailUrl: 'https://videos.isobody.com/thumbnails/quadruped-shoulder-tap.jpg',
  },
  {
    name:         'Half-Kneeling Pallof Press',
    description:  'Anti-rotation press from a half-kneeling position. Integrates hip stability with core anti-rotation, ideal for the Integration block.',
    muscleGroups: ['Core', 'Obliques', 'Hip Stabilizers'],
    equipment:    ['Cable Machine', 'Resistance Band'],
    videoUrl:     'https://videos.isobody.com/exercises/half-kneeling-pallof-press.mp4',
    thumbnailUrl: 'https://videos.isobody.com/thumbnails/half-kneeling-pallof-press.jpg',
  },
];

// ─────────────────────────────────────────
// Main
// ─────────────────────────────────────────
async function main() {
  console.log('🌱  Starting seed...\n');

  // ── Exercises ──────────────────────────
  console.log('📦  Seeding exercises...');
  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where:  { name: ex.name },
      update: ex,
      create: ex,
    });
    console.log(`   ✓ ${ex.name}`);
  }

  // ── Users ──────────────────────────────
  console.log('\n👤  Seeding users...');
  for (const u of users) {
    const passwordHash = await hash(u.password);
    const user = await prisma.user.upsert({
      where:  { email: u.email },
      update: { firstName: u.firstName, lastName: u.lastName, role: u.role, tier: u.tier },
      create: {
        firstName:    u.firstName,
        lastName:     u.lastName,
        email:        u.email,
        passwordHash,
        role:         u.role,
        tier:         u.tier,
        profile: {
          create: {
            goals:           u.role === 'ADMIN' ? [] : ['Strength', 'Mobility'],
            equipmentAccess: u.tier === 'STUDIO'
              ? ['Full Gym', 'Treatment Table']
              : ['Dumbbells', 'Resistance Bands', 'Mat'],
            consentSigned:   u.role !== 'ADMIN',
            consentSignedAt: u.role !== 'ADMIN' ? new Date() : null,
          },
        },
      },
    });
    console.log(`   ✓ ${user.firstName} ${user.lastName} <${user.email}> [${user.role} / ${user.tier}]`);
  }

  console.log('\n✅  Seed complete.\n');
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

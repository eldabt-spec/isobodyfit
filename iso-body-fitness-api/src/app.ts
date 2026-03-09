/**
 * src/app.ts
 *
 * Express application factory — all middleware and routes are configured here.
 * This module intentionally does NOT call app.listen() so it can be imported
 * by both the local dev server (src/server.ts) and the Netlify serverless
 * function (netlify/functions/api.js) without binding to a port.
 */

import 'dotenv/config';
import express from 'express';
import authRoutes         from './routes/auth.js';
import memberRoutes       from './routes/members.js';
import userRoutes         from './routes/users.js';
import assessmentRoutes   from './routes/assessments.js';
import programRoutes      from './routes/programs.js';
import workoutLogRoutes   from './routes/workoutLogs.js';
import communityRoutes    from './routes/community.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler }   from './middleware/errorHandler.js';
import { notFound }       from './middleware/notFound.js';

const app = express();

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/members',       memberRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/assessments',   assessmentRoutes);
app.use('/api/programs',      programRoutes);
app.use('/api/workout-logs',  workoutLogRoutes);
app.use('/api/community',     communityRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Error handling (must be last) ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;

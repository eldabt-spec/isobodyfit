import 'dotenv/config';
import express from 'express';
import authRoutes         from './routes/auth.js';
import userRoutes         from './routes/users.js';
import assessmentRoutes   from './routes/assessments.js';
import programRoutes      from './routes/programs.js';
import workoutLogRoutes   from './routes/workoutLogs.js';
import communityRoutes    from './routes/community.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler }   from './middleware/errorHandler.js';
import { notFound }       from './middleware/notFound.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Body parsing ──────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/assessments',   assessmentRoutes);
app.use('/api/programs',      programRoutes);
app.use('/api/workout-logs',  workoutLogRoutes);
app.use('/api/community',     communityRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Error handling ────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀  Iso-Body API running on http://localhost:${PORT}`);
});

export default app;

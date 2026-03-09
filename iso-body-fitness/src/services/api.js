/**
 * src/services/api.js
 *
 * Centralised Axios service layer for the Iso-Body Fitness API.
 *
 * Security note on token storage
 * ───────────────────────────────
 * The JWT is kept in a plain module-level variable (_token) instead of
 * localStorage or sessionStorage.  This means the token:
 *   • Cannot be read by third-party scripts (XSS mitigation)
 *   • Is automatically cleared when the browser tab closes
 *   • Survives React re-renders because JS modules are singletons per tab
 *
 * The trade-off is that a full-page refresh logs the user out — a login
 * page / persisted-session strategy can be added later if required.
 */

import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// In-memory session store
// ─────────────────────────────────────────────────────────────────────────────

let _token  = null;   // JWT string
let _userId = null;   // Logged-in user's database id (cuid)

/** Store the JWT returned after login / register. */
export function setToken(token)  { _token  = token; }

/** Retrieve the current in-memory JWT (null if not authenticated). */
export function getToken()       { return _token; }

/** Store the logged-in user's id for subsequent member-level requests. */
export function setUserId(id)    { _userId = id; }

/** Retrieve the current in-memory user id. */
export function getUserId()      { return _userId; }

/**
 * Clear the in-memory session.
 * Call this on logout or after receiving a 401 response.
 */
export function clearSession()   { _token = null; _userId = null; }

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  // Falls back to localhost so the app works with zero configuration locally
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,   // 10 s — prevent silent hangs on a slow / offline API
});

// ── Request interceptor: attach Bearer token ──────────────────────────────────
api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

// ── Response interceptor: normalize errors ────────────────────────────────────
// Unwraps the { error: "..." } envelope the API sends on 4xx/5xx so callers
// always get a plain Error with a human-readable message.
api.interceptors.response.use(
  (response) => response,
  (err) => {
    // Auto-clear session on 401 so stale tokens don't persist
    if (err.response?.status === 401) {
      clearSession();
    }

    const message =
      err.response?.data?.error   ??
      err.response?.data?.message ??
      err.message                 ??
      'An unexpected error occurred.';

    return Promise.reject(new Error(message));
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// ── AUTH ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new client account and store the returned JWT in memory.
 *
 * @param {{ firstName: string, lastName: string, email: string, password: string }} body
 * @returns {{ user: object, token: string }}
 *
 * @example
 * const { user } = await registerUser({
 *   firstName: 'Jane', lastName: 'Smith',
 *   email: 'jane@example.com', password: 'securepass',
 * });
 */
export async function registerUser({ firstName, lastName, email, password }) {
  const { data } = await api.post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
  });

  // Persist session in memory for the lifetime of this tab
  setToken(data.token);
  setUserId(data.user.id);

  return data;   // { user, token }
}

/**
 * Authenticate with email + password and store the returned JWT in memory.
 *
 * @param {{ email: string, password: string }} body
 * @returns {{ user: object, token: string }}
 *
 * @example
 * const { user } = await loginUser({ email: 'jane@example.com', password: 'securepass' });
 */
export async function loginUser({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });

  setToken(data.token);
  setUserId(data.user.id);

  return data;   // { user, token }
}

/**
 * Fetch the authenticated user's own record.
 * Requires a valid in-memory token (call loginUser / registerUser first).
 *
 * @returns {object} user — { id, firstName, lastName, email, role, tier, isActive }
 */
export async function getProfile() {
  const { data } = await api.get('/auth/me');
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ASSESSMENTS ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map from the AssessmentModal UI values to the API enum values.
 * UI:  'studio'  → API: 'IN_PERSON'
 * UI:  'remote'  → API: 'SELF_GUIDED'
 * Anything else is passed through as-is (future-proofing).
 */
const ASSESSMENT_TYPE_MAP = {
  studio: 'IN_PERSON',
  remote: 'SELF_GUIDED',
};

/**
 * Submit a new assessment request.
 *
 * Accepts either the UI shorthand values ('studio', 'remote') from
 * AssessmentModal or the API enum values ('IN_PERSON', 'SELF_GUIDED')
 * directly.
 *
 * @param {{
 *   type:             'studio' | 'remote' | 'IN_PERSON' | 'SELF_GUIDED',
 *   mobilityResults?: Array<{
 *     testName:   string,
 *     bodyRegion: string,
 *     result:     'FULL' | 'LIMITED' | 'PAIN',
 *     userNotes?: string,
 *   }>,
 * }} body
 * @returns {object} created assessment record
 *
 * @example
 * // Called from AssessmentModal after form validation
 * const assessment = await submitSelfAssessment({ type: fields.type });
 */
export async function submitSelfAssessment({ type, mobilityResults } = {}) {
  const apiType = ASSESSMENT_TYPE_MAP[type] ?? type;

  const { data } = await api.post('/assessments', {
    type: apiType,
    ...(mobilityResults?.length ? { mobilityResults } : {}),
  });

  return data;   // assessment record
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PROGRAMS ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retrieve the authenticated user's full profile, which includes:
 *   • profile data (goals, injury history, equipment)
 *   • all assessments (status, coach notes)
 *   • active program with blocks and exercises
 *   • last 5 workout logs
 *   • aggregate stats (total assessments, total workouts)
 *
 * Automatically uses the userId captured at login/register.
 * You can pass an explicit userId to look up a different member (ADMIN only).
 *
 * @param {string} [userId] – optional override; defaults to the logged-in user
 * @returns {object} member record
 *
 * @example
 * const member = await getMyProgram();
 * const activeProgram = member.programs[0]; // first active program
 */
export async function getMyProgram(userId) {
  const id = userId ?? _userId;

  if (!id) {
    throw new Error(
      'No user id found. Please call loginUser() or registerUser() first.',
    );
  }

  const { data } = await api.get(`/members/${id}`);
  return data;   // full member record including programs[0] (active program)
}

// ─────────────────────────────────────────────────────────────────────────────
// ── WORKOUT LOGS ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record a completed workout session.
 *
 * @param {{
 *   programId:           string,    required — links log to a program
 *   durationMin?:        number,    session duration in minutes
 *   perceived_exertion?: number,    RPE 1–10 scale
 *   notes?:              string,    free-text session notes
 *   sets?:               Array<{    detailed set-level data
 *     programExerciseId: string,
 *     setNumber:         number,
 *     repsCompleted?:    number,
 *     weightKg?:         number,
 *     notes?:            string,
 *   }>,
 * }} body
 * @returns {object} created WorkoutLog record
 *
 * @example
 * await logWorkout({
 *   programId: 'clxxx...',
 *   durationMin: 45,
 *   perceived_exertion: 7,
 *   notes: 'Felt strong today.',
 * });
 */
export async function logWorkout({
  programId,
  durationMin,
  perceived_exertion,
  notes,
  sets,
} = {}) {
  if (!programId) {
    throw new Error('programId is required to log a workout.');
  }

  const { data } = await api.post('/workout-logs', {
    programId,
    ...(durationMin        !== undefined ? { durationMin }        : {}),
    ...(perceived_exertion !== undefined ? { perceived_exertion } : {}),
    ...(notes              !== undefined ? { notes }              : {}),
    ...(sets?.length                     ? { sets }               : {}),
  });

  return data;   // WorkoutLog record
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export: the raw Axios instance for one-off requests
// ─────────────────────────────────────────────────────────────────────────────
export default api;

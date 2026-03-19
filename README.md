# Iso-Body Fitness

A coach-led **MAT (Muscle Activation Techniques) programming platform** that connects fitness coaches with remote and studio clients.  Clients complete mobility assessments; coaches review results and assign personalised weekly programmes that the client tracks through a workout log.

---

## Repository layout

```
isobodyfit/
├── iso-body-fitness/        # React + Vite marketing & onboarding frontend
└── iso-body-fitness-api/    # Express + Prisma REST API (Netlify Functions)
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| PostgreSQL | ≥ 14 |

---

## Quick start

### 1 — Clone & install

```bash
git clone <repo-url> isobodyfit
cd isobodyfit

# Install all workspaces at once
npm install --workspaces
```

### 2 — Configure the API

```bash
cd iso-body-fitness-api
cp .env.example .env
```

Edit `.env` and fill in the required values (see [API configuration](#api-configuration)).

### 3 — Set up the database

```bash
# Inside iso-body-fitness-api/
npm run db:migrate     # run Prisma migrations
npm run db:seed        # (optional) seed demo data
```

### 4 — Configure the frontend

```bash
cd ../iso-body-fitness
cp .env.example .env
```

The default `VITE_API_BASE_URL=http://localhost:3000/api` works out of the box for local development.

### 5 — Start both services

Open two terminals:

```bash
# Terminal 1 — API (port 3000)
cd iso-body-fitness-api
npm run dev

# Terminal 2 — Frontend (port 5173)
cd iso-body-fitness
npm run dev
```

The frontend is now at **http://localhost:5173** and proxies API calls to **http://localhost:3000**.

---

## Package scripts

### Frontend (`iso-body-fitness/`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build optimised single-file bundle for production |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint |

### API (`iso-body-fitness-api/`)

| Script | Description |
|---|---|
| `npm run dev` | Start Express with `nodemon`/`tsx` — auto-reloads on change |
| `npm start` | Start server once (no auto-reload) |
| `npm run build` | Generate Prisma client (`prisma generate`) |
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Seed the database with demo data |

### Monorepo shortcuts (from the repo root)

```bash
npm run dev:frontend     # same as cd iso-body-fitness && npm run dev
npm run dev:api          # same as cd iso-body-fitness-api && npm run dev
npm run build:frontend
npm run build:api
```

---

## API configuration

Copy `iso-body-fitness-api/.env.example` to `.env` and set:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/isobody_dev` |
| `JWT_SECRET` | Long random string used to sign tokens — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` or `24h` |
| `PORT` | Local dev port (default `3000`) |
| `NODE_ENV` | `development` locally, `production` on Netlify |
| `NETLIFY_SITE_URL` | Public site URL; used for CORS and deep links (leave as `http://localhost:3000` locally) |

---

## Frontend configuration

Copy `iso-body-fitness/.env.example` to `.env` and set:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Full base URL of the API, e.g. `http://localhost:3000/api` |

---

## API routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create a new client account |
| POST | `/api/auth/login` | — | Authenticate and receive a JWT |
| GET | `/api/auth/me` | Bearer | Get the authenticated user's profile |
| GET | `/api/members/:id` | Bearer | Full member record (assessments, active programme, logs) |
| POST | `/api/assessments` | Bearer | Submit a new assessment request |
| GET | `/api/assessments` | Bearer | List assessments |
| PUT | `/api/assessments/:id` | Bearer (admin) | Review / approve an assessment |
| GET | `/api/programs` | Bearer | List programmes |
| POST | `/api/programs` | Bearer (admin) | Create a programme from an assessment |
| POST | `/api/workout-logs` | Bearer | Record a completed workout |
| GET | `/api/community` | Bearer | List community posts |
| POST | `/api/community` | Bearer | Create a post |
| GET | `/api/notifications` | Bearer | List notifications |
| GET | `/health` | — | Health check |

---

## Database schema (key models)

```
User ──< Assessment ──< MobilityResult
          │
          └──< Program ──< ProgramBlock ──< ProgramExercise ──> Exercise
                   │
                   └──< WorkoutLog ──< LoggedSet ──> Exercise

User ──< CommunityPost ──< Comment
                       ──< Like
User ──< Notification
```

---

## Deployment

### API → Netlify Functions

The API is designed to run as a Netlify serverless function.

1. Push the repo to GitHub and connect it to a Netlify site.
2. Set all environment variables in the Netlify dashboard under **Site settings → Environment variables**.
3. Netlify reads `iso-body-fitness-api/netlify.toml` and deploys the function automatically on each push.

### Frontend → Netlify (static)

1. Connect the `iso-body-fitness/` sub-directory (or set `Base directory: iso-body-fitness`) in Netlify.
2. Set `VITE_API_BASE_URL` to your deployed API URL.
3. Netlify reads `iso-body-fitness/netlify.toml` and runs `npm run build` on each push.

---

## Project notes

- **Authentication**: JWTs are stored in memory (not `localStorage`) to mitigate XSS.  A page refresh logs the user out; persistent sessions can be added later.
- **TypeScript migration**: The API is mid-migration — some modules exist as both `.js` and `.ts`.  The TypeScript versions are the source of truth; `.js` counterparts are legacy files that haven't yet been removed.
- **Roles**: `CLIENT` users can submit assessments, log workouts, and post in the community. `ADMIN` users can review assessments, create/manage programmes, and moderate posts.
- **Tiers**: `REMOTE` clients work entirely online; `STUDIO` clients attend in-person sessions and receive coach-administered assessments.

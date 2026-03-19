# iso-body-fitness (frontend)

Marketing and onboarding SPA for the Iso-Body Fitness platform.

**Stack:** React 19 · React Router 7 · Tailwind CSS v4 · Vite 6

For full project documentation (installation, API, deployment) see the [repository root README](../README.md).

## Development

```bash
cp .env.example .env          # configure API base URL
npm install
npm run dev                   # http://localhost:5173
```

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with hero, features overview |
| `/how-it-works` | `HowItWorksPage` | Step-by-step platform walkthrough |
| `/features` | `FeaturesPage` | Feature list |
| `/community` | `CommunityPage` | Community section |
| `/pricing` | `PricingPage` | Pricing tiers |

An `<AssessmentModal>` is available on all pages and is triggered via `ModalContext`.

## Build

```bash
npm run build    # outputs a single self-contained index.html to dist/
```

The build uses `vite-plugin-singlefile` to inline all JS/CSS into one HTML file — ideal for static hosting and Netlify.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Base URL of the REST API |

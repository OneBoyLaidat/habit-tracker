# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits and building streaks.

## Project Overview

Habit Tracker allows users to sign up, log in, create/edit/delete daily habits, mark them complete, and view streaks — all persisted to `localStorage`. The app is installable as a PWA and serves a cached app shell offline.s

---

## Setup Instructions

**Prerequisites:**

- Node.js 18+
- npm 9+

**Install dependencies:**

```bash
npm install
```

**Install Playwright browsers:**

```bash
npx playwright install chromium
```

---

## Run Instructions

**Development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build:**

```bash
npm run build
npm run start
```

---

## Test Instructions

**Unit tests (with coverage):**

```bash
npm run test:unit
```

**Integration / component tests:**

```bash
npm run test:integration
```

**End-to-end tests (requires dev or prod server running on port 3000):**

```bash
npm run test:e2e
```

**All tests:**

```bash
npm test
```

Coverage is collected for `src/lib/**`. Minimum threshold: 80% line coverage.

---

## Local Persistence Structure

All data is persisted exclusively to `localStorage` using three keys:

| Key | Shape | Description |
|-----|-------|-------------|
| `habit-tracker-users` | `User[]` (JSON array) | All registered user accounts |
| `habit-tracker-session` | `Session \| null` (JSON) | The currently active session |
| `habit-tracker-habits` | `Habit[]` (JSON array) | All habits across all users |

**User shape:**

```ts
{ id: string; email: string; password: string; createdAt: string }
```

**Session shape:**

```ts
{ userId: string; email: string }
```

**Habit shape:**

```ts
{
  id: string; userId: string; name: string; description: string;
  frequency: 'daily'; createdAt: string; completions: string[];
}
```

`completions` contains unique ISO calendar dates in `YYYY-MM-DD` format. Dashboard queries filter habits by `userId` so each user sees only their own habits.

---

## PWA Support

**Manifest** (`public/manifest.json`): Declares the app name, icons, start URL, display mode, and theme color. Enables the browser's "Add to Home Screen" prompt.

**Service Worker** (`public/sw.js`): Registered on the client via an inline script in `layout.tsx`. Uses a cache-first strategy:

1. On `install`: pre-caches the app shell routes and manifest.
2. On `fetch`: tries the network first; on failure, serves from cache.
3. On `activate`: removes stale caches.

This ensures the app shell renders offline after it has been loaded at least once, without crashing.

---

## Trade-offs and Limitations

- **No real authentication**: Passwords are stored in plaintext in `localStorage`. This is intentional per the TRD ("front-end-focused, do not add a remote database or external authentication service").
- **Single device only**: `localStorage` is per-browser. Data doesn't sync across devices.
- **No encryption**: Sensitive data (email, password) is stored without encryption; acceptable for a local demo stage.
- **Daily frequency only**: The `frequency` field is fixed to `'daily'`. Other frequencies are not implemented.
- **Icons are programmatically generated**: PNG icons were generated with Python/Pillow; they are functional but not artistically designed.
- **No conflict resolution**: Last-write wins for habit updates; no concurrent session support.

---

## Test File → Behavior Mapping

| Test File | Behavior Verified |
|-----------|------------------|
| `tests/unit/slug.test.ts` | `getHabitSlug` — lowercase, hyphenation, trim, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName` — empty, max length, trimmed valid value |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` — empty, not today, consecutive, duplicates, gaps |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` — add, remove, immutability, no duplicates |
| `tests/integration/auth-flow.test.tsx` | Signup creates session, duplicate email error, login stores session, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | Name validation, create renders card, edit preserves immutable fields, delete confirmation, completion toggles streak |
| `tests/e2e/app.spec.ts` | Splash screen, auth redirects, protected routes, signup/login flows, habit CRUD, streak update, persistence after reload, logout, offline shell |

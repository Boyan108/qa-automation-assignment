# QA Automation Assignment

End-to-end test automation for the [Avtoikonom](https://dev.admin.avtoikonom.com) admin panel — authentication and Partners management (create, update, validate).

Built with **Playwright**, **TypeScript**, and a layered Page Object / fixture architecture.

## Architecture overview

```
tests/          → specs (auth, partners)
src/
  pages/        → Page Objects (Login, Partners list, Partner form)
  components/   → Reusable widgets (Dropdown, Address autocomplete)
  api/          → API client for lookup/teardown
  fixtures/     → Composition root (pages, data, API)
  data/         → Types, factories, static reference values
  config/       → Environment + constants
  setup/        → Auth storageState bootstrap
```

**Design principles:** specs read like test cases; volatility is isolated in page/component objects; test data is unique and traceable (`QA_AUTO_*`); auth is reused via `storageState`.

## Setup

**Requirements:** Node.js ≥ 20 (see [`.nvmrc`](./.nvmrc))

```bash
git clone <repo-url>
cd qa-automation-assignment
cp .env.example .env   # fill in credentials
npm install
npx playwright install chromium
```

## Execution

```bash
npm run validate          # typecheck + lint + format
npm test                    # full suite (setup + chromium)
npm run test:ui             # interactive UI mode
npm run test:report         # open last HTML report
npx playwright test tests/partners/create-partner.spec.ts
```

## Environment variables

| Variable        | Required | Description                                               |
| --------------- | -------- | --------------------------------------------------------- |
| `BASE_URL`      | Yes      | Admin panel URL (e.g. `https://dev.admin.avtoikonom.com`) |
| `USER_EMAIL`    | Yes      | Test account email                                        |
| `USER_PASSWORD` | Yes      | Test account password                                     |
| `API_BASE_URL`  | No       | Defaults to `BASE_URL` with `admin.` → `api.`             |
| `LOG_LEVEL`     | No       | `error` / `warn` / `info` / `debug` (default: `info`)     |

For CI, set `BASE_URL`, `USER_EMAIL`, and `USER_PASSWORD` as GitHub Secrets.

## Test coverage

| Spec                                    | Flow                                                      |
| --------------------------------------- | --------------------------------------------------------- |
| `tests/auth/login.spec.ts`              | Login with valid credentials                              |
| `tests/partners/create-partner.spec.ts` | Create partner with all required fields + list validation |
| `tests/partners/update-partner.spec.ts` | Create → update contact person → assert persistence       |

## Assumptions

- Target environment is `dev.admin.avtoikonom.com` with the supplied QA credentials.
- Partner **Type** displays as `Service`; address uses Google Places autocomplete.
- Subscription tiers are filtered by selected services.
- **Description** and **Logo** (with crop modal) are required fields discovered during live exploration.
- API `DELETE` for partners requires MFA on dev (403) — teardown is best-effort; UI tests do not depend on it.

## Key design decisions

- **Playwright over Cypress** — native iframe/autocomplete support, free parallelism, `storageState`, API layer.
- **Component Objects** for Ant Design dropdowns and Google Places (highest flake risk).
- **Fixtures** inject page objects + fresh partner data; auth spec opts out of shared session.
- **Create-then-update** pattern — update test seeds its own partner (deterministic, no shared DB state).
- **CI-only retries** (2) — flakes fail loudly locally.

## Future improvements

- Allure or enhanced reporting with trend history
- API-based partner creation for faster setup (if payload can be simplified)
- MFA-aware teardown or dedicated cleanup account
- Multi-browser projects (firefox/webkit)
- Visual regression for critical flows

## CI

GitHub Actions (`.github/workflows/e2e.yml`) runs quality gates, then e2e, on push/PR to `main`. Failed runs upload Playwright HTML report and traces as artifacts.

Set GitHub Secrets: `BASE_URL`, `USER_EMAIL`, `USER_PASSWORD`.

### Known issue — GitHub account billing lock

The workflow is configured correctly, but jobs may **never start** if the repository owner's GitHub account is locked for billing — even though this is a **public** repository and standard Linux runners are normally free:

> The job was not started because your account is locked due to a billing issue.

That message is **account-level**, not a framework or workflow defect. Fix it under **GitHub → Settings → Billing and plans**, then use **Re-run all jobs** on the Actions tab.

Until CI runs again, use the same checks locally:

```bash
npm run validate   # typecheck + lint + format (quality job)
npm test           # full suite (e2e job; requires .env)
```

# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

Monorepo with 4 independently-installable sub-projects, all using **npm**:

| Service | Path | Framework | Dev Port | Dev Command |
|---|---|---|---|---|
| Main Website | `/workspace` | Next.js 14 | 3001 | `npm run dev` |
| Client Dashboard | `/workspace/client-dashboard` | Next.js 14 | 3002 | `npm run dev` |
| Agency Panel Frontend | `/workspace/agency-management-panel/frontend` | Next.js 15 + Turbopack | 3003 | `npm run dev -- --port 3003` |
| Agency Panel Backend | `/workspace/agency-management-panel/backend` | Express 5 + TypeScript | 3000 | `npm run dev` |

### Key caveats

- **Port conflict**: The root website and agency panel frontend both default to port 3001. Start the agency panel frontend with `--port 3003` (or any free port) to avoid conflicts.
- **Missing source files**: The codebase has two missing module stubs that were created during setup:
  - `agency-management-panel/backend/src/aws.ts` — stub for AWS RDS/Cognito/DynamoDB services (the backend imports from `./aws` but the original file was never committed).
  - `client-dashboard/src/hooks/use-aws-auth.ts` — stub for AWS Cognito auth hook (imported by `client-wrapper.tsx`).
- **Backend .env**: The backend requires a `.env` file at `agency-management-panel/backend/.env`. Copy from `.env.example` and fill in dummy values for local dev. The backend gracefully handles missing external services (AWS DynamoDB, Supabase, Redis, n8n).
- **AWS SDK deps**: The backend `package.json` was missing `@aws-sdk/client-dynamodb` and `@aws-sdk/util-dynamodb` — these were installed during setup. If `npm install` drops them, re-run `npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb` in the backend directory.
- **No automated tests**: The agency panel frontend has Jest configured but no test files exist. The backend test script is a no-op. Root website and client dashboard have only `next lint`.

### Lint / Type-check

- Root website: `npm run lint` (from `/workspace`)
- Client dashboard: `npm run lint` (from `/workspace/client-dashboard`)
- Agency panel frontend: `npm run lint` (from `/workspace/agency-management-panel/frontend`)
- Agency panel backend: `npx tsc --noEmit` (from `/workspace/agency-management-panel/backend`)

### External services (all optional for local dev)

The apps degrade gracefully without real credentials for: Firebase/Firestore, Supabase, AWS DynamoDB/RDS/Cognito, Redis, n8n, Resend, Google Gemini AI. The main website's contact form sends to a hardcoded external webhook URL (not the local backend), so browser CORS errors are expected in local dev.

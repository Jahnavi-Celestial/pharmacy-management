
## Stack
- Backend: Express 5 + TypeScript (ESM, nodenext), TypeORM + PostgreSQL, class-validator/class-transformer DTOs, JWT auth (jsonwebtoken + bcrypt), node-cron expiry checks, node-pg-migrate, pdfkit, SendGrid, tsx watch dev
- Frontend: React 19 + Vite + TypeScript, MUI 7 + Emotion, react-router-dom 7, axios (shared/apiClient.ts), jwt-decode, localStorage token auth
- Lint: ESLint 10 + typescript-eslint both sides

## Conventions
- Backend layering: routes → controller → services → repository → entities (each layer class, singleton export new X())
- Imports use .ts extensions (allowImportingTsExtensions)
- DTOs in src/dto/*.dto.ts, validated via validateDto() middleware
- Roles: UserRole.ADMIN | SALESPERSON, enforced via authCheck + authorizeRoles
- Frontend: feature folders features/<Name>/{page,components,api} + shared/{components,context,hooks,apiClient}; API calls only through apiClient; routes declared centrally in App.tsx
- Response shape: { message, data?, ...pagination }

## Boundaries
- Routes never touch repository/DB directly — go through service
- Frontend never calls DB or raw URLs — only apiClient + VITE_BASE_URL
- All /api routes except auth require authCheck; admin-only routes need authorizeRoles
- No secrets in code — .env only (PORT, FRONTEND_URL, DB creds, etc.)
- Don't modify migrations history; new schema changes → new migration
- CORS locked to FRONTEND_URL

## Tests
- Honest current state: no test framework yet (backend test script = placeholder, frontend has none)
- Verification commands: npm run lint, npm run build (both dirs), npm run dev
- Note: future tests go in *.test.ts beside source (recommend vitest when added)
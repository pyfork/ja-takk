# Project rules

<!-- scaffolder-Opus5.5-agent, 2026-10-16 -->

## Back end
Go 1.25 and chi: `docs/rules/stacks/go-chi.md`, with PostgreSQL. See ADR-001. Until the rebuild lands, the old Go 1.18 standard-library API in `api/` stays live.

## Front end
React and TypeScript with Vite: `docs/rules/stacks/react-vite.md`. See ADR-001. Until the rebuild lands, the old static build in `site/` stays live.

## Screens and back end
Both: a landing page with sign-up, and an API with storage.

## Deploy
Manual, `deploy/deploy.sh`. First copy `deploy/.env.example` to `deploy/.env` (git-ignored) and set `VERIDLE_HOST` to your SSH alias for the server. Flow rule 4 (deploy on every merge to `main`) does not apply until an ADR decides it.

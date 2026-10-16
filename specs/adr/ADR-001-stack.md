# ADR-001: Build this project with Go 1.25 and chi, React and TypeScript, and PostgreSQL

Status:   Accepted 2026-10-16
Door:     one-way
Deciders: the owner

## Context
This project is a spike to test demand for a rental agreement deciphering
service. Today it is a static landing page (Node build, vanilla JS and CSS)
and a Go 1.18 standard-library API with one endpoint, `/api/signin`, which
reads and discards the submission. Nothing is stored, so no demand signal is
captured yet.

The owner wants the project built with Go and chi, React and TypeScript, and
PostgreSQL. PostgreSQL 18 already runs on the deploy host; the host's Go
toolchain is 1.18, but the binary is cross-compiled locally, so the host
version does not constrain the build.

What breaks if this is wrong: a stack that is too heavy slows the spike down
before demand is known; a stack that is too light gets rewritten as soon as
the first real feature (storing sign-ups, uploading an agreement) lands.

## Options considered
1. **Keep the current stack** (Go standard library, static vanilla front end), add PostgreSQL only when a feature needs storage.
   + Nothing to rewrite; the live site keeps working as is.  − No kit stack file fits, so every rule is project-specific; does not match the owner's chosen stack.
2. **Move to Go + chi, React + TypeScript (Vite), PostgreSQL**, the kit's `go-chi.md` and `react-vite.md`.
   + Kit stack files cover tests, rules and the walking-skeleton checks; one stack for every feature that follows.  − Rewrites the landing page and the API; adds a JS build and a database to run, migrate and back up.
3. **Half-way: Go + chi and PostgreSQL now, keep the static landing page**, move the front end to React + TypeScript only when the first interactive screen is needed.
   + The back end gets the kit's rules and storage at once; the landing page, which already works, is untouched.  − Two front-end styles for a while; `react-vite.md` applies only to the new screens.

## Decision
Option 2. The back end is Go 1.25 (`go.mod` says `go 1.25`) with chi as the
router, following `docs/rules/stacks/go-chi.md`. The front end is React with
TypeScript, built with Vite, following `docs/rules/stacks/react-vite.md`.
Storage is PostgreSQL. Go 1.18 is dropped: it came with the existing code and
was never chosen.

## Consequences
+ The kit's stack files supply the test, logging and route-check rules, so the walking skeleton follows them instead of project-only rules.
+ One stack for every later feature: storing sign-ups, uploading an agreement.
− The landing page and the API are rebuilt; the live site keeps running from the old build until the new one deploys.
− A database to run on the deploy host: migrations, a least-privilege app role, backups and a restore test.
− A JS toolchain and its dependency audit in CI.

## Revisit when
The demand test reads its first result (sign-ups counted against the PRD's
target), or a feature needs a screen the static page cannot serve.

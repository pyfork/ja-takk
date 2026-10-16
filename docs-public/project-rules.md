# Project rules — veridle

<!-- scaffolder-Opus5.5-agent, 2026-10-16 -->

## Back end
Something else: Go 1.18, standard library only (`net/http`, no router framework), in `api/`. No database. Tests: `cd api && go test -count=1 ./...`.

## Front end
Something else: static site built by Node (`site/build.mjs`), vanilla JS and CSS, no framework. No front-end tests yet. Build: `cd site && npm ci && node build.mjs`, output `site/dist/`.

## Screens and back end
Both: a static landing page with a sign-in endpoint.

## Deploy
Manual, `deploy/deploy.sh`. Flow rule 4 (deploy on every merge to `main`) does not apply until an ADR decides it.

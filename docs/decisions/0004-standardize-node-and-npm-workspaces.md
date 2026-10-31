# 4. Standardize Node.js and npm workspaces

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

The selected frontend and API stack both use TypeScript and Node.js. The project needs a simple shared dependency workflow for its React/Vite frontend and NestJS API. The team selected `project-starter-template/` as the application root to preserve its existing project documentation.

## Decision

Use Node.js 24 LTS and npm workspaces. Keep the frontend in `apps/web/` and the API in `apps/api/`, both managed by a single workspace manifest at the application root. Do not add a shared code package until a concrete need for it exists.

## Consequences

- The team uses one package manager and one workspace root for both applications.
- `.nvmrc` and the `engines` field identify the supported Node.js major version; CI should use Node.js 24.
- Frontend and API starter scaffolds now live in the two workspaces; product modules are still to be implemented.
- The existing Git repository root is the parent of the selected application root. GitHub Actions only discovers workflows in the repository-root `.github/workflows/` directory, so the nested starter CI workflow will not run from the repository in its current layout. This must be addressed before relying on CI for this repo.
- Frontend tests use Vitest and API tests use Jest, selected separately in [ADR 0005](0005-select-frontend-and-api-test-tools.md). The deployment approach remains undecided.

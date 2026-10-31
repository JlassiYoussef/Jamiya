# 2. Select the web application stack

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

Jamiya needs a multilingual web interface (Arabic RTL, French, and English), a maintainable layered modular monolith, role- and association-scoped access control, and reliable transactions for event registration. The team has experience with JavaScript/TypeScript, React, and Node.js. The exact SRS is unavailable, so the stack should support the agreed baseline without adding unnecessary services or integrations.

## Decision

Use React with TypeScript and Vite for the web interface, a NestJS API written in TypeScript, and PostgreSQL for relational storage. Keep the backend as one modular application organized around the agreed business components and layered boundaries.

## Consequences

- The team can use TypeScript across the UI and API and build on its existing JavaScript/React/Node.js experience.
- NestJS modules and providers provide structure for separating application services and persistence abstractions; PostgreSQL provides relational constraints and transactions for association data and event registration.
- The UI and API are separate application layers and must agree on explicit request/response contracts, authentication, and authorization behavior.
- The team must enforce association scoping consistently in API authorization and persistence operations.
- Prisma was selected separately for data access in [ADR 0003](0003-use-prisma-for-data-access.md). Node.js 24 LTS and npm workspaces were selected separately in [ADR 0004](0004-standardize-node-and-npm-workspaces.md). Vitest for frontend tests and Jest for API tests were selected in [ADR 0005](0005-select-frontend-and-api-test-tools.md). Deployment platform remains undecided.

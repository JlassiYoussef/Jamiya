# 5. Select frontend and API test tools

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

Jamiya has separate React/Vite and NestJS workspaces. Both need tests, but each has different framework conventions and tooling integrations.

## Decision

Use Vitest for frontend tests and Jest for API tests.

## Consequences

- Frontend tests use a runner designed to integrate with the Vite toolchain.
- API tests follow NestJS conventions and use Jest.
- The two workspaces have separate test commands and configurations; workspace-level commands should run both consistently.
- Each workspace has its own runner configuration and a starter smoke test; feature-specific tests should be added with product behavior.
- Test type selection (unit, integration, end-to-end), coverage thresholds, and CI execution details will be decided as the app and its behavior are implemented.

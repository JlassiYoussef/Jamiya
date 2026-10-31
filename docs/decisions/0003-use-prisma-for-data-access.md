# 3. Use Prisma for data access

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

Jamiya's NestJS API needs relational persistence through PostgreSQL. The application has association-scoped data and workflows, such as event registration, that require database transactions and integrity constraints. The architecture places persistence behind repositories in the data-access layer. The team selected JavaScript/TypeScript, React, and Node.js as its implementation direction.

## Decision

Use Prisma as the data-access and schema/migration tool for PostgreSQL. Keep Prisma usage inside the data-access layer and expose application-oriented repository operations to business services.

## Consequences

- Type-safe database queries and an explicit schema support consistent development across the API.
- Prisma migrations will manage schema changes; database transactions and constraints must protect event capacity and duplicate registration.
- Tenant isolation remains an application invariant: repository operations must scope reads and writes to the authorized association rather than relying on callers to remember filters.
- Business services should not depend directly on Prisma-generated client types or query APIs.
- The Prisma version, migration workflow details, and generated-client placement remain to be decided during project setup. The team selected npm workspaces separately in [ADR 0004](0004-standardize-node-and-npm-workspaces.md).

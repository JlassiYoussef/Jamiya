# 6. Implement association-scoped member management

- **Status:** Accepted
- **Date:** 2026-10-19

## Context

The first product workflow is managing members for multiple associations. The
API scaffold had no authentication or database integration, and member identity,
status, and role access rules needed to be defined before enabling writes.

## Decision

Persist members, association users, and revocable sessions in PostgreSQL through
Prisma 7 with its PostgreSQL driver adapter. Normalize member email addresses
to lowercase and enforce uniqueness per association. Store membership status
explicitly as active, pending, or expired;
optional start/end dates are informational and must be ordered when both exist.

Use opaque, cryptographically random bearer tokens with only their SHA-256 hashes
stored in the database. Hash passwords with Node.js scrypt. Seed the first
association president from environment variables; do not expose public account
registration. Presidents and administrators manage association members,
treasurers may read all association members, and members/volunteers may read
only their own linked profile.

## Consequences

- Every member repository query and mutation is scoped to the authenticated
  association, and the database enforces association/email uniqueness.
- Sessions can be revoked and expire after 12 hours; bearer tokens are held in
  browser session storage for the current tab.
- The initial president account requires a local PostgreSQL database and a
  private seed password. Additional account provisioning, password recovery,
  login rate limiting, and production session policy remain future work.
- Prisma client and CLI dependencies are used because Prisma/PostgreSQL were
  already the selected project data-access stack. Prisma 7's PostgreSQL driver
  adapter is configured for both the API and seed command.

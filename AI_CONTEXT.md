# AI Context — Single Source of Truth

This file is the source of truth for AI assistants working in this repository. Keep it concise and update it when confirmed project decisions change. Do not treat unresolved design proposals as requirements.

## 1. Project summary

- **Name:** Jamiya
- **One-liner:** A multilingual web platform that helps Tunisian associations manage their administrative and organizational work in one place.
- **Primary users:** Association presidents, administrators, treasurers, members, and volunteers.
- **Application AI:** None is part of the current baseline. AI-assisted development tools are not an application feature.

The first release is planned for multiple associations, with each association's data kept separate. Its planned modules are authentication and authorization, association and member management, events and registrations, attendance, volunteers and opportunities, documents, basic financial tracking, in-app notifications and announcements, and reports and dashboards. The interface will support Arabic (RTL), French, and English.

The agreed architecture is Agile iterative delivery with object-oriented design in a layered, three-tier modular monolith. MVC is used within the presentation layer. See [`docs/architecture.md`](docs/architecture.md) for components, domain concepts, and key flows.

The Lab 4 and Lab 5 design documents inform this baseline, but the SRS is unavailable. Requirement IDs and details marked as proposals in those designs are not confirmed requirements.

## 2. Technology stack

The team selected React with TypeScript and Vite for the web interface, a NestJS API written in TypeScript, Prisma for data access, and PostgreSQL for relational storage. The workspace uses Node.js 24 LTS and npm workspaces. Frontend tests use Vitest; API tests use Jest. Do not substitute these choices without team agreement. Deployment platform has not been selected.

| Layer | Choice |
|-------|--------|
| Web interface | React + TypeScript + Vite |
| API | NestJS + TypeScript |
| Runtime | Node.js 24 LTS |
| Data access | Prisma |
| Database | PostgreSQL |
| Package manager | npm workspaces |
| Frontend tests | Vitest |
| API tests | Jest |
| Deployment | Not selected |

## 3. Repository state and structure

The application workspace is rooted in `project-starter-template/`. The React/Vite frontend has a responsive, multilingual dashboard prototype and authenticated member-management screens. The NestJS API provides database-backed login/session and association-scoped member CRUD using Prisma/PostgreSQL. Other modules remain prototype or scaffold work.

- `apps/web/` — React/Vite frontend workspace (Vitest)
- `apps/api/` — NestJS backend workspace (Jest)
- `docs/` — architecture, setup, decisions, and changelog
- `scripts/` — repository helper scripts

## 4. Domain and behavior baseline

- An association's records must not be accessible to another association.
- The baseline roles are president, administrator, treasurer, member, and volunteer. A platform-administrator role is not included.
- Member email addresses are normalized to lowercase and unique within each association.
- Membership status is explicit (`active`, `pending`, or `expired`); optional start/end dates do not derive or override status.
- Presidents and administrators may manage all members in their association; treasurers may read all association members; members and volunteers may read only their own linked profile.
- Only members with active membership may register for events.
- Event registration must reject duplicate registrations and enforce event capacity safely under concurrent requests.
- Financial functionality is limited to basic income and expense records and summaries; it is not full accounting.
- Notifications are in-app only in the baseline; no email or SMS provider is integrated.
- Documents have access controls. The physical storage location for uploaded files remains undecided.
- Online payments, a native mobile app, QR attendance, volunteer certificates, email/SMS notifications, full accounting, and AI features are outside the baseline but may be reconsidered later.

## 5. Conventions assistants MUST follow

- Match the existing code style and `.editorconfig`; do not reformat unrelated files.
- Do not add dependencies or select technologies without team agreement.
- Never hardcode secrets. Use the repository's `.env` approach where applicable; never commit `.env` or credentials.
- Add tests for new application behavior once an application/test structure exists.
- Keep changes focused. Update `docs/CHANGELOG.md` when application behavior changes.
- Do not invent requirements. Ask when a decision materially affects the work; clearly label unresolved details as proposals.
- Preserve the layered boundaries described in [`docs/architecture.md`](docs/architecture.md): presentation calls business services, business services use repositories, and repositories are the only layer that accesses the database.

## 6. Glossary

- **Association:** A Tunisian non-profit organization managed using Jamiya.
- **Member:** A person enrolled in an association; active membership is required for event registration.
- **Volunteer:** A person with a volunteer profile who can apply for opportunities.
- **RBAC:** Role-based access control.
- **RTL:** Right-to-left text direction used for Arabic.
- **Repository:** An abstraction that hides persistence details from business services.
- **SDD:** Software Design Document.
- **SRS:** Software Requirements Specification; currently unavailable.

---

_Last updated: 2026-10-18._

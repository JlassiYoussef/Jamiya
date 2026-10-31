# Full Setup Guide

Everything a new teammate (or your grader) needs to run the project from scratch.
Keep this accurate — test it by following it on a clean machine when you can.

## Prerequisites

- Git
- Node.js 24 LTS (see `.nvmrc`)
- npm (included with Node.js)
- PostgreSQL
- A code editor with an AI assistant (VS Code + GitHub Copilot recommended)

## Steps

```bash
# 1. Clone
git clone <your-repo-url>
cd <repo>

# 2. One-time project setup (git hooks, etc.)
./scripts/setup.sh

# 3. Environment variables
cp .env.example .env
# then edit .env and fill in the values

# 4. Install dependencies and generate the Prisma client from the workspace root
npm ci

# 5. Create an empty PostgreSQL database named jamiya, then apply the schema
npm run db:migrate --workspace @jamiya/api

# 6. Set SEED_ADMIN_PASSWORD in .env to a private password of at least 12 characters,
#    then create the initial association president account
npm run db:seed --workspace @jamiya/api

# 7. Run
npm run dev --workspace @jamiya/web
# In another terminal, run the API:
npm run start:dev --workspace @jamiya/api

# 8. Run tests
npm test
```

The npm workspace root is this project directory. Frontend and API packages live
under `apps/web/` and `apps/api/`, respectively.

The root `.env` supplies the database connection, initial association/account
values, and frontend API URL; `.env.example` lists the required variables. The
development seed creates or updates the association and creates the president
account only if it does not already exist. Do not commit `.env`.

The API uses Prisma 7 with its PostgreSQL driver adapter. Prisma's schema,
generated client, migrations, and seed configuration live in `apps/api/`;
`npm run db:generate --workspace @jamiya/api` regenerates the client after
schema changes. The root install script generates it automatically during `npm ci`.

The web development server and API can be started independently after database
setup. The API listens on port 3000 by default. Root scripts are also available
for `npm run build`, `npm test`, and `npm run lint`.

## Troubleshooting

_Add problems and fixes as you hit them, so teammates don't lose an hour to the
same issue._

- **Problem:** _TODO_
  **Fix:** _TODO_

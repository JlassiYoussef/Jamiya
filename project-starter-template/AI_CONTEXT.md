# AI Context — Single Source of Truth

> **What is this file?**
> This is the one place your team describes the project *to AI assistants*
> (GitHub Copilot, Claude, Cursor, Gemini, etc.). Every AI tool config in this
> repo points back to this file, so you only maintain **one** set of instructions.
>
> Keep it short, current, and honest. If the project changes, update this file in
> the same commit. Treat it like code.

---

## 1. Project summary

<!-- 2–4 sentences. What are you building, for whom, and what is the AI-assisted part? -->

**Name:** _TODO_
**One-liner:** _TODO — e.g. "A web app that helps students find study partners by course."_
**Primary users:** _TODO_
**The AI-assisted component:** _TODO — what part uses AI, and how._

Link to your design docs so the assistant can go deeper:
- SRS / requirements: `docs/` _(or link)_
- Architecture: [`docs/architecture.md`](docs/architecture.md)

## 2. Tech stack

<!-- Fill in exactly what you use. Delete rows that don't apply. Be specific
     about versions — assistants generate better code when they know the version. -->

| Layer       | Choice                                  |
|-------------|------------------------------------------|
| Language(s) | _TODO (e.g. TypeScript 5.x, Python 3.12)_ |
| Framework   | _TODO (e.g. React + Vite, FastAPI)_       |
| Database    | _TODO (e.g. PostgreSQL, SQLite, none)_    |
| Package mgr | _TODO (e.g. npm, pip + venv)_             |
| Testing     | _TODO (e.g. Vitest, pytest)_              |
| Deploy      | _TODO (e.g. Vercel, Render, none yet)_    |

## 3. Project structure

<!-- Where does code live? Keep this accurate so assistants put new files
     in the right place. Run scripts/update-structure.sh to refresh the tree in README. -->

- `src/` — _TODO_
- `tests/` — _TODO_
- `docs/` — design docs, decisions, changelog
- `scripts/` — helper scripts

## 4. Conventions the assistant MUST follow

<!-- These are rules you want enforced in every suggestion. Edit freely. -->

- **Style:** follow the existing code style and `.editorconfig`. Don't reformat unrelated code.
- **Naming:** _TODO (e.g. camelCase for JS vars, snake_case for Python)_
- **Comments:** explain *why*, not *what*. Match the density of surrounding code.
- **Dependencies:** do **not** add a new library without the team agreeing first. Prefer the standard library.
- **Secrets:** never hardcode keys/passwords. Use `.env` (which is gitignored). See `.env.example`.
- **Tests:** new features come with at least one test.
- **Commits:** small and focused. Update `docs/CHANGELOG.md` when behavior changes.

## 5. What NOT to do

- Don't invent requirements — if something is unclear, ask or leave a `TODO` with your name.
- Don't delete or rewrite large sections you weren't asked to touch.
- Don't commit generated files, build output, `node_modules/`, or `.env`.
- Don't paste private user data or credentials into AI chats.

## 6. Glossary / domain terms

<!-- Project-specific words the assistant won't know. This dramatically improves output. -->

- _TERM_ — _definition_

---

_Last updated: TODO (date) by TODO (name). Review this file at the start of every work session._

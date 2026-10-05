# Lab 6 — Implementation Environment Setup

The bridge lab between **design (Lab 4/5)** and **implementation**. Teams turn
their paper design into a real, collaborative, AI-ready GitHub workspace.

## Contents

| File / folder | Audience | What it is |
|---------------|----------|------------|
| [`LAB6_handout.md`](LAB6_handout.md) | **Students** | The lab: objectives, 6 timeboxed steps, checkpoints, submission checklist |
| [`project-starter-template/`](project-starter-template/) | **Students** | The ready-to-clone scaffold they build on (give this to teams) |
| [`INSTRUCTOR_NOTES.md`](INSTRUCTOR_NOTES.md) | **You** | Prep, timing, pitfalls, grading rubric, fast verification |

## How to distribute the template to students

**Option A — zip (simplest):**
```bash
cd project-starter-template && zip -r ../starter-template.zip . -x '.git/*'
```
Post the zip on the LMS. Students unzip, then follow Step 1 (`git init` → push).

**Option B — GitHub template repo (smoothest for students):**
Push `project-starter-template/` to a repo in your course org, then enable
**Settings → "Template repository"**. Students click **"Use this template"**.
(Adjust Step 1 of the handout if you do this.)

## What the environment gives each team

- A **safe Git workflow** (protected `main`, branch → PR → review).
- **One** AI-context file (`AI_CONTEXT.md`) that Copilot, Claude, **and** Cursor
  all read — so students teach their AI tools once, not three times.
- **Living docs**: architecture, ADR decision log, changelog, and a non-blocking
  git hook + CI check that nudge teams to keep docs current.
- **Clean hygiene**: multi-stack `.gitignore`, `.env.example`, line-ending
  normalization, shared editor config.
- **Light CI** that auto-detects Node/Python and runs tests + the docs check.

Everything is stack-agnostic with per-stack appendices, since teams chose
different stacks.

---
_Prepared for CS 488 — AI-First Software Engineering._

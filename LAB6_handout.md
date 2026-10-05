# AI-FIRST SOFTWARE ENGINEERING — LAB HANDOUT
## Lab 6: Implementation Environment Setup
### Turning Your Design Into a Working Project Workspace

| Field | Details |
|-------|---------|
| **Session type** | Hands-on lab (team work) |
| **Duration** | ≈ 2 hours 30 minutes |
| **Prerequisite** | Lab 5 — completed design (architecture, class, sequence diagrams) + your SRS from Lab 2/3 |
| **Team size** | 2–4 students (your assigned project team) |
| **Deliverable** | A live GitHub repository, set up from the starter template, that your team can start implementing in immediately — plus a short Setup Report |

---

## 1. Purpose of This Session

You have an idea (Lab 0), requirements (Lab 2/3), and a design (Lab 4/5). Before
anyone writes a feature, the team needs a **shared, professional workspace**: a
repository everyone can push to safely, documentation that stays alive, and AI
assistants that actually understand *your* project.

By the end of this session, your team will be able to clone one repo, run one
setup command, and start building — with Git workflow, docs, and AI tooling all
in place. This is the gate that prevents the Week-10 chaos of "it works on my
machine", lost decisions, and AI assistants that keep suggesting the wrong thing.

> **Why this matters in an AI-first course:** AI assistants are only as good as
> the context you give them. A repo with a clear `AI_CONTEXT.md`, real
> conventions, and clean structure turns Copilot/Claude/Cursor from a random
> autocomplete into a teammate who knows your project.

### Learning objectives

By the end of this lab you will be able to:

1. Set up a shared Git repository with a safe branch-and-PR workflow.
2. Configure **one** source of project context that **all** AI editors read
   (Copilot, Claude, Cursor), instead of repeating yourself per tool.
3. Keep documentation alive with lightweight automation (a docs reminder hook and
   a structure generator) rather than letting docs rot.
4. Protect your project from classic mistakes: committed secrets, broken `main`,
   and undocumented decisions.
5. Produce a repo a stranger (your grader) can clone and run by following the README.

---

## 2. Session Logistics

| Item | Details |
|------|---------|
| Team size | 2–4 students (your project team) |
| Duration | ≈ 2h30, timeboxed per step (see agenda) |
| Tools needed | Laptop with **VS Code + GitHub Copilot** (Claude/Cursor welcome), **Git** installed, a **GitHub account** per student |
| Instructor role | Circulates, signs off at each checkpoint |

### 2.1 Pre-Session Checklist

Complete **before** arriving:

- [ ] Every member has a GitHub account and is signed in
- [ ] Git is installed (`git --version` works in a terminal)
- [ ] VS Code is installed with the **GitHub Copilot** extension signed in
- [ ] You have your Lab 5 design (diagrams) and Lab 2/3 SRS accessible
- [ ] Your team has agreed on a tentative tech stack (language/framework)
- [ ] Download the course **`project-starter-template/`** folder (provided by your instructor)

---

## 3. Session Agenda

| Time | Step | Activity |
|------|------|----------|
| 0:00 – 0:10 | Kickoff | Confirm team, project, and chosen stack with instructor |
| 0:10 – 0:35 | Step 1 | Create the GitHub repo from the starter template |
| 0:35 – 0:55 | Step 2 | Run setup, get everyone cloned and connected |
| 0:55 – 1:25 | Step 3 | Teach your AI assistants: fill in `AI_CONTEXT.md` |
| 1:25 – 1:50 | Step 4 | Apply your stack appendix + bring your design into `docs/` |
| 1:50 – 2:10 | Step 5 | Set up the safe Git workflow (branch protection + first PR) |
| 2:10 – 2:30 | Step 6 | Verify, write the Setup Report, final checkpoint |

> **Checkpoints:** at the end of each step, flag the instructor before moving on.
> This keeps every team calibrated and catches problems (like a committed `.env`)
> early, when they're cheap to fix.

---

## Step 1 — Create Your Repository (25 min)

**One person** does this while the team watches, then everyone joins in Step 2.

1. Look inside the `project-starter-template/` folder your instructor provided.
   Skim the files — notice `README.md`, `.gitignore`, `AI_CONTEXT.md`, `docs/`,
   and `.github/`.
2. Create a **new, empty** repository on GitHub (private is fine):
   - Name it after your project.
   - **Do not** add a README/license/gitignore on GitHub — the template has them.
3. Put the template contents into the repo and push:

   ```bash
   # from inside the project-starter-template folder:
   git init
   git add .
   git commit -m "chore: initialize project from CS 488 starter template"
   git branch -M main
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

4. Add **every teammate** as a collaborator on the repo
   (GitHub → Settings → Collaborators).

> 💡 **AI-first tip:** You can ask Copilot Chat or Claude *"explain what each file
> in this repo is for"* to orient your whole team fast.

✋ **Checkpoint 1:** Show the instructor your repo on GitHub with all teammates added.

---

## Step 2 — Everyone Clone & Run Setup (20 min)

Now **every team member** gets the project on their own machine:

```bash
git clone <your-repo-url>
cd <repo>
./scripts/setup.sh         # enables the git hooks; Windows: run in Git Bash
cp .env.example .env        # your local secrets file (never committed)
```

Open the folder in VS Code. When it offers to install the **recommended
extensions**, say yes (that's the `.vscode/extensions.json` list, including Copilot).

**Verify secrets are safe:** run `git status`. You should **not** see `.env`
listed. If you do, stop and tell the instructor — the `.gitignore` isn't working.

✋ **Checkpoint 2:** Every member has the repo cloned, setup run, and `.env` created
(and *not* tracked by git).

---

## Step 3 — Teach Your AI Assistants (30 min)

This is the heart of an AI-first workflow. You'll fill in **one** file,
`AI_CONTEXT.md`, and every AI editor (Copilot, Claude, Cursor) will use it —
because `CLAUDE.md`, `.github/copilot-instructions.md`, and `.cursor/rules/` all
point back to it.

As a team, open `AI_CONTEXT.md` and fill in:

1. **Project summary** — what you're building, for whom, and the AI-assisted part
   (pull this from your Lab 0 / SRS).
2. **Tech stack** — be specific, including versions.
3. **Project structure** — where code will live.
4. **Conventions** — naming, comments, dependency rules, secret handling.
5. **Glossary** — your project's domain terms the AI won't know.

Then **test that it works**: open Copilot Chat (or Claude/Cursor) and ask
something project-specific, e.g.:

> *"Based on this project's context, suggest the folder and file where I'd add the
> login feature, and what conventions to follow."*

A good answer reflects *your* stack and conventions. A generic answer means your
`AI_CONTEXT.md` needs more detail. Iterate.

> ⚠️ **Responsible-use reminder:** never paste secrets or real user data into an
> AI chat. You own every line you commit — read and understand AI output before
> accepting it. (See `CONTRIBUTING.md` §6.)

✋ **Checkpoint 3:** Show the instructor your filled-in `AI_CONTEXT.md` and one
AI response that correctly used your project context.

---

## Step 4 — Apply Your Stack + Bring In Your Design (25 min)

1. Open `stack-appendices/` and follow the file matching your stack
   (`node.md`, `python.md`, or `other.md`): initialize your project, set up a
   test command, and uncomment any extra `.gitignore` lines you need.
   Then **delete the `stack-appendices/` folder** — you don't need it in your repo.
2. Move your **Lab 5 design** into the repo:
   - Put your architecture overview and diagrams into `docs/architecture.md`
     (Mermaid diagrams render on GitHub — see the example in that file).
   - Record your first real decision as an ADR: copy `docs/decisions/TEMPLATE.md`
     to `docs/decisions/0002-...md` (e.g. your framework choice) and fill it in.
3. Update the `README.md` header (project name, team, what it does) and run:

   ```bash
   ./scripts/update-structure.sh   # auto-fills the structure tree in the README
   ```

✋ **Checkpoint 4:** Your `docs/architecture.md` reflects your real design and you
have at least one ADR beyond the first.

---

## Step 5 — Lock In a Safe Team Workflow (20 min)

1. On GitHub, protect `main` so nobody can break it:
   **Settings → Branches → Add branch protection rule** for `main`:
   - ✅ Require a pull request before merging
   - ✅ Require at least 1 approval
   - (If available) ✅ Require status checks to pass → select the **CI** check
2. Practice the flow — **each member** makes a tiny PR:

   ```bash
   git checkout main && git pull
   git checkout -b docs/<your-name>-intro
   # add your name to the README team list
   git add -A && git commit -m "docs: add <name> to team list"
   git push -u origin docs/<your-name>-intro
   ```
   Open the PR on GitHub, fill in the template, have a teammate review and merge.
3. Watch the **Actions** tab: the CI workflow runs on your PR. Notice the docs
   reminder and (if your stack is set up) your tests running automatically.

✋ **Checkpoint 5:** `main` is protected, and every member has opened, reviewed,
and merged at least one PR.

---

## Step 6 — Verify & Write the Setup Report (20 min)

Do a final **clone test** (the grader will): have a member clone the repo into a
fresh folder and follow the README's "Getting started" steps. If they can't run
it, fix the README.

Then write a short **Setup Report** (`docs/setup-report.md`, ~1 page) covering:

- Repo URL and list of members with their GitHub usernames
- Your chosen stack and the one-line reason (link the ADR)
- A screenshot of a merged PR and of the CI run (green)
- One paragraph: how you configured AI assistants and one concrete example of
  the AI using your `AI_CONTEXT.md` well
- Anything still TODO before implementation starts

✋ **Final Checkpoint:** Submit your Setup Report and repo URL.

---

## Submission Checklist

Tick every box before you submit:

- [ ] Repo created from the starter template, all members are collaborators
- [ ] `./scripts/setup.sh` runs; `.env` exists locally and is **not** committed
- [ ] `AI_CONTEXT.md` fully filled in and verified with a real AI response
- [ ] `README.md` header updated; structure tree generated
- [ ] `docs/architecture.md` reflects your Lab 5 design (with a diagram)
- [ ] At least one ADR beyond the template's first one
- [ ] `main` is branch-protected; PR + review required
- [ ] Every member has merged at least one PR
- [ ] CI runs on PRs (green check)
- [ ] `stack-appendices/` deleted; stack-specific `.gitignore` lines applied
- [ ] `docs/setup-report.md` submitted with repo URL

---

## Appendix A — What's in the Starter Template

| File / folder | Purpose |
|---------------|---------|
| `README.md` | Front door; "getting started" + auto-generated structure |
| `AI_CONTEXT.md` | **Single source of truth** all AI tools read |
| `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules/`, `.cursorrules` | Thin per-tool configs that point to `AI_CONTEXT.md` |
| `.gitignore`, `.gitattributes` | Keep secrets/build junk out; normalize line endings |
| `.editorconfig` | Consistent whitespace across editors/people |
| `.env.example` | Template for secrets; real `.env` is gitignored |
| `.vscode/` | Recommended extensions + sample shared settings |
| `CONTRIBUTING.md` | Team Git workflow, commit style, responsible AI use |
| `docs/` | `architecture.md`, `setup.md`, `decisions/` (ADRs), `CHANGELOG.md` |
| `scripts/setup.sh` | One-time setup (enables hooks) |
| `scripts/check-docs.sh` | Friendly "update your docs" reminder (never blocks) |
| `scripts/update-structure.sh` | Regenerates the README structure tree |
| `.githooks/pre-push` | Runs the docs reminder before you push |
| `.github/workflows/ci.yml` | Light CI: auto-detects stack, runs tests + docs check |
| `.github/pull_request_template.md`, `ISSUE_TEMPLATE/` | Consistent PRs and issues |
| `stack-appendices/` | Per-stack setup notes (delete after use) |

## Appendix B — Troubleshooting

- **`./scripts/setup.sh` won't run (Windows):** use **Git Bash**, not PowerShell,
  or run `bash scripts/setup.sh`.
- **`permission denied` on a script:** run `chmod +x scripts/*.sh`.
- **The docs reminder never appears:** it only warns when a commit changes code
  but no docs — that's expected. Test it by committing a code file alone.
- **CI shows nothing for my stack:** the template auto-detects Node and Python.
  For other stacks, see `stack-appendices/other.md`.
- **Mermaid diagram doesn't render:** check the code fence says ```` ```mermaid ````
  and view the file on GitHub (not every local previewer renders it).

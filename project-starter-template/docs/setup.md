# Full Setup Guide

Everything a new teammate (or your grader) needs to run the project from scratch.
Keep this accurate — test it by following it on a clean machine when you can.

## Prerequisites

- Git
- _TODO: runtime, e.g. Node 20+, Python 3.12+_
- _TODO: database, if any_
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

# 4. Install dependencies
# TODO: e.g. npm install  /  python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# 5. Database setup (if any)
# TODO: migrations / seed

# 6. Run
# TODO: e.g. npm run dev  /  uvicorn app.main:app --reload

# 7. Run tests
# TODO: e.g. npm test  /  pytest
```

## Troubleshooting

_Add problems and fixes as you hit them, so teammates don't lose an hour to the
same issue._

- **Problem:** _TODO_
  **Fix:** _TODO_

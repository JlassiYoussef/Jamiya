# Appendix: Python (backend / data / ML)

## 1. Virtual environment + dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install --upgrade pip
```

Track dependencies in `requirements.txt` (CI installs from it automatically):

```bash
pip install fastapi uvicorn      # example
pip freeze > requirements.txt
```

The root `.gitignore` already covers `.venv/`, `__pycache__/`, caches, etc.

## 2. Formatting + linting (recommended)

```bash
pip install ruff
ruff check .         # lint
ruff format .        # format
pip freeze > requirements.txt
```

## 3. Tests

```bash
pip install pytest
# put tests in tests/ as test_*.py
pytest
pip freeze > requirements.txt
```

CI runs `pytest` automatically once it's installed and you have tests.

## 4. Data / model files

Large datasets and model weights usually should **not** go in git. Uncomment the
relevant lines in `.gitignore` (e.g. `*.csv`, `models/`, `data/raw/`) and note in
`docs/setup.md` where teammates get the data instead.

## 5. Fill in the AI context + record the decision

Set real install/run/test commands in `AI_CONTEXT.md` and `CLAUDE.md`, and add an
ADR (`docs/decisions/`) for your framework choice.

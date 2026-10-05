# Appendix: Node / JavaScript / TypeScript

## 1. Initialize

```bash
npm init -y
# or scaffold a framework, e.g.:
# npm create vite@latest
```

The root `.gitignore` already covers `node_modules/`, `dist/`, `.next/`, etc.

## 2. Formatting + linting (recommended)

```bash
npm install --save-dev prettier eslint
npx eslint --init     # answer the prompts for your framework
```

Add scripts to `package.json`:

```jsonc
{
  "scripts": {
    "dev": "...",                    // your run command
    "test": "vitest run",            // or "jest", "node --test", etc.
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## 3. Tests

Pick one: [Vitest](https://vitest.dev) (great with Vite), Jest, or Node's
built-in `node --test`. Put tests in `tests/` or next to source as `*.test.ts`.
The `test` script above is what CI runs automatically (`npm test --if-present`).

## 4. Fill in the AI context

In `AI_CONTEXT.md` and `CLAUDE.md`, set your real install/run/test commands and
the exact framework + version. This makes every AI suggestion sharper.

## 5. Record the decision

Add an ADR (`docs/decisions/`) noting which framework you chose and why.

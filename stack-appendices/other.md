# Appendix: Mobile, Java/Kotlin, and other stacks

The root `.gitignore` already has sections for Java/Gradle, Android, iOS/Swift,
and Flutter/Dart. Keep the section you need, delete the rest.

## Flutter

```bash
flutter create .
flutter test        # CI note below
```

## Android (Gradle)

Keep the `Java / Kotlin / Android` block in `.gitignore`. Tests run with
`./gradlew test`.

## iOS / Swift

Keep the `iOS / Swift / macOS` block. Use Xcode's test navigator or `xcodebuild test`.

## Making CI run your tests

The provided `.github/workflows/ci.yml` auto-detects Node and Python. For other
stacks, add a job that installs your toolchain and runs your test command. Ask
your AI assistant: *"Add a GitHub Actions job to this ci.yml that runs Flutter
tests"* — then read and understand what it generates before committing.

## Always do these three

1. Fill in real install/run/test commands in `AI_CONTEXT.md` and `CLAUDE.md`.
2. Add an ADR in `docs/decisions/` for your framework choice.
3. Confirm no build output or secrets are being committed (`git status`).

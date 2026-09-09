# portfolio-site / web runtime verification

CapturedAt: 2026-09-09T07:32:31.790268Z
Producer: Codex local command runner; maintainer: jimin.
Subject: isolated source copy, not a clean Git commit or remote CI result.
Source: [complete runtime/test/config input manifest](runtime-source-manifest.json), SHA-256 `3af8f7597b53bd3c837df741f9fe6ebd96b7c811d56faf8692892f6a30787901`.
Environment: macOS, Node 24.20.0, pnpm 11.24.0; Flutter runtimes use SDK 3.44.3.
Command: `CI=1 pnpm install --frozen-lockfile` followed by `CI=1 pnpm standard:check` from the app root.
Nested installations and code generation follow app.contract.json and the adoption report.
Result: complete app command exit code 0; all four declared roles for this runtime completed.
Runtime: `.`, vite 7.3.6.

- lint: `pnpm run lint`
- typecheck: `pnpm run typecheck`
- test: `pnpm run test`
- build: `pnpm run build`

Execution log: `/tmp/adoption-clean-portfolio-site.log`; SHA-256 `038d87dbb60b9bd928988616595711540acce28b5f45f66d23d012e777c1f7c3`.
The temporary execution log is not a permanent remote artifact. This record captures the observed result and input digest.
See [adoption verification](../standard-adoption.md) for skipped environment-dependent tests.
No real-device, provider, production database, repository protection or usability-study claim is made.
The app quality acceptance stays pending until its other evidence requirements are met.

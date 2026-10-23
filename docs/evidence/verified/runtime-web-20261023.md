# portfolio-site / web runtime verification (Vite 8.3.4)

CapturedAt: 2026-10-23T07:11:08Z
Producer: Claude Code agent session (local command runner on the development Mac mac-dev); maintainer: jimin.
Subject: Git commit `90fb0e0de976ac9b52dcf1229013ea7f640a32d8` on `main`, runtime sources unmodified in the working tree.
The next commit `44d409e` (2026-10-23T07:13:38Z) changed only `AGENTS.md` and one QA document, so the runtime sources are identical at that head.
Environment: macOS (Darwin 27.0.0), Node 24.20.0, pnpm 11.24.0. Existing `node_modules` were used without reinstalling;
the resolved framework was `vite` 8.3.4 (`vite v8.3.4 building client environment for production` in the build output),
and `pnpm install --frozen-lockfile --lockfile-only --offline` exited 0 against the committed `pnpm-lock.yaml`.
Runtime: `.` (app.contract.json `runtimes[web]`, framework vite, frameworkVersion 8.3.4). The binding declares no prepare command.

Commands were run one at a time from the runtime root with the exact argv declared in `binding.checks`.

| Role | Command | Started (UTC) | Duration | Exit code | Result |
| --- | --- | --- | --- | --- | --- |
| typecheck | `pnpm run typecheck` | 2026-10-23T07:11:01Z | 2s | 0 | i18n sync check 0 differences; HJM typecheck and `tsc --noEmit -p tsconfig.node.json` passed |
| test | `pnpm run test` | 2026-10-23T07:11:03Z | <1s | 0 | node:test 25 tests, 25 pass, 0 fail, 0 skipped |
| build | `pnpm run build` | 2026-10-23T07:11:07Z | 1s | 0 | policy snapshot verified, `tsc -b`, `vite build` (1907 modules, `dist/assets/index-CY3zTQFg.js`, `dist/assets/index-Clt8FP8E.css`), locale pages generated |

Result: all three declared roles for this runtime completed with exit code 0.
Observed warnings (not failures): Vite reports that `vite.config.ts` imports `./src/i18n/ko` without a file extension, which the
future native config loader will not support, and that the main chunk exceeds 500 kB after minification.
`policy:check:snapshot` verifies the stored public snapshot only; Hub freshness was not checked.

Scope: this verifies type checking, the declared unit tests and a local production build of the web bundle.
It does not verify deployment, the public site bytes, DNS/TLS, browser rendering or usability.
The earlier record [runtime-web.md](runtime-web.md) (2026-09-09) is kept as history for the previous toolchain.

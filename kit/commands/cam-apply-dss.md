Apply the cam design system to this project: the shared shadcn preset, the
Saans font, and the deterministic lint/hook guards from
[eduardocaminha/cam-dss](https://github.com/eduardocaminha/cam-dss).

Source of truth: cam-dss's `PRESET.md` (canonical preset code) and `kit/`
(`eslint-cam-dss.mjs`, `pre-commit-check.sh`).

## Step 1: preset

Read the canonical preset code from
`https://raw.githubusercontent.com/eduardocaminha/cam-dss/main/PRESET.md`.

- **New project, no `components.json` yet:**
  `pnpm dlx shadcn@latest init --preset <code>`
- **Existing shadcn project:** follow the shadcn skill's preset-switching
  rule - ask the operator reinstall / merge / skip, then run
  `pnpm dlx shadcn@latest apply <code>` with the matching flag.

## Step 2: Saans font

```bash
pnpm dlx shadcn@latest add "eduardocaminha/cam-dss/font-saans#<tag>"
```

This installs `app/font-saans.css` only - the licensed font binary is not
distributed publicly. Sync the binary separately: copy
`scripts/sync-font.mjs` from cam-dss into this project (or run it directly
from a sibling cam-dss checkout) and execute it. It copies
`SaansVF.woff2` from the private `eduardocaminha/cam-profile` repo into
`public/fonts/`. Add `/public/fonts/SaansVF.woff2` to `.gitignore` -
never commit the binary.

## Step 3: lint guards + pre-commit hook

1. Copy `kit/eslint-cam-dss.mjs` from cam-dss into this project.
2. In the project's `eslint.config.mjs`, import `camDssRules` and spread it
   into a `no-restricted-syntax` rule, scoped to the project's own source
   files only - never to `components/ui` or other vendored shadcn code.
3. Copy `kit/pre-commit-check.sh` into `.claude/hooks/pre-commit-check.sh`.
4. Register the `PreToolUse` hook in `.claude/settings.json`. If the
   project already has hooks configured, prefer `cam init --merge`
   (deep-merges `settings.json`, unions arrays, backs up to
   `.claude/.backup-<stamp>/`) over hand-editing.

## Step 4: verify

Run `pnpm typecheck && pnpm lint && pnpm build` before committing.

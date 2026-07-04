# Canonical preset

The current design system preset, resolved from this project via `pnpm preset:resolve`.

| Dimension | Value |
|---|---|
| code | `b2fA` |
| style | nova |
| baseColor | neutral |
| theme | neutral |
| chartColor | neutral |
| iconLibrary | lucide |
| font | geist |
| fontHeading | inherit |
| radius | default |
| menuAccent | subtle |
| menuColor | default |

URL: https://ui.shadcn.com/create?preset=b2fA

Base (not encoded in the preset code, set separately in `components.json`): `base`.

Last updated: 2026-07-04 (initial scaffold defaults, not yet customized).

## Editing loop

1. `pnpm preset:open` (or open the URL above) to load the current preset in the official builder.
2. Edit any of the 10 catalog dimensions (style, colors, fonts, icon library, radius, menu accent/color).
3. Copy the new preset code from the builder.
4. `pnpm dlx shadcn@latest apply <code>` to reinstall components with the new combo. This is always safe: `components/ui` never carries local edits (catalog-first regime), so reinstalling never loses work.
5. Check `/components` and `/blocks` in the dev server, in both light and dark mode.
6. `pnpm preset:resolve` and update the table above with the new code, dimensions, and today's date.
7. Commit with a message describing what changed (e.g. `feat: switch preset to <style>/<radius>`).

Never decode a preset code by hand - `pnpm dlx shadcn@latest preset decode <code>` is the only supported way to inspect one.

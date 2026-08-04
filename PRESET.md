# Canonical preset

The current design system preset, resolved from this project via `pnpm preset:resolve`.

| Dimension | Value |
|---|---|
| code | `beEgoHMO` |
| style | luma |
| baseColor | zinc |
| theme | zinc |
| chartColor | zinc |
| iconLibrary | lucide |
| font | geist-mono (misreported, see caveat below - actual fonts are Saans + Saans Semi Mono) |
| fontHeading | inherit |
| radius | default |
| menuAccent | subtle |
| menuColor | default |

URL: https://ui.shadcn.com/create?preset=beEgoHMO

Base (not encoded in the preset code, set separately in `components.json`): `base`.

Last updated: 2026-08-04 (style switched to luma for the stats dashboard tab;
base color, theme and chart color all moved to zinc together, which the
registry requires of achromatic values; mono font dogfooded to Saans Semi
Mono).

**Caveat - font detection is unreliable after the Saans dogfood:** `preset resolve`/`preset:open` infer the `font`/`fontHeading` dimensions by scanning the codebase for `next/font/google` imports. Both faces are applied via `font-saans.css` (plain CSS `@font-face`: Saans variable as `--font-sans`, Saans Semi Mono static cuts as `--font-mono`, which luma also uses for headings) rather than the catalog mechanism, so the resolver never sees them. It reports `geist-mono` instead, the one real `next/font/google` import left in `app/layout.tsx` for code blocks. The style/baseColor/theme/chartColor/iconLibrary/radius dimensions still round-trip correctly; font specifically does not reflect reality for this project. Saans Mono (strict monospace) also lives in `public/fonts`, used only for dashboard card titles.

## Editing loop

**Preferred: the in-app theme menu.** Click the palette icon in the header
(`components/dss/theme-menu.tsx`) and pick a value per dimension - each
change runs a real `shadcn apply` via a Server Action
(`lib/theme-actions.ts`) and reflects within a few seconds (hard-reload the
page, since root-layout `next/font` changes don't hot-reload through Fast
Refresh). It also auto-restores the Saans font dogfood after every apply
and handles the achromatic baseColor/theme/chartColor cross-validation.
See `CLAUDE.md` § Theme menu for what it does under the hood. After
settling on a combo you like, still do steps 6-7 below manually (this
tool does not touch PRESET.md or commit).

**Manual / exploring in the official builder:**

1. `pnpm preset:open` (or open the URL above) to load the current preset in the official builder.
2. Edit any of the 10 catalog dimensions (style, colors, fonts, icon library, radius, menu accent/color).
3. Copy the new preset code from the builder.
4. `pnpm dlx shadcn@latest apply <code>` to reinstall components with the new combo. This is always safe for `components/ui` (catalog-first regime, no local edits there). It also rewrites `app/layout.tsx` and re-adds the catalog font (Geist) import, reverting the Saans dogfooding - re-apply the Saans font swap (drop the Geist import, import `./font-saans.css`, keep `font-sans` on the html className) after every `apply`.
5. Check `/components` and `/blocks` in the dev server, in both light and dark mode.
6. `pnpm preset:resolve` and update the table above with the new code, dimensions, and today's date.
7. Commit with a message describing what changed (e.g. `feat: switch preset to <style>/<radius>`).

Never decode a preset code by hand - `pnpm dlx shadcn@latest preset decode <code>` is the only supported way to inspect one.

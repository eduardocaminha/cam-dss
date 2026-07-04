# Canonical preset

The current design system preset, resolved from this project via `pnpm preset:resolve`.

| Dimension | Value |
|---|---|
| code | `b2vg` |
| style | nova |
| baseColor | neutral |
| theme | neutral |
| chartColor | neutral |
| iconLibrary | lucide |
| font | geist-mono (misreported, see caveat below - actual body font is Saans) |
| fontHeading | inherit |
| radius | default |
| menuAccent | subtle |
| menuColor | default |

URL: https://ui.shadcn.com/create?preset=b2vg

Base (not encoded in the preset code, set separately in `components.json`): `base`.

Last updated: 2026-07-04 (initial scaffold defaults, not yet customized).

**Caveat - font detection is unreliable after the Saans dogfood:** `preset resolve`/`preset:open` infer the `font`/`fontHeading` dimensions by scanning the codebase for `next/font/google` imports. Since Saans is applied via `font-saans.css` (a plain CSS `@font-face`, not a `next/font` import) rather than the catalog mechanism, the resolver can't see it - it instead picks up `Geist_Mono` (kept in `app/layout.tsx` for code blocks) and misreports it as the primary font. Verified end-to-end: opening `https://ui.shadcn.com/create?preset=b2vg` in a real browser does load this project's actual style/baseColor/theme/chartColor/iconLibrary/radius correctly, but shows "Geist Mono" for both Heading and Font instead of Saans. Round-trip works; font dimension specifically does not reflect reality for this project.

## Editing loop

1. `pnpm preset:open` (or open the URL above) to load the current preset in the official builder.
2. Edit any of the 10 catalog dimensions (style, colors, fonts, icon library, radius, menu accent/color).
3. Copy the new preset code from the builder.
4. `pnpm dlx shadcn@latest apply <code>` to reinstall components with the new combo. This is always safe for `components/ui` (catalog-first regime, no local edits there). It also rewrites `app/layout.tsx` and re-adds the catalog font (Geist) import, reverting the Saans dogfooding - re-apply the Saans font swap (drop the Geist import, import `./font-saans.css`, keep `font-sans` on the html className) after every `apply`.
5. Check `/components` and `/blocks` in the dev server, in both light and dark mode.
6. `pnpm preset:resolve` and update the table above with the new code, dimensions, and today's date.
7. Commit with a message describing what changed (e.g. `feat: switch preset to <style>/<radius>`).

Never decode a preset code by hand - `pnpm dlx shadcn@latest preset decode <code>` is the only supported way to inspect one.

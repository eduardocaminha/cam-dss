# CLAUDE.md - cam-dss

Personal shadcn/ui design system. See `README.md` for structure and
`PRESET.md` for the theme-editing loop.

## Non-negotiables

- Shadcn faithful: stock components only, Base UI primitives, no custom
  variants or forks. If a stock file has a lint/type issue, that is upstream
  behavior - do not edit the file to silence it; exclude the path from the
  relevant tool instead (see below).
- Catalog-first theming: edits to the design system stay within the 10
  preset dimensions (style, baseColor, theme, chartColor, iconLibrary, font,
  fontHeading, radius, menuAccent, menuColor). `components/ui` never carries
  local edits - a preset change is always a reinstall (`shadcn apply`).

## Known gaps

- `message` and `message-scroller` are excluded from the `/components`
  gallery: their `-example` registry items require `@ai-sdk/react` plus
  `@/lib/ai` and `@/components/message-parts`, which the registry does not
  declare or provide. The `message`/`bubble` ui primitives are still
  installed under `components/ui`.
- The calendar example (`components/calendar-example.tsx` ->
  `components/ui/calendar.tsx`, stock react-day-picker) throws a hydration
  mismatch warning in the browser console on `/components`: the server
  renders the month dropdown label in one locale format (e.g. "Jan") and
  the client re-renders it in another (e.g. "jan."), because `Intl`
  resolves a different locale server-side (Node process) vs client-side
  (browser). Non-fatal - React regenerates that subtree and the page
  still works - and entirely inside stock code, so not something to patch
  here.
- `public/avatars/shadcn.jpg` is a generated placeholder (flat gray
  square), not a real photo. Several stock blocks (dashboard-01,
  sidebar-07/08/09/12/15/16) hardcode this path and the registry never
  ships an actual image for it.
- Every page logs a console warning on first load: "Encountered a script
  tag while rendering React component", pointing at `next-themes`'
  `ThemeProvider` (`components/theme-provider.tsx`). `next-themes` injects
  an inline `<script>` via `React.createElement` to set the theme class
  before hydration (avoids a flash of the wrong theme); React 19 warns on
  any `<script>` rendered inside a component. Confirmed false positive -
  the script still runs correctly and dark mode works - tracked upstream:
  [shadcn-ui/ui#10104](https://github.com/shadcn-ui/ui/issues/10104),
  [pacocoursey/next-themes#387](https://github.com/pacocoursey/next-themes/issues/387).
  Not patched here: silencing it would require either filtering
  `console.error` (masks real errors) or replacing `next-themes`, neither
  warranted for a dev-only cosmetic warning.

## Theme menu

The header's palette-icon menu (`components/dss/theme-menu.tsx` +
`lib/theme-actions.ts`) edits the 10 preset dimensions live: every change
runs `shadcn apply <code> -y` for real via a Server Action, then `git
checkout -- app/layout.tsx` to restore the Saans dogfood (`apply` always
reintroduces the catalog Geist font there). This only works because
`app/layout.tsx`'s dogfooded state is always the one committed at HEAD -
never leave a pending edit to that file uncommitted.

Two things verified the hard way, both handled in `lib/theme-actions.ts`:

- **Achromatic cross-field validation.** `theme`/`chartColor` share an
  achromatic subset with `baseColor` (neutral/stone/zinc/gray/mauve/
  olive/mist/taupe). If either is set to one of these values, it must
  equal `baseColor` exactly - the registry rejects mismatches (e.g.
  `baseColor=stone` + `theme=neutral` → 400 "Theme 'neutral' is not
  available for base color 'stone'"). A colored value (blue, red, ...) is
  always independently valid. The action cascades whichever of the three
  changes into the other two when they're currently achromatic, mirroring
  the official create builder.
- **`apply` has file writes that land after its own process resolves.**
  Confirmed by observation: a heavy changeset (e.g. a style switch
  touching 48 files) can still show the reverted `app/layout.tsx` diff
  right after the checkout ran and returned successfully - some write
  lands slightly later and clobbers it again. The action retries the
  checkout (up to 5x, 200ms apart) until `git diff --quiet` confirms the
  file is actually clean.

Also: root-layout `next/font` changes don't hot-reload through Fast
Refresh - after any theme change, a hard page reload (not just waiting
for HMR) is needed to see the correct font/style reflected.

## Tooling scope

Stock/vendored code is excluded from project-specific lint rules and,
where it fails upstream, from lint entirely:
`components/ui`, `components/*-example.tsx` + `components/example.tsx`,
`components/blocks/**`, `hooks/**`, `app/b/**`. Only code under
`app/(app)`, `components/dss`, `lib`, and `scripts` is held to this
project's own rules.

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

## Tooling scope

Stock/vendored code is excluded from project-specific lint rules and,
where it fails upstream, from lint entirely:
`components/ui`, `components/*-example.tsx` + `components/example.tsx`,
`components/blocks/**`, `hooks/**`, `app/b/**`. Only code under
`app/(app)`, `components/dss`, `lib`, and `scripts` is held to this
project's own rules.

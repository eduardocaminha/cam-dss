# cam-dss

Personal shadcn/ui design system: a local Next.js app that renders every stock
component and block so the theme (tokens, not components) can be edited in
batch, previewed, and turned into a shareable preset.

## Principles

- Shadcn faithful. Components are stock, unmodified, Base UI primitives. No
  custom variants.
- Catalog-first theming. Edits stay within the 10 dimensions the official
  preset system encodes (style, colors, fonts, icon library, radius, menu
  accent/color). See `PRESET.md` for the current preset and the edit loop.
- `components/ui` never carries local edits - swapping the preset always
  reinstalls safely.

## Structure

- `app/(app)` - the two-tab shell (`/components`, `/blocks`).
- `app/b/<block>` - each installed block, fullscreen, no shell chrome.
- `components/ui` - stock shadcn components (`shadcn add --all`).
- `components/*-example.tsx` - stock registry example items, one per
  component, rendered on `/components`.
- `components/blocks/<block>` - stock block components, namespaced per block
  to avoid filename collisions (see `scripts/add-block.mjs`).
- `components/dss` - the app's own glue code (nav, block card).
- `lib/blocks.ts` - the 27-block manifest grouped by family.

## Commands

```bash
pnpm dev                 # run the app
pnpm typecheck
pnpm lint
pnpm preset:resolve       # print this project's current preset code
pnpm preset:open <code>   # open a preset code in the official builder
pnpm registry:validate    # validate registry.json
```

See `PRESET.md` for the full theme-editing loop.

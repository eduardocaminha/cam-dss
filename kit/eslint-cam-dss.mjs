// Deterministic drift guards for the cam design system: className regex
// rules over Literal/TemplateElement, enforced via ESLint's
// no-restricted-syntax. Shared between this repo's own eslint.config.mjs
// and the kit distributed to consumer projects (kit/commands/cam-apply-dss.md).
//
// These catch what a linter can prove mechanically. Contextual drift
// (wrong primitive, composition patterns) is not machine-checkable and
// stays a human/agent review concern.

const COLORS =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
const COLOR_UTILITIES =
  "bg|text|border|ring|fill|stroke|from|via|to|divide|outline|decoration|accent|caret|shadow"

function classNameRule(pattern, message) {
  return [
    { selector: `Literal[value=/${pattern}/]`, message },
    { selector: `TemplateElement[value.raw=/${pattern}/]`, message },
  ]
}

export const camDssRules = [
  ...classNameRule(
    `(${COLOR_UTILITIES})-\\[(#|rgb|hsl|oklch)`,
    "cam-dss: raw color value in an arbitrary class. Use a semantic token (bg-primary, text-muted-foreground, etc)."
  ),
  ...classNameRule(
    `(${COLOR_UTILITIES})-(${COLORS})-[0-9]{2,3}`,
    "cam-dss: raw Tailwind palette color. Use a semantic token (bg-primary, text-muted-foreground, etc)."
  ),
  ...classNameRule(
    "(^|\\s)space-[xy]-",
    "cam-dss: space-x-*/space-y-* is banned. Use flex/grid with gap-*."
  ),
  ...classNameRule(
    `dark:(${COLOR_UTILITIES})-`,
    "cam-dss: manual dark: color override. Semantic tokens already flip in dark mode."
  ),
  ...classNameRule(
    "(^|\\s)(text|bg)-(white|black)(?![a-zA-Z0-9-])",
    "cam-dss: text-white/bg-black/text-black/bg-white is banned. Use a semantic token."
  ),
]

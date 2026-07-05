import fs from "node:fs"
import path from "node:path"

export type CssColorToken = {
  name: string
  light: string
  dark: string
}

export type CssRadiusStep = {
  name: string
  className: string
}

export const RADIUS_STEPS: CssRadiusStep[] = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
  { name: "2xl", className: "rounded-2xl" },
  { name: "3xl", className: "rounded-3xl" },
  { name: "4xl", className: "rounded-4xl" },
]

export type CssSpacingStep = {
  multiplier: number
  className: string
  value: string
}

/**
 * className is a full literal string (not built via template string)
 * because Tailwind's scanner only generates utilities for class names
 * it finds as complete text in a scanned file - a computed `w-${n}`
 * never appears in source as a whole token, so it would silently
 * produce no CSS.
 */
const SPACING_STEPS: { multiplier: number; className: string }[] = [
  { multiplier: 1, className: "w-1" },
  { multiplier: 2, className: "w-2" },
  { multiplier: 3, className: "w-3" },
  { multiplier: 4, className: "w-4" },
  { multiplier: 6, className: "w-6" },
  { multiplier: 8, className: "w-8" },
  { multiplier: 12, className: "w-12" },
  { multiplier: 16, className: "w-16" },
  { multiplier: 24, className: "w-24" },
]

export type CssFontToken = {
  name: string
  className: string
  value: string
}

/**
 * Brace-matched (not regex-only) block extraction, since a naive
 * greedy/non-greedy regex between "selector {" and the next "}" breaks
 * as soon as a later block appears in the same file.
 */
function extractBlock(source: string, selector: string): string {
  const start = source.indexOf(`${selector} {`)
  if (start === -1) return ""

  const braceStart = source.indexOf("{", start)
  let depth = 0
  let i = braceStart
  for (; i < source.length; i++) {
    if (source[i] === "{") depth++
    if (source[i] === "}") {
      depth--
      if (depth === 0) break
    }
  }
  return source.slice(braceStart + 1, i)
}

function extractVars(block: string): Map<string, string> {
  const map = new Map<string, string>()
  const re = /--([a-zA-Z0-9-]+):\s*([^;]+);/g
  let match: RegExpExecArray | null
  while ((match = re.exec(block))) {
    map.set(match[1], match[2].trim())
  }
  return map
}

/**
 * Tailwind v4's own default --spacing, from the tailwindcss package's
 * theme.css - this project's globals.css never overrides it, so the
 * real base unit lives in the dependency, not here. Not read from disk
 * at request time: tailwindcss doesn't declare "./theme.css" in its
 * package.json "exports", so plain Node `require.resolve` finds it but
 * Turbopack's server bundler refuses to - confirmed by hitting
 * "could not resolve tailwindcss/theme.css into a module" in dev.
 * Verified once by hand (installed tailwindcss@4.3.2/theme.css) instead.
 */
const TAILWIND_DEFAULT_SPACING = "0.25rem"

function remToNumber(value: string): number {
  const match = /([\d.]+)rem/.exec(value)
  return match ? parseFloat(match[1]) : 0
}

/**
 * Parses app/globals.css's :root/.dark blocks - the same file the
 * theme menu's Server Actions mutate via `shadcn apply` - so the
 * /tokens tab always reflects whatever preset is currently applied,
 * never a hand-maintained snapshot.
 */
export function getCssTokens(): {
  colors: CssColorToken[]
  radiusBase: string
  spacing: { base: string; steps: CssSpacingStep[] }
  fonts: CssFontToken[]
} {
  const filePath = path.join(process.cwd(), "app/globals.css")
  const source = fs.readFileSync(filePath, "utf8")

  const lightVars = extractVars(extractBlock(source, ":root"))
  const darkVars = extractVars(extractBlock(source, ".dark"))
  const themeVars = extractVars(extractBlock(source, "@theme inline"))

  const colors: CssColorToken[] = []
  for (const [name, light] of lightVars) {
    if (name === "radius") continue
    colors.push({ name, light, dark: darkVars.get(name) ?? light })
  }

  const spacingBaseRem = remToNumber(TAILWIND_DEFAULT_SPACING)
  const spacing = {
    base: TAILWIND_DEFAULT_SPACING,
    steps: SPACING_STEPS.map((step) => ({
      ...step,
      value: `${spacingBaseRem * step.multiplier}rem`,
    })),
  }

  const saansPath = path.join(process.cwd(), "app/font-saans.css")
  const saansVars = extractVars(
    extractBlock(fs.readFileSync(saansPath, "utf8"), ":root")
  )
  const fontSans = saansVars.get("font-sans") ?? ""

  const fonts: CssFontToken[] = [
    { name: "--font-sans", className: "font-sans", value: fontSans },
    {
      name: "--font-heading",
      className: "font-heading",
      value: `${themeVars.get("font-heading") ?? ""} → ${fontSans}`,
    },
    {
      name: "--font-mono",
      className: "font-mono",
      value: "Geist Mono (next/font/google, set on <html> in app/layout.tsx)",
    },
  ]

  return { colors, radiusBase: lightVars.get("radius") ?? "", spacing, fonts }
}

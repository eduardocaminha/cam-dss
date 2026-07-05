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
 * Parses app/globals.css's :root/.dark blocks - the same file the
 * theme menu's Server Actions mutate via `shadcn apply` - so the
 * /tokens tab always reflects whatever preset is currently applied,
 * never a hand-maintained snapshot.
 */
export function getCssTokens(): {
  colors: CssColorToken[]
  radiusBase: string
} {
  const filePath = path.join(process.cwd(), "app/globals.css")
  const source = fs.readFileSync(filePath, "utf8")

  const lightVars = extractVars(extractBlock(source, ":root"))
  const darkVars = extractVars(extractBlock(source, ".dark"))

  const colors: CssColorToken[] = []
  for (const [name, light] of lightVars) {
    if (name === "radius") continue
    colors.push({ name, light, dark: darkVars.get(name) ?? light })
  }

  return { colors, radiusBase: lightVars.get("radius") ?? "" }
}

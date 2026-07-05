// The 10 shadcn preset dimensions and their valid values, imported
// straight from the installed shadcn/preset package - not scraped, not
// hand-maintained, always in sync with the installed CLI version.
import {
  PRESET_BASE_COLORS,
  PRESET_CHART_COLORS,
  PRESET_FONT_HEADINGS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRESET_STYLES,
  PRESET_THEMES,
  type PresetConfig,
} from "shadcn/preset"

export type ThemeDimension = {
  key: keyof PresetConfig
  label: string
  values: readonly string[]
}

export const themeDimensions: ThemeDimension[] = [
  { key: "style", label: "Style", values: PRESET_STYLES },
  { key: "baseColor", label: "Base Color", values: PRESET_BASE_COLORS },
  { key: "theme", label: "Theme", values: PRESET_THEMES },
  { key: "chartColor", label: "Chart Color", values: PRESET_CHART_COLORS },
  { key: "iconLibrary", label: "Icon Library", values: PRESET_ICON_LIBRARIES },
  { key: "font", label: "Font", values: PRESET_FONTS },
  { key: "fontHeading", label: "Heading", values: PRESET_FONT_HEADINGS },
  { key: "radius", label: "Radius", values: PRESET_RADII },
  { key: "menuAccent", label: "Menu Accent", values: PRESET_MENU_ACCENTS },
  { key: "menuColor", label: "Menu Color", values: PRESET_MENU_COLORS },
]

const VALUE_OVERRIDES: Record<string, string> = {
  hugeicons: "HugeIcons",
  remixicon: "Remix Icon",
  "dm-sans": "DM Sans",
  "jetbrains-mono": "JetBrains Mono",
}

const WORD_OVERRIDES: Record<string, string> = {
  ibm: "IBM",
  eb: "EB",
}

export function formatSlug(slug: string): string {
  if (VALUE_OVERRIDES[slug]) return VALUE_OVERRIDES[slug]

  return slug
    .split("-")
    .map((word) => WORD_OVERRIDES[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Reference data for the 10 shadcn preset dimensions and their possible
// values, verified directly against ui.shadcn.com/create (not guessed).
// "current" mirrors PRESET.md - update both together after a preset change.

export type ThemeDimension = {
  key: string
  label: string
  current: string
  values: string[]
}

const COLOR_PALETTE = [
  "Neutral",
  "Amber",
  "Blue",
  "Cyan",
  "Emerald",
  "Fuchsia",
  "Green",
  "Indigo",
  "Lime",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Rose",
  "Sky",
  "Teal",
  "Violet",
  "Yellow",
]

const FONT_CATALOG = [
  "Geist",
  "Inter",
  "Noto Sans",
  "Nunito Sans",
  "Figtree",
  "Roboto",
  "Raleway",
  "DM Sans",
  "Public Sans",
  "Outfit",
  "Oxanium",
  "Manrope",
  "Space Grotesk",
  "Montserrat",
  "IBM Plex Sans",
  "Source Sans 3",
  "Instrument Sans",
  "Geist Mono",
  "JetBrains Mono",
  "Noto Serif",
  "Roboto Slab",
  "Merriweather",
  "Lora",
  "Playfair Display",
  "EB Garamond",
  "Instrument Serif",
]

export const themeDimensions: ThemeDimension[] = [
  {
    key: "style",
    label: "Style",
    current: "Nova",
    values: ["Vega", "Nova", "Maia", "Lyra", "Mira", "Luma", "Sera", "Rhea"],
  },
  {
    key: "baseColor",
    label: "Base Color",
    current: "Neutral",
    values: ["Neutral", "Stone", "Zinc", "Mauve", "Olive", "Mist", "Taupe"],
  },
  {
    key: "theme",
    label: "Theme",
    current: "Neutral",
    values: COLOR_PALETTE,
  },
  {
    key: "chartColor",
    label: "Chart Color",
    current: "Neutral",
    values: COLOR_PALETTE,
  },
  {
    key: "fontHeading",
    label: "Heading",
    current: "Saans (dogfooded - see PRESET.md caveat)",
    values: FONT_CATALOG,
  },
  {
    key: "font",
    label: "Font",
    current: "Saans (dogfooded - see PRESET.md caveat)",
    values: FONT_CATALOG,
  },
  {
    key: "iconLibrary",
    label: "Icon Library",
    current: "Lucide",
    values: ["Lucide", "Tabler Icons", "HugeIcons", "Phosphor Icons", "Remix Icon"],
  },
  {
    key: "radius",
    label: "Radius",
    current: "Default",
    values: ["None", "Small", "Default", "Medium", "Large"],
  },
  {
    key: "menuColor",
    label: "Menu Color",
    current: "Default",
    values: ["Default", "Inverted"],
  },
  {
    key: "menuAccent",
    label: "Menu Accent",
    current: "Subtle",
    values: ["Subtle", "Bold"],
  },
]

"use server"

import { execFile } from "node:child_process"
import { promisify } from "node:util"

import { PRESET_BASE_COLORS, encodePreset, type PresetConfig } from "shadcn/preset"

const execFileAsync = promisify(execFile)
const SHADCN_BIN = "node_modules/.bin/shadcn"

// theme/chartColor share an "achromatic" subset with baseColor (the same
// grayscale family: neutral/stone/zinc/gray/mauve/olive/mist/taupe).
// Verified against the registry: when theme/chartColor is set to one of
// these values, it must equal baseColor exactly, e.g. baseColor=stone +
// theme=neutral is rejected ("Theme 'neutral' is not available for base
// color 'stone'"). A colored value (blue, red, ...) is always valid
// regardless of baseColor. So changing baseColor must cascade into
// theme/chartColor whenever they're currently achromatic - mirroring
// what the official create builder does.
const ACHROMATIC_VALUES = new Set<string>(PRESET_BASE_COLORS)

// Serializes apply calls server-side, on top of the client disabling the
// menu while a request is in flight - defense in depth against two
// concurrent `shadcn apply` runs racing on the same files.
let queue: Promise<unknown> = Promise.resolve()
function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(fn, fn)
  queue = result.then(
    () => undefined,
    () => undefined
  )
  return result
}

function errorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const withStreams = err as { stderr?: string; message?: string }
    if (withStreams.stderr) return withStreams.stderr.trim()
    if (withStreams.message) return withStreams.message
  }
  return String(err)
}

export async function getCurrentTheme(): Promise<{
  code: string
  values: PresetConfig
}> {
  const { stdout } = await execFileAsync(SHADCN_BIN, [
    "preset",
    "resolve",
    "--json",
  ])
  const parsed = JSON.parse(stdout)
  return { code: parsed.code, values: parsed.values }
}

export type ApplyThemeResult =
  | { success: true; code: string; values: PresetConfig }
  | { success: false; error: string }

export async function applyThemeDimension(
  key: keyof PresetConfig,
  value: string
): Promise<ApplyThemeResult> {
  return serialize(async () => {
    try {
      const current = await getCurrentTheme()
      const nextValues = { ...current.values, [key]: value } as PresetConfig

      // Whichever of the three is changed to an achromatic value,
      // propagate it to the other two IF they are also currently
      // achromatic (a color, e.g. theme=blue, is always independently
      // valid and is left untouched).
      if (
        (key === "baseColor" || key === "theme" || key === "chartColor") &&
        ACHROMATIC_VALUES.has(value)
      ) {
        if (ACHROMATIC_VALUES.has(nextValues.baseColor)) {
          nextValues.baseColor = value as PresetConfig["baseColor"]
        }
        if (ACHROMATIC_VALUES.has(nextValues.theme)) {
          nextValues.theme = value as PresetConfig["theme"]
        }
        if (
          nextValues.chartColor &&
          ACHROMATIC_VALUES.has(nextValues.chartColor)
        ) {
          nextValues.chartColor = value as PresetConfig["chartColor"]
        }
      }

      const code = encodePreset(nextValues)

      await execFileAsync(SHADCN_BIN, ["apply", code, "-y"])
      // apply rewrites app/layout.tsx, re-adding the catalog Geist font
      // import and dropping the Saans dogfood. Restore the committed
      // version - safe only because that file's dogfooded state is
      // always what's committed at HEAD (see CLAUDE.md).
      //
      // apply appears to have some file writes that land after its own
      // process resolves (observed: heavier changesets, e.g. a style
      // switch touching 48 files, can still show the Geist diff right
      // after this checkout ran and returned successfully). Verify the
      // file is actually clean afterward and retry a few times.
      for (let attempt = 0; attempt < 5; attempt++) {
        await execFileAsync("git", ["checkout", "--", "app/layout.tsx"])
        try {
          await execFileAsync("git", ["diff", "--quiet", "--", "app/layout.tsx"])
          break
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }

      return { success: true, code, values: nextValues }
    } catch (err) {
      return { success: false, error: errorMessage(err) }
    }
  })
}

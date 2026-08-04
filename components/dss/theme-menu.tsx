"use client"

import { useState, useTransition } from "react"
import { PaletteIcon, LoaderCircleIcon, RotateCcwIcon } from "lucide-react"
import type { PresetConfig } from "shadcn/preset"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { applyThemeDimension, resetTheme } from "@/lib/theme-actions"
import { formatSlug, themeDimensions } from "@/lib/theme-dimensions"

export function ThemeMenu({
  initialTheme,
}: {
  initialTheme: { code: string; values: PresetConfig }
}) {
  const [values, setValues] = useState(initialTheme.values)
  const [error, setError] = useState<string | null>(null)
  // Outcome of the last apply, announced to assistive tech. Applying a theme
  // rewrites files for several seconds, and the only feedback used to be a
  // spinning icon and a paragraph appearing — neither of which a screen
  // reader reports, so the operator could not tell a slow apply from a
  // finished one.
  const [status, setStatus] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(key: keyof PresetConfig, value: string) {
    setError(null)
    setStatus(null)
    startTransition(async () => {
      const result = await applyThemeDimension(key, value)
      if (result.success) {
        setValues(result.values)
        setStatus(`${key} set to ${formatSlug(value)}`)
      } else {
        setError(`${key}: ${result.error}`)
      }
    })
  }

  function handleReset() {
    setError(null)
    setStatus(null)
    startTransition(async () => {
      const result = await resetTheme()
      if (result.success) {
        setValues(result.values)
        setStatus("theme reset to default")
      } else {
        setError(`reset: ${result.error}`)
      }
    })
  }

  return (
    <>
      {/* Live region, mounted outside the Popover on purpose: the panel can be
          dismissed while an apply is still running, and a region that unmounts
          mid-transition never announces its outcome. */}
      <span aria-live="polite" className="sr-only">
        {isPending ? "Applying theme change" : (status ?? "")}
      </span>
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline" size="icon" />}
          aria-busy={isPending}
        >
          {isPending ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <PaletteIcon />
          )}
          <span className="sr-only">Theme</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Applies real files on disk via <code>shadcn apply</code> - review
              with <code>git diff</code> before committing.
            </p>
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
            {themeDimensions.map((dim) => (
              <div
                key={dim.key}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-muted-foreground">
                  {dim.label}
                </span>
                <Select
                  items={dim.values.map((v) => ({
                    label: formatSlug(v),
                    value: v,
                  }))}
                  value={values[dim.key] ?? null}
                  onValueChange={(value) =>
                    handleChange(dim.key, value as string)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dim.values.map((value) => (
                        <SelectItem key={value} value={value}>
                          {formatSlug(value)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Separator />
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleReset}
            >
              <RotateCcwIcon />
              Reset to default
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

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
  const [isPending, startTransition] = useTransition()

  function handleChange(key: keyof PresetConfig, value: string) {
    setError(null)
    startTransition(async () => {
      const result = await applyThemeDimension(key, value)
      if (result.success) {
        setValues(result.values)
      } else {
        setError(`${key}: ${result.error}`)
      }
    })
  }

  function handleReset() {
    setError(null)
    startTransition(async () => {
      const result = await resetTheme()
      if (result.success) {
        setValues(result.values)
      } else {
        setError(`reset: ${result.error}`)
      }
    })
  }

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="icon" />}>
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
          {error && <p className="text-xs text-destructive">{error}</p>}
          {themeDimensions.map((dim) => (
            <div key={dim.key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{dim.label}</span>
              <Select
                items={dim.values.map((v) => ({ label: formatSlug(v), value: v }))}
                value={values[dim.key] ?? null}
                onValueChange={(value) => handleChange(dim.key, value as string)}
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
  )
}

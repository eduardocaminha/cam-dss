import * as React from "react"

import { roleClipClass, type RoleKey } from "@/components/dss/dashboard/cam-tokens"
import { cn } from "@/lib/utils"

// The one modular surface for the whole dashboard (CAM_DESIGN_SYSTEM.md
// section 6): flat, hard-edged, radius 0, a solid 2px border - no shadow, no
// float, no glass, no thin hairlines. Color is never carried by an edge strip;
// a `role` clips the module's corner, and `line` turns the whole border a
// state color (e.g. acid for running). State/role identity lives in the blocks,
// icons and text inside, not the border.
//
// A clipped corner keeps its 2px border on the diagonal too: the panel is
// drawn as two layers sharing the cut - a solid border-color base with a 2px-
// inset surface fill (whose cut is 1.2px smaller), so an even 2px frame shows
// on every edge including the bevel. A plain CSS `border` can't do this because
// clip-path slices the border off along the diagonal.
export type CamPanelProps = React.ComponentProps<"div"> & {
  role?: RoleKey
  border?: "primary" | "none"
  tone?: "surface" | "surface-2" | "carbon" | "transparent"
  // Border color override (defaults to the neutral --cam-border).
  line?: string
}

const toneBg = {
  surface: "bg-(--cam-surface)",
  "surface-2": "bg-(--cam-surface-2)",
  carbon: "bg-(--cam-carbon)",
  transparent: "bg-transparent",
}
const toneText = {
  surface: "text-(--cam-fg)",
  "surface-2": "text-(--cam-fg)",
  carbon: "text-(--cam-carbon-fg)",
  transparent: "text-(--cam-fg)",
}

export function CamPanel({
  role,
  border = "primary",
  tone = "surface",
  line,
  className,
  style,
  children,
  ...props
}: CamPanelProps) {
  const lineColor = line ?? "var(--cam-border)"
  const clip = role ? roleClipClass[role] : undefined

  // Clipped card: two-layer border so the diagonal is bordered too.
  if (clip && border !== "none") {
    return (
      <div
        className={cn("relative isolate", clip, toneText[tone], className)}
        style={{ backgroundColor: lineColor, ...style }}
        {...props}
      >
        <div
          aria-hidden
          className={cn("absolute inset-[2px] -z-10", clip, toneBg[tone])}
          style={{ "--cam-cut": "var(--cam-cut-inner)" } as React.CSSProperties}
        />
        {children}
      </div>
    )
  }

  // Plain panel (square corners): a normal 2px border is enough.
  return (
    <div
      className={cn(
        "relative",
        border === "none" ? "border-0" : "border-2",
        toneBg[tone],
        toneText[tone],
        className
      )}
      style={{ ...(border !== "none" && { borderColor: lineColor }), ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

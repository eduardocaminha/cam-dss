import * as React from "react"

import { type RoleKey } from "@/components/dss/ereader/cam-tokens"
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
  // `role` is destructured only so it never lands on the DOM element as an
  // invalid ARIA role attribute; the e-book restyle no longer styles by it.
  void role
  const lineColor = line ?? "var(--cam-border)"

  // E-reader restyle: corner cuts are retired (--cam-cut is 0) and with
  // them the two-layer clipped border — it painted the whole panel with the
  // border color under an opaque fill, which the one-sheet-of-paper rule
  // (transparent surfaces) can't afford. Every panel is a BOOX-style tile:
  // a thin 1px outline with softly rounded corners drawn on the shared
  // paper, never a filled card.
  return (
    <div
      className={cn(
        "relative",
        border === "none" ? "border-0" : "rounded-[10px] border",
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

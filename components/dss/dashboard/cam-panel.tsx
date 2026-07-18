import * as React from "react"

import {
  roleClipClass,
  roleColorVar,
  stateColorVar,
  type RoleKey,
  type StateKey,
} from "@/components/dss/dashboard/cam-tokens"
import { cn } from "@/lib/utils"

// The one modular surface for the whole dashboard (CAM_DESIGN_SYSTEM.md
// section 6): flat, hard-edged, radius 0, a solid 2px (primary) or 1px
// (secondary) border - no shadow, no float, no glass. It replaces the shadcn
// Card inside this tab. A `role` clips the module's corner and exposes the
// role color as `--role` for children; `rail` paints that color as a narrow
// edge strip (never a full fill); `emphasis` adds the 8px state-color left
// border used for operational emphasis (section 6.4).
export type CamPanelProps = React.ComponentProps<"div"> & {
  role?: RoleKey
  // Narrow role-color strip on one edge. Off by default.
  rail?: "top" | "left" | false
  // 8px left border in a state color (section 6.4 operational emphasis).
  emphasis?: StateKey
  border?: "primary" | "secondary" | "none"
  tone?: "surface" | "surface-2" | "carbon" | "transparent"
}

const borderWidth = {
  primary: "border-[length:var(--cam-border-primary)]",
  secondary: "border-[length:var(--cam-border-secondary)]",
  none: "border-0",
}

const toneClass = {
  surface: "bg-(--cam-surface) text-(--cam-fg)",
  "surface-2": "bg-(--cam-surface-2) text-(--cam-fg)",
  carbon: "bg-(--cam-carbon) text-(--cam-carbon-fg)",
  transparent: "bg-transparent text-(--cam-fg)",
}

export function CamPanel({
  role,
  rail = false,
  emphasis,
  border = "primary",
  tone = "surface",
  className,
  style,
  children,
  ...props
}: CamPanelProps) {
  const roleColor = role ? roleColorVar[role] : undefined
  return (
    <div
      style={
        {
          ...(roleColor ? { "--role": roleColor } : {}),
          ...(emphasis
            ? {
                borderLeft: `var(--cam-border-emphasis) solid ${stateColorVar[emphasis]}`,
              }
            : {}),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative border-(--cam-border)",
        borderWidth[border],
        toneClass[tone],
        role && roleClipClass[role],
        className
      )}
      {...props}
    >
      {rail && role && (
        <span
          aria-hidden
          className={cn(
            "absolute bg-(--role)",
            rail === "top" ? "inset-x-0 top-0 h-1" : "inset-y-0 left-0 w-1"
          )}
        />
      )}
      {children}
    </div>
  )
}

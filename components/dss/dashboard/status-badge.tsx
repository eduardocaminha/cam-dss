import {
  stateColorVar,
  stateLabel,
  stateOnVar,
  stateSymbol,
  type StateKey,
} from "@/components/dss/dashboard/cam-tokens"
import { cn } from "@/lib/utils"

// Status badge (CAM_DESIGN_SYSTEM.md sections 4.5 / 8.4): a compact hard
// rectangle carrying BOTH a symbol and its uppercase label, never color alone.
// The style is chosen per state, so the operational language is consistent
// wherever a state shows up:
//   running     solid, arrow
//   waiting     solid, open circle
//   recovering  outline with a dashed frame, loop
//   blocked     solid, hatch
//   failed      solid, X inside a square
//   completed   solid (a stamp; tilt it with `stamp`)
// A `variant` override forces solid/outline where a surface needs uniform
// badges (e.g. a dense table). `stamp` tilts a passed badge like an ink stamp.
export function StatusBadge({
  state,
  variant,
  stamp = false,
  className,
}: {
  state: StateKey
  variant?: "solid" | "outline"
  stamp?: boolean
  className?: string
}) {
  const style = variant ?? (state === "recovering" ? "outline" : "solid")
  const solid = style === "solid"
  const color = stateColorVar[state]
  const dashed = state === "recovering"
  const boxed = state === "failed"
  return (
    <span
      style={
        solid
          ? { backgroundColor: color, color: stateOnVar[state] }
          : { borderColor: color }
      }
      className={cn(
        "cam-label inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-1 text-[11px] leading-none",
        !solid && "border-2 text-(--cam-fg)",
        !solid && dashed && "border-dashed",
        state === "completed" && stamp && "-rotate-2",
        className
      )}
    >
      {boxed ? (
        <span
          aria-hidden
          className="flex size-4 items-center justify-center border-2 border-current text-[10px] leading-none"
        >
          {stateSymbol[state]}
        </span>
      ) : (
        <span
          aria-hidden
          className="text-xs leading-none"
          style={solid ? undefined : { color }}
        >
          {stateSymbol[state]}
        </span>
      )}
      {stateLabel[state]}
    </span>
  )
}

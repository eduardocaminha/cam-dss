import {
  stateColorVar,
  stateLabel,
  stateOnVar,
  stateSymbol,
  type StateKey,
} from "@/components/dss/dashboard/cam-tokens"
import { cn } from "@/lib/utils"

// Status badge (CAM_DESIGN_SYSTEM.md sections 4.5 / 8.4): a compact hard
// rectangle carrying BOTH a symbol and its uppercase label, never color
// alone. `solid` fills with the state color (readable fg on top); `outline`
// keeps the surface and draws the state color as a 2px frame + the symbol,
// for use on top of colored fills where a solid swatch would clash.
export function StatusBadge({
  state,
  variant = "solid",
  className,
}: {
  state: StateKey
  variant?: "solid" | "outline"
  className?: string
}) {
  const solid = variant === "solid"
  return (
    <span
      style={
        solid
          ? { backgroundColor: stateColorVar[state], color: stateOnVar[state] }
          : { borderColor: stateColorVar[state] }
      }
      className={cn(
        "cam-label inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-1 text-[10px] leading-none",
        !solid && "border-2 text-(--cam-fg)",
        className
      )}
    >
      <span aria-hidden className="text-xs leading-none">
        {stateSymbol[state]}
      </span>
      {stateLabel[state]}
    </span>
  )
}

import {
  stateBgVar,
  stateHatchVar,
  stateLabel,
  stateSymbol,
  type StateKey,
} from "@/components/dss/dashboard/cam-tokens"
import { cn } from "@/lib/utils"

// Status, e-reader register: glyph + uppercase label in INK over a field
// hatched in the state's own hue — the same ░ texture as the wordmark, so a
// status is printed matter rather than a flat colored pill. Always symbol +
// text, never color alone.
//
// No frame and no doubled bottom edge here. The doubled edge is the
// pressable-keycap vocabulary (the `cam …` command caps, the rail items) and
// a status is a readout, not a control; the frame+gap+field anatomy belongs
// to things that HOLD a reading (gauges, tiles, the wordmark) — nesting it
// inside a tile of the same 1px outline only flattened the hierarchy. The
// hatched field delimits the chip on its own, like a stamped tag on paper.
//
// `failed` is the one exception to the hatch: it inverts to solid ink with
// paper text, because ink-on-ink hatch cannot carry legible text.
//
// `stamp` and `variant` are accepted for caller compatibility but no longer
// change the rendering — there is only one, quiet, upright style.
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
  void variant
  void stamp
  const inverted = state === "failed"
  return (
    <span
      style={
        inverted
          ? {
              color: "var(--cam-bone)",
              backgroundColor: stateBgVar[state],
            }
          : {
              color: "var(--cam-fg)",
              backgroundImage: `repeating-conic-gradient(${stateHatchVar[state]} 0% 25%, transparent 0% 50%)`,
              backgroundSize: "4px 4px",
            }
      }
      className={cn(
        "cam-label eink-badge inline-flex items-center gap-1.5 rounded-[5px] px-2 align-middle text-[11px] leading-none whitespace-nowrap",
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

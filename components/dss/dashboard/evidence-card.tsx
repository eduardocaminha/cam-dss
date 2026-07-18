import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import {
  stateColorVar,
  stateLabel,
  stateOnVar,
  stateSymbol,
} from "@/components/dss/dashboard/cam-tokens"
import { cn } from "@/lib/utils"

// Evidence card (CAM_DESIGN_SYSTEM.md sections 2.5 / 8.2): more formal than an
// agent card, it binds a completion claim to proof - a proof type, a result
// with a hard PASSED/FAILED stamp, the metric behind it, its source and an
// optional artifact link. This is the "evidence over reassurance" surface: no
// decorative success, every pass is backed by a count and an artifact.
export type EvidenceProps = {
  proof: string
  result: "passed" | "failed"
  metric: string
  source?: string
  artifact?: string
  className?: string
}

// A rotated ink-stamp badge in the result color (section 10 stamp motion). A
// solid fill (not an outline) so the deep-pine "completed" stamp stays legible
// on the dark carbon surface, where a deep-pine outline would vanish.
function Stamp({ result }: { result: "passed" | "failed" }) {
  const state = result === "passed" ? "completed" : "failed"
  return (
    <span
      style={{
        backgroundColor: stateColorVar[state],
        color: stateOnVar[state],
      }}
      className="cam-stamp cam-label inline-flex shrink-0 items-center gap-1 px-2 py-1 text-xs leading-none"
    >
      <span aria-hidden>{stateSymbol[state]}</span>
      {stateLabel[state]}
    </span>
  )
}

export function EvidenceCard({
  proof,
  result,
  metric,
  source,
  artifact,
  className,
}: EvidenceProps) {
  return (
    <CamPanel className={cn("flex flex-col gap-3 p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="cam-label pt-1 text-[11px] text-(--cam-fg)">
          {proof}
        </span>
        <Stamp result={result} />
      </div>
      <span className="cam-display text-3xl tracking-tight text-(--cam-fg)">
        {metric}
      </span>
      {source && (
        <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
          {source}
        </span>
      )}
      {artifact && (
        <span className="cam-mono flex items-center gap-2 text-[11px] text-(--cam-fg-muted)">
          <span
            aria-hidden
            className="inline-block size-2 shrink-0 bg-(--cam-fg-muted)"
          />
          {artifact}
        </span>
      )}
    </CamPanel>
  )
}

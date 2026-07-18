import { GitBranchIcon } from "lucide-react"

import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { StatusBadge } from "@/components/dss/dashboard/status-badge"
import { agentStateKey } from "@/components/dss/dashboard/cam-tokens"
import {
  currentStage,
  session,
  stageVerb,
  tokenRates,
} from "@/components/dss/dashboard/data"
import { cn } from "@/lib/utils"

const fmtTokens = (k: number) =>
  k >= 1000 ? `${(k / 1000).toFixed(1)}M` : `${k}k`
const fmtCost = (v: number) => `$${v.toFixed(2)}`

const tokensTotal =
  session.tokensIn + session.tokensCached + session.tokensOut
const cost = {
  in: session.tokensIn * tokenRates.in,
  cached: session.tokensCached * tokenRates.cached,
  out: session.tokensOut * tokenRates.out,
}
const costTotal = cost.in + cost.cached + cost.out

// The session is running, so its emphasis is the running state color.
const sessionState = agentStateKey[session.state === "running" ? "active" : "queued"]

// A hard progress rail: a flat track with a solid fill, radius 0 - no pill,
// no gradient (DS section 6).
function ProgressRail({
  label,
  done,
  total,
}: {
  label: string
  done: number
  total: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="cam-label text-[10px] text-(--cam-fg-muted)">
          {label}
        </span>
        <span className="cam-mono text-sm text-(--cam-fg)">
          {done}/{total}
        </span>
      </div>
      <div className="h-3 bg-(--cam-line)">
        <div
          className="h-full bg-(--cam-fg)"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

// in vs out as two hard segments; cached nests as an inset inside the in
// segment (it's a portion of in, not a third parallel category). Rectangular,
// radius 0 - the exact numbers are in the legend, so the bar is only roughly
// proportional (each side floored at MIN_PCT so a lopsided ratio still reads).
function SegBar({
  inValue,
  cached,
  out,
}: {
  inValue: number
  cached: number
  out: number
}) {
  const MIN_PCT = 8
  let inPct = (inValue / (inValue + out)) * 100
  let outPct = 100 - inPct
  if (inPct < MIN_PCT) {
    inPct = MIN_PCT
    outPct = 100 - MIN_PCT
  } else if (outPct < MIN_PCT) {
    outPct = 100 - MIN_PCT
    inPct = MIN_PCT
  }
  const cachedPct = (cached / inValue) * 100
  return (
    <div className="flex h-4 gap-0.5">
      <div
        className="relative bg-(--cam-fg)"
        style={{ width: `${inPct}%` }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-(--cam-surface-2)"
          style={{ width: `${cachedPct}%`, minWidth: "6px" }}
        />
      </div>
      <div className="bg-(--cam-fg)" style={{ width: `${outPct}%` }} />
    </div>
  )
}

// A single instrument readout in the right rail: label, big mono value, and
// (for token/cost) a segmented flow bar with an exact in/cached/out legend.
function Instrument({
  label,
  value,
  flow,
}: {
  label: string
  value: string
  flow?: {
    inValue: number
    cached: number
    out: number
    fmt: (v: number) => string
  }
}) {
  return (
    <CamPanel border="secondary" className="flex flex-col gap-3 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="cam-label text-[10px] text-(--cam-fg-muted)">
          {label}
        </span>
        <span className="cam-mono text-xl leading-none text-(--cam-fg)">
          {value}
        </span>
      </div>
      {flow && (
        <>
          <SegBar
            inValue={flow.inValue}
            cached={flow.cached}
            out={flow.out}
          />
          <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
            ↑ {flow.fmt(flow.inValue)} ({flow.fmt(flow.cached)}) ↓{" "}
            {flow.fmt(flow.out)}
          </span>
        </>
      )}
    </CamPanel>
  )
}

export function SessionCard({ className }: { className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <SectionLabel note={session.branch}>Session</SectionLabel>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Anchor panel: the operational focus, with the running state as its
            emphasis (8px left border). */}
        <CamPanel
          emphasis={sessionState}
          className="flex flex-col xl:col-span-8"
        >
          <div className="flex flex-wrap items-center gap-4 border-b-2 border-(--cam-border) p-5">
            <StatusBadge state={sessionState} />
            <span className="cam-display text-4xl tracking-tight text-(--cam-fg)">
              {stageVerb[currentStage]}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-px border-b-2 border-(--cam-border) bg-(--cam-border) sm:grid-cols-2">
            <div className="flex flex-col gap-2 bg-(--cam-surface) p-5">
              <span className="cam-label text-[10px] text-(--cam-fg-muted)">
                branch
              </span>
              <span className="flex items-center gap-2">
                <GitBranchIcon
                  className="size-4 shrink-0 text-(--cam-fg-muted)"
                  aria-hidden
                />
                <span className="cam-mono truncate text-sm text-(--cam-fg)">
                  {session.branch}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2 bg-(--cam-surface) p-5">
              <span className="cam-label text-[10px] text-(--cam-fg-muted)">
                issue #{session.issue}
              </span>
              <span className="line-clamp-2 text-sm text-(--cam-fg)">
                {session.issueTitle}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2">
            <ProgressRail
              label="stories"
              done={session.storiesDone}
              total={session.storiesTotal}
            />
            <ProgressRail
              label="iterations"
              done={session.iteration}
              total={session.maxIterations}
            />
          </div>
        </CamPanel>
        {/* Instrument rail. */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <Instrument label="session time" value={session.time} />
          <Instrument
            label="tokens"
            value={fmtTokens(tokensTotal)}
            flow={{
              inValue: session.tokensIn,
              cached: session.tokensCached,
              out: session.tokensOut,
              fmt: fmtTokens,
            }}
          />
          <Instrument
            label="cost"
            value={fmtCost(costTotal)}
            flow={{
              inValue: cost.in,
              cached: cost.cached,
              out: cost.out,
              fmt: fmtCost,
            }}
          />
        </div>
      </div>
    </section>
  )
}

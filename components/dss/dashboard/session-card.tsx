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

const tokensTotal = session.tokensIn + session.tokensCached + session.tokensOut
const cost = {
  in: session.tokensIn * tokenRates.in,
  cached: session.tokensCached * tokenRates.cached,
  out: session.tokensOut * tokenRates.out,
}
const costTotal = cost.in + cost.cached + cost.out

const sessionState =
  agentStateKey[session.state === "running" ? "active" : "queued"]

// The single shared bar height for every session metric (stories, iterations,
// tokens, cost) so they all read at the same weight.
// Gauge frame shared by Bar and SegBar (.eink-gauge in dashboard.css): a 1px
// outline with a breathing gap between the frame and whatever fills it — the
// battery-gauge idiom of a reader, not a flush progress rail. Its height is
// --chip-h, the same standing height as a status badge.
const BAR = "eink-gauge"

function Bar({ value }: { value: number }) {
  return (
    <div className={BAR}>
      <div className="eink-track h-full overflow-hidden rounded-[2px]">
        <div className="h-full bg-(--cam-fg)" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

// in vs out as two segments; cached nests as an inset inside the in segment
// (a portion of in, not a third category). Solid fills, three steps of the
// grey ramp: fresh input in ink, the cached share of it cut back to paper,
// output in the mid grey. Same height as Bar.
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
    <div className={BAR}>
      <div className="flex h-full gap-0.5 overflow-hidden rounded-[2px]">
        <div className="relative bg-(--cam-fg)" style={{ width: `${inPct}%` }}>
          <div
            className="absolute inset-y-0 left-0 bg-(--cam-paper)"
            style={{ width: `${cachedPct}%`, minWidth: "6px" }}
          />
        </div>
        <div className="h-full bg-(--ramp-3)" style={{ width: `${outPct}%` }} />
      </div>
    </div>
  )
}

function FlowLegend({
  inValue,
  cached,
  out,
  fmt,
}: {
  inValue: number
  cached: number
  out: number
  fmt: (v: number) => string
}) {
  return (
    <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
      ↑ {fmt(inValue)} ({fmt(cached)}) ↓ {fmt(out)}
    </span>
  )
}

// One separate metric card: label + big mono value, plus an optional bar.
function MetricCard({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children?: React.ReactNode
}) {
  return (
    <CamPanel className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-2">
        <span className="cam-label text-[11px] text-(--cam-fg-muted)">
          {label}
        </span>
        <span className="cam-mono text-[16px] leading-none text-(--cam-fg)">
          {value}
        </span>
      </div>
      {children}
    </CamPanel>
  )
}

export function SessionCard({ className }: { className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <SectionLabel>Session</SectionLabel>
      {/* State, branch and session time on one line. The issue title used to
          sit here, but the PRD block below already carries it — one identity
          per screen, so the slot went to the session clock instead. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CamPanel className="flex flex-col gap-3 p-5">
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            state
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge state={sessionState} />
            <span className="cam-display text-3xl tracking-tight text-(--cam-fg)">
              {stageVerb[currentStage]}
            </span>
          </div>
        </CamPanel>
        <CamPanel className="flex flex-col gap-3 p-5">
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            branch
          </span>
          <span className="flex items-center gap-2">
            <GitBranchIcon
              className="size-5 shrink-0 text-(--cam-fg-muted)"
              aria-hidden
            />
            <span className="truncate text-[16px] text-(--cam-fg) lowercase">
              {session.branch}
            </span>
          </span>
        </CamPanel>
        <CamPanel className="flex flex-col gap-3 p-5">
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            session time
          </span>
          <span className="cam-mono text-[16px] leading-none text-(--cam-fg)">
            {session.time}
          </span>
        </CamPanel>
      </div>
      {/* Every metric is its own card; the bars all share one height. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="stories"
          value={`${session.storiesDone}/${session.storiesTotal}`}
        >
          <Bar value={(session.storiesDone / session.storiesTotal) * 100} />
        </MetricCard>
        <MetricCard
          label="iterations"
          value={`${session.iteration}/${session.maxIterations}`}
        >
          <Bar value={(session.iteration / session.maxIterations) * 100} />
        </MetricCard>
        <MetricCard label="tokens" value={fmtTokens(tokensTotal)}>
          <div className="flex flex-col gap-2">
            <SegBar
              inValue={session.tokensIn}
              cached={session.tokensCached}
              out={session.tokensOut}
            />
            <FlowLegend
              inValue={session.tokensIn}
              cached={session.tokensCached}
              out={session.tokensOut}
              fmt={fmtTokens}
            />
          </div>
        </MetricCard>
        <MetricCard label="cost" value={fmtCost(costTotal)}>
          <div className="flex flex-col gap-2">
            <SegBar inValue={cost.in} cached={cost.cached} out={cost.out} />
            <FlowLegend
              inValue={cost.in}
              cached={cost.cached}
              out={cost.out}
              fmt={fmtCost}
            />
          </div>
        </MetricCard>
      </div>
    </section>
  )
}

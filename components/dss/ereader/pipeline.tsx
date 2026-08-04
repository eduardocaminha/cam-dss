"use client"

import * as React from "react"

import { CamPanel } from "@/components/dss/ereader/cam-panel"
import { DragScroll } from "@/components/dss/ereader/drag-scroll"
import { RoleIcon } from "@/components/dss/ereader/role-icon"
import { SectionLabel } from "@/components/dss/ereader/section-label"
import { StatusBadge } from "@/components/dss/ereader/status-badge"
import {
  agentStateKey,
  type RoleKey,
  type StateKey,
} from "@/components/dss/ereader/cam-tokens"
import {
  auditor,
  implementers,
  orchestrator,
  planner,
  reviewer,
  ship,
  type PipelineStage,
} from "@/components/dss/ereader/data"
import { PipelineGraph } from "@/components/dss/ereader/pipeline-graph"
import { useArrowNav } from "@/app/ereader/keyboard-nav"
import { cn } from "@/lib/utils"

// One log line at a time - the mechanical terminal reveal (DS 8.7), restyled
// as a mono log line. Fixed at 4 lines per card (see data.ts).
function ActivityTicker({
  lines,
  offset = 0,
}: {
  lines: string[]
  offset?: number
}) {
  const lineDuration = 3
  const duration = lines.length * lineDuration
  return (
    <div className="relative h-5 overflow-hidden">
      {lines.map((line, i) => (
        <p
          key={i}
          className="dash-ticker-line cam-mono absolute inset-x-0 truncate text-xs text-(--cam-fg-muted)"
          style={
            {
              "--ticker-duration": `${duration}s`,
              "--ticker-delay": `${offset + i * lineDuration}s`,
            } as React.CSSProperties
          }
        >
          {line}
        </p>
      ))}
    </div>
  )
}

// Header shared by every stage card, in the e-reader tile vocabulary: a BIG
// thin-stroke role icon (the BOOX launcher register) with the name and stage
// number as small quiet text beside it. No filled blocks — the icon carries
// the identity, the state badge on the right carries the state, as text.
function StageHeader({
  role,
  number,
  name,
  state,
}: {
  role: RoleKey
  number: string | number
  name: string
  state: StateKey
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-center gap-3.5">
        <RoleIcon
          role={role}
          size={36}
          className="shrink-0 text-(--cam-fg)"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="cam-label truncate text-[12px] text-(--cam-fg)">
            {name}
          </span>
          <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
            stage {number}
          </span>
        </div>
      </div>
      <StatusBadge
        state={state}
        stamp={state === "completed"}
        className="shrink-0"
      />
    </div>
  )
}

export function StageCard({
  stage,
  number,
  tickerOffset = 0,
  className,
}: {
  stage: PipelineStage & { story?: string }
  number: string | number
  tickerOffset?: number
  className?: string
}) {
  const state = agentStateKey[stage.state]
  // Implementer labels carry their own number ("Implementer 2") and the block
  // already shows one - strip it so it isn't doubled.
  const name = stage.label.replace(/\s\d+$/, "")
  return (
    <CamPanel
      role={stage.key}
      className={cn(
        "flex min-h-56 flex-col justify-between gap-4 p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <StageHeader
          role={stage.key}
          number={number}
          name={name}
          state={state}
        />
        {stage.story && (
          <span className="cam-mono text-[16px] text-(--cam-fg)">
            {stage.story}
          </span>
        )}
        {stage.state === "queued" ? (
          <p className="cam-mono text-[13px] text-(--cam-fg-muted)">
            {stage.note}
          </p>
        ) : (
          <ActivityTicker lines={stage.activity} offset={tickerOffset} />
        )}
      </div>
      <span className="cam-mono border-t border-(--cam-line) pt-3 text-[11px] text-(--cam-fg-muted)">
        {stage.model} · {stage.effort} · {stage.tokens} · {stage.cost} ·{" "}
        {stage.time}
      </span>
    </CamPanel>
  )
}

export function OrchestratorCard({ className }: { className?: string }) {
  return (
    <CamPanel
      role="orchestrator"
      className={cn(
        "flex min-h-56 flex-col justify-between gap-4 p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <StageHeader
          role="orchestrator"
          number={0}
          name="Orchestrator"
          state="running"
        />
        <span className="cam-display text-xl tracking-tight text-(--cam-fg)">
          {orchestrator.lastDecision}
        </span>
        <ActivityTicker lines={orchestrator.activity} />
      </div>
      <span className="cam-mono border-t border-(--cam-line) pt-3 text-[11px] text-(--cam-fg-muted)">
        {orchestrator.model} · {orchestrator.effort} ·{" "}
        {orchestrator.dispatches} dispatches · {orchestrator.tokens} ·{" "}
        {orchestrator.cost} · up {orchestrator.uptime}
      </span>
    </CamPanel>
  )
}

// Graph vs cards: the graph is the default because it is the only view that
// shows the topology (which stages run in parallel); the card grid stays for
// reading every stage's detail at once. The switch sits beside the section
// title, in the same cap vocabulary as the header's width/polarity controls.
function ViewSwitch({
  mode,
  onChange,
}: {
  mode: "graph" | "cards"
  onChange: (next: "graph" | "cards") => void
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useArrowNav(ref)
  return (
    <span
      ref={ref}
      className="width-toggle"
      role="group"
      aria-label="Pipeline view"
    >
      <button
        type="button"
        aria-pressed={mode === "graph"}
        onClick={() => onChange("graph")}
        title="Graph"
      >
        <svg viewBox="0 0 16 16" aria-hidden>
          <rect x="1.5" y="6" width="4" height="4" />
          <rect x="10.5" y="2" width="4" height="4" />
          <rect x="10.5" y="10" width="4" height="4" />
          <path d="M5.5 8h2.5M8 8V4h2.5M8 8v4h2.5" />
        </svg>
      </button>
      <button
        type="button"
        aria-pressed={mode === "cards"}
        onClick={() => onChange("cards")}
        title="Cards"
      >
        <svg viewBox="0 0 16 16" aria-hidden>
          <rect x="1.5" y="2.5" width="5.5" height="5" />
          <rect x="9" y="2.5" width="5.5" height="5" />
          <rect x="1.5" y="9" width="5.5" height="4.5" />
          <rect x="9" y="9" width="5.5" height="4.5" />
        </svg>
      </button>
    </span>
  )
}

export function Pipeline({ className }: { className?: string }) {
  const [mode, setMode] = React.useState<"graph" | "cards">("graph")
  return (
    <section className={cn("flex min-w-0 flex-col gap-4", className)}>
      <SectionLabel
        action={<ViewSwitch mode={mode} onChange={setMode} />}
      >
        Pipeline
      </SectionLabel>
      {mode === "graph" ? (
        <PipelineGraph />
      ) : (
      <div className="flex min-w-0 flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <OrchestratorCard />
          <StageCard stage={planner} number={1} tickerOffset={0.4} />
          <StageCard stage={auditor} number={2} tickerOffset={0.8} />
        </div>
        {/* scroll-fade-x (shadcn/ui, scroll-driven, no JS): the right edge
            dissolves while there's more to reveal. dash-no-scrollbar hides the
            native scrollbar. */}
        <DragScroll className="scroll-fade-x scroll-fade-[192px] dash-no-scrollbar flex gap-4 overflow-x-auto">
          {implementers.map((impl) => (
            <StageCard
              key={impl.n}
              stage={impl}
              number={`3.${impl.n}`}
              tickerOffset={1.2 + impl.n * 0.4}
              className="w-80 shrink-0 md:w-96"
            />
          ))}
        </DragScroll>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StageCard stage={reviewer} number={4} tickerOffset={3.2} />
          <StageCard stage={ship} number={5} tickerOffset={3.6} />
        </div>
      </div>
      )}
    </section>
  )
}

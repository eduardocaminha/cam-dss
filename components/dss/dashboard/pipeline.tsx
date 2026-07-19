import * as React from "react"

import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { DragScroll } from "@/components/dss/dashboard/drag-scroll"
import { RoleIcon } from "@/components/dss/dashboard/role-icon"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { StatusBadge } from "@/components/dss/dashboard/status-badge"
import {
  agentStateKey,
  roleColorVar,
  type RoleKey,
  type StateKey,
} from "@/components/dss/dashboard/cam-tokens"
import {
  auditor,
  implementers,
  orchestrator,
  planner,
  reviewer,
  ship,
  type PipelineStage,
} from "@/components/dss/dashboard/data"
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

// Header shared by every stage card. The card is neutral; the ONLY agent color
// is the square numbered block (number always Ink). The name, icons and border
// stay Ink. The DS state badge on the right carries the independent state color.
function StageHeader({
  role,
  number,
  name,
  model,
  state,
}: {
  role: RoleKey
  number: string | number
  name: string
  model: string
  state: StateKey
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-center gap-3">
        <span
          style={{ backgroundColor: roleColorVar[role] }}
          className="cam-mono flex size-10 shrink-0 items-center justify-center border-2 border-(--cam-ink) text-base font-semibold text-(--cam-ink)"
        >
          {number}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex min-w-0 items-center gap-1.5 text-(--cam-fg)">
            <RoleIcon role={role} size={16} className="shrink-0" />
            <span className="cam-label truncate text-[12px]">{name}</span>
          </span>
          <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
            {model}
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

function StageCard({
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
          model={stage.model}
          state={state}
        />
        {stage.story && (
          <span className="cam-display text-3xl tracking-tight text-(--cam-fg)">
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
      <span className="cam-mono border-t-2 border-(--cam-line) pt-3 text-[11px] text-(--cam-fg-muted)">
        {stage.tokens} · {stage.cost} · {stage.time}
      </span>
    </CamPanel>
  )
}

function OrchestratorCard({ className }: { className?: string }) {
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
          model={orchestrator.model}
          state="running"
        />
        <span className="cam-display text-xl tracking-tight text-(--cam-fg)">
          {orchestrator.lastDecision}
        </span>
        <ActivityTicker lines={orchestrator.activity} />
      </div>
      <span className="cam-mono border-t-2 border-(--cam-line) pt-3 text-[11px] text-(--cam-fg-muted)">
        {orchestrator.dispatches} dispatches · {orchestrator.tokens} ·{" "}
        {orchestrator.cost} · up {orchestrator.uptime}
      </span>
    </CamPanel>
  )
}

export function Pipeline({ className }: { className?: string }) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4", className)}>
      <SectionLabel>Pipeline</SectionLabel>
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
    </section>
  )
}

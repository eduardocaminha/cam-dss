import * as React from "react"

import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { DragScroll } from "@/components/dss/dashboard/drag-scroll"
import { RoleIcon } from "@/components/dss/dashboard/role-icon"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { StatusBadge } from "@/components/dss/dashboard/status-badge"
import {
  agentStateKey,
  roleColorVar,
  roleOnVar,
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

// Header shared by every stage card: a role-colored number chip, the role
// mark (in the panel foreground for contrast, section 7.4), the role name and
// model, and the DS state badge on the right (role color and state color kept
// separate).
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
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span
          style={{
            backgroundColor: roleColorVar[role],
            color: roleOnVar[role],
          }}
          className="cam-mono flex size-7 shrink-0 items-center justify-center text-xs"
        >
          {number}
        </span>
        <RoleIcon role={role} size={18} className="shrink-0 text-(--cam-fg)" />
        <span className="cam-label truncate text-[11px] text-(--cam-fg)">
          {name}
        </span>
        <span className="cam-mono shrink-0 border border-(--cam-line) px-1.5 py-0.5 text-[10px] text-(--cam-fg-muted)">
          {model}
        </span>
      </div>
      <StatusBadge state={state} className="shrink-0" />
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
  // Implementer labels carry their own number ("Implementer 2") and the chip
  // already shows one - strip it so it isn't doubled.
  const name = stage.label.replace(/\s\d+$/, "")
  return (
    <CamPanel
      role={stage.key}
      rail="top"
      className={cn(
        "flex min-h-56 flex-col justify-between gap-3 p-5 pt-6",
        className
      )}
    >
      <div className="flex flex-col gap-3">
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
          <p className="cam-mono text-xs text-(--cam-fg-muted)">{stage.note}</p>
        ) : (
          <ActivityTicker lines={stage.activity} offset={tickerOffset} />
        )}
      </div>
      <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
        {stage.tokens} · {stage.cost} · {stage.time}
      </span>
    </CamPanel>
  )
}

function OrchestratorCard({ className }: { className?: string }) {
  return (
    <CamPanel
      role="orchestrator"
      rail="top"
      className={cn(
        "flex min-h-56 flex-col justify-between gap-3 p-5 pt-6",
        className
      )}
    >
      <div className="flex flex-col gap-3">
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
      <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
        {orchestrator.dispatches} dispatches · {orchestrator.tokens} ·{" "}
        {orchestrator.cost} · up {orchestrator.uptime}
      </span>
    </CamPanel>
  )
}

// The workflow strip (DS 8.6): ISSUE -> PLAN -> AUDIT -> IMPLEMENT -> REVIEW
// -> SHIP as connected phase blocks. Solid rail for the reached path, concrete
// for what's still ahead, dashed blue for recovery.
type Phase = { label: string; role?: RoleKey; state: StateKey }

function Connector({ state }: { state: StateKey }) {
  const reached = state === "completed" || state === "running"
  return (
    <span aria-hidden className="flex shrink-0 items-center self-center">
      <span
        className={cn(
          "h-0.5 w-5",
          state === "recovering"
            ? "cam-recover"
            : reached
              ? "bg-(--cam-border)"
              : "bg-(--cam-line)"
        )}
      />
      <span
        className={cn(
          "cam-mono text-sm",
          reached ? "text-(--cam-fg)" : "text-(--cam-fg-muted)"
        )}
      >
        →
      </span>
    </span>
  )
}

function FlowStrip() {
  const implementState: StateKey = implementers.some(
    (i) => i.state === "active"
  )
    ? "running"
    : implementers.every((i) => i.state === "done")
      ? "completed"
      : "waiting"
  const phases: Phase[] = [
    { label: "issue", state: "completed" },
    { label: "plan", role: "planner", state: agentStateKey[planner.state] },
    { label: "audit", role: "auditor", state: agentStateKey[auditor.state] },
    { label: "implement", role: "implementer", state: implementState },
    { label: "review", role: "reviewer", state: agentStateKey[reviewer.state] },
    { label: "ship", role: "ship", state: agentStateKey[ship.state] },
  ]
  return (
    <div className="dash-no-scrollbar flex min-w-0 items-stretch gap-1 overflow-x-auto">
      {phases.map((phase, i) => (
        <React.Fragment key={phase.label}>
          <div className="relative flex shrink-0 flex-col gap-2 border-2 border-(--cam-border) bg-(--cam-surface) px-3 pt-3 pb-2">
            {phase.role && (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: roleColorVar[phase.role] }}
              />
            )}
            <span className="cam-label text-[10px] text-(--cam-fg)">
              {phase.label}
            </span>
            <StatusBadge state={phase.state} variant="outline" />
          </div>
          {i < phases.length - 1 && (
            <Connector state={phases[i + 1].state} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export function Pipeline({ className }: { className?: string }) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4", className)}>
      <SectionLabel note="issue → plan → audit → implement → review → ship">
        Pipeline
      </SectionLabel>
      <FlowStrip />
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

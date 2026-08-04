import * as React from "react"

import { project } from "@/components/dss/ereader/data"
import { CamPanel } from "@/components/dss/ereader/cam-panel"
import { GateshipLockup } from "@/components/dss/ereader/gateship-logo"
import { SectionLabel } from "@/components/dss/ereader/section-label"
import { cn } from "@/lib/utils"

// Global project readouts, moved into their own Overview section.
const metrics = [
  { label: "total tokens", value: project.tokens },
  { label: "total cost", value: project.cost },
  { label: "total time", value: project.time },
  { label: "issues shipped", value: String(project.issuesShipped) },
  { label: "cycles", value: String(project.cycles) },
]

// The masthead carries the real mark now (components/dss/ereader/
// gateship-logo.tsx): gate, stair and wordmark, in ink. The placeholder chip
// it replaces — text on a hatched field, with a border that drew itself and
// broke a corner — is gone; the ritual moved onto the logo's own outline,
// which is what a line mark wants anyway.
function GateshipMark() {
  return (
    <div className="flex flex-col gap-2">
      <GateshipLockup className="logo-lockup" />
      <span className="cam-label text-[10px] text-(--cam-fg-muted)">
        control plane for coding agents
      </span>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <CamPanel className="flex flex-col gap-2 p-4">
      <span className="cam-label text-[11px] text-(--cam-fg-muted)">
        {label}
      </span>
      <span className="cam-mono text-[16px] leading-none text-(--cam-fg)">
        {value}
      </span>
    </CamPanel>
  )
}

// The header bar: same surface + black border as the cards, carrying the brand
// mark and the project identity (no metrics - those live in Overview below).
// The masthead is a plain brand row on the paper — no tile, no menu (the
// section rail carries navigation): wordmark chip + tagline on the left,
// the project identity on the right, a hairline rule underneath.
export function CommandBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 border-b border-(--cam-line) pb-5",
        className
      )}
    >
      <GateshipMark />
      <div className="flex flex-col items-end gap-1">
        <span className="cam-label text-[10px] text-(--cam-fg-muted)">
          project repository
        </span>
        <span className="text-[15px] leading-none text-(--cam-fg) lowercase">
          {project.name}
        </span>
      </div>
    </div>
  )
}

export function Overview({ className }: { className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <SectionLabel>Overview</SectionLabel>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {metrics.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </dl>
    </section>
  )
}

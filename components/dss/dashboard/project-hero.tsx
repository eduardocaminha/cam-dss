import * as React from "react"

import { project } from "@/components/dss/dashboard/data"
import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { SectionMenu } from "@/components/dss/dashboard/section-menu"
import { cn } from "@/lib/utils"

// Global project readouts, moved into their own Overview section.
const metrics = [
  { label: "total tokens", value: project.tokens },
  { label: "total cost", value: project.cost },
  { label: "total time", value: project.time },
  { label: "issues shipped", value: String(project.issuesShipped) },
  { label: "cycles", value: String(project.cycles) },
]

// The acid brand mark with its own 2px border that follows the clipped corner
// (two layers: border-color base + inset acid fill, same trick as CamPanel).
function CamLogo() {
  return (
    <span
      style={{ "--cam-cut": "12px" } as React.CSSProperties}
      className="cam-clip-br inline-block bg-(--cam-border) p-0.5"
    >
      <span
        style={{ "--cam-cut": "10.8px" } as React.CSSProperties}
        className="cam-clip-br cam-display block bg-(--cam-acid) px-4 py-2 text-4xl leading-none font-bold text-(--cam-carbon)"
      >
        CAM
      </span>
    </span>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <CamPanel className="flex flex-col gap-2 p-4">
      <span className="cam-label text-[11px] text-(--cam-fg-muted)">{label}</span>
      <span className="text-3xl leading-none font-semibold tabular-nums text-(--cam-fg)">
        {value}
      </span>
    </CamPanel>
  )
}

// The header bar: same surface + black border as the cards, carrying the brand
// mark and the project identity (no metrics - those live in Overview below).
export function CommandBar({ className }: { className?: string }) {
  return (
    <CamPanel
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 gap-y-5 p-5 md:p-6",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <CamLogo />
        <div className="flex flex-col gap-1">
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            project
          </span>
          <span className="text-lg leading-none font-semibold text-(--cam-fg)">
            {project.name}
          </span>
        </div>
      </div>
      <SectionMenu />
    </CamPanel>
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

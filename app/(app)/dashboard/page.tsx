"use client"

import "./dashboard.css"

import * as React from "react"

import { BacklogCard } from "@/components/dss/dashboard/backlog-card"
import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { CommandBar, Overview } from "@/components/dss/dashboard/project-hero"
import { CommandsCard } from "@/components/dss/dashboard/commands-card"
import { EvidenceCard } from "@/components/dss/dashboard/evidence-card"
import { FunnelCard } from "@/components/dss/dashboard/funnel-card"
import { IssueCard } from "@/components/dss/dashboard/issue-card"
import { Pipeline } from "@/components/dss/dashboard/pipeline"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { SessionCard } from "@/components/dss/dashboard/session-card"
import { StatusBadge } from "@/components/dss/dashboard/status-badge"
import { TokensCard } from "@/components/dss/dashboard/tokens-card"
import { useDashboardView } from "@/components/dss/dashboard/section-menu"
import { evidence } from "@/components/dss/dashboard/data"

function EvidenceSection() {
  const passed = evidence.filter((e) => e.result === "passed").length
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel note={`${passed}/${evidence.length} proofs passed`}>
        Evidence
      </SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {evidence.map((e) => (
          <EvidenceCard key={e.proof} {...e} />
        ))}
        {/* The next gate that will produce evidence - not yet run. */}
        <CamPanel className="flex items-center justify-between gap-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="cam-label text-[11px] text-(--cam-fg)">
              review gate
            </span>
            <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
              runs after implementers
            </span>
          </div>
          <StatusBadge state="waiting" />
        </CamPanel>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Stats</SectionLabel>
      {/* Deliberate asymmetry (DS 9.1): 8/4 then 7/5, not a uniform grid. */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <TokensCard className="h-full" />
        </div>
        <div className="xl:col-span-4">
          <CommandsCard className="h-full" />
        </div>
        <div className="xl:col-span-7">
          <BacklogCard className="h-full" />
        </div>
        <div className="xl:col-span-5">
          <FunnelCard className="h-full" />
        </div>
      </div>
    </section>
  )
}

// One section per menu item; only the active view renders.
const views: Record<string, React.ReactNode> = {
  overview: <Overview />,
  session: <SessionCard />,
  pipeline: <Pipeline />,
  prd: <IssueCard />,
  evidence: <EvidenceSection />,
  stats: <StatsSection />,
}

export default function DashboardPage() {
  const view = useDashboardView()
  return (
    <div data-dash-root className="min-h-full bg-(--cam-page) text-(--cam-fg)">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 p-5 md:p-8">
        <CommandBar />
        {/* key re-triggers the slide-in each time the view changes. */}
        <div key={view} className="dash-rise min-w-0">
          {views[view]}
        </div>
      </div>
    </div>
  )
}

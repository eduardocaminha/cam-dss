import "./dashboard.css"

import * as React from "react"

import { BacklogCard } from "@/components/dss/dashboard/backlog-card"
import { CommandBar } from "@/components/dss/dashboard/project-hero"
import { CommandsCard } from "@/components/dss/dashboard/commands-card"
import { EvidenceCard } from "@/components/dss/dashboard/evidence-card"
import { FunnelCard } from "@/components/dss/dashboard/funnel-card"
import { IssueCard } from "@/components/dss/dashboard/issue-card"
import { Pipeline } from "@/components/dss/dashboard/pipeline"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { SessionCard } from "@/components/dss/dashboard/session-card"
import { TokensCard } from "@/components/dss/dashboard/tokens-card"
import { evidence } from "@/components/dss/dashboard/data"

// Staggered directional slide-in per block (DS section 10; no ambient motion).
// min-w-0 so a block with an internal horizontal scroller (the pipeline strip,
// the implementer rail) shrinks to the column instead of widening the page.
function Rise({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <div
      className="dash-rise min-w-0"
      style={{ "--rise-i": i } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

function EvidenceColumn() {
  return (
    <section className="flex h-full flex-col gap-4">
      <SectionLabel>Evidence</SectionLabel>
      <div className="flex flex-col gap-4">
        {evidence.map((e) => (
          <EvidenceCard key={e.proof} {...e} />
        ))}
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

export default function DashboardPage() {
  return (
    <div
      data-dash-root
      className="min-h-full bg-(--cam-page) text-(--cam-fg)"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 p-5 md:p-8">
        <Rise i={0}>
          <CommandBar />
        </Rise>
        <Rise i={1}>
          <SessionCard />
        </Rise>
        <Rise i={2}>
          <Pipeline />
        </Rise>
        <Rise i={3}>
          {/* PRD table anchors, evidence column sits alongside (DS 9.1). */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <IssueCard className="h-full" />
            </div>
            <div className="xl:col-span-4">
              <EvidenceColumn />
            </div>
          </div>
        </Rise>
        <Rise i={4}>
          <StatsSection />
        </Rise>
      </div>
    </div>
  )
}

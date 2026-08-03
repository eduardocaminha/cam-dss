"use client"

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
import {
  SectionRail,
  useDashboardView,
} from "@/components/dss/dashboard/section-menu"
import { evidence } from "@/components/dss/dashboard/data"

import { Clock, DateStamp } from "./live"
import { flashScreen, RefreshOverlay } from "./refresh-control"
import { ThemeToggle } from "./theme-toggle"
import { WidthToggle } from "./width-toggle"

// Port of the main repo's /dashboard page body (app/(app)/dashboard/
// page.tsx), unchanged in structure — the e-ink reskin happens entirely in
// dashboard.css tokens. The one behavioral addition: switching views fires
// the page-turn flash, the way the panel redraws on a section change.

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

// The header strip: real clock (partial-refresh on the minute), real date
// plus the page-measure and panel-polarity controls. Spans the content area only — it starts to
// the right of the rail — and scrolls away with the page like any other
// content, no stickiness.
function TopStrip() {
  return (
    <div className="cam-mono flex items-center justify-end gap-4 border-b border-(--cam-line) px-6 py-2.5 text-[12px] text-(--cam-fg) md:px-10">
      <span>
        <Clock />
      </span>
      <span className="text-(--cam-fg-muted)">
        <DateStamp />
      </span>
      <WidthToggle />
      <ThemeToggle />
      <RefreshOverlay />
    </div>
  )
}

// One view per menu item; only the active one renders. Session carries both
// Session and PRD. Overview is not here - it renders on every page (below).
const views: Record<string, React.ReactNode> = {
  session: (
    <div className="flex flex-col gap-10">
      <SessionCard />
      <IssueCard />
    </div>
  ),
  pipeline: <Pipeline />,
  evidence: <EvidenceSection />,
  stats: <StatsSection />,
}

export function DashboardBody() {
  const view = useDashboardView()

  // Page-turn flash on every view change; the initial render is covered by
  // the boot flash, so skip it.
  const firstRender = React.useRef(true)
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    flashScreen()
  }, [view])

  return (
    <div
      data-dash-root
      className="flex min-h-full bg-(--cam-page) text-(--cam-fg)"
    >
      {/* Launcher rail on the left — the reader's fixed navigation. */}
      <SectionRail />
      <div className="min-w-0 flex-1">
        <TopStrip />
        {/* Narrow reading column with generous paper around it. */}
        <div className="dash-measure mx-auto flex flex-col gap-12 px-6 py-8 md:px-10 md:py-10">
          <CommandBar />
          {/* Overview is persistent - it shows above every view. */}
          <Overview />
          {/* key re-triggers the redraw each time the view changes. */}
          <div key={view} className="dash-rise min-w-0">
            {views[view]}
          </div>
        </div>
      </div>
    </div>
  )
}

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

// The acid brand mark as a self-contained SVG: the clipped-corner box is two
// polygons (ink border + inset acid fill), and "CAM" is the Dinko glyphs as
// outline paths (font units, extracted from gc-dinko-demo.regular.ttf), so the
// mark scales anywhere without the Dinko font loaded. Geometry and the glyph
// transform were measured off the previous CSS logo, so it renders identically.
// Fills use the same CSS vars, keeping it theme-aware.
function CamLogo() {
  return (
    <svg
      viewBox="0 0 131.031 52.195"
      width="131.031"
      height="52.195"
      role="img"
      aria-label="CAM"
      className="block"
    >
      {/* ink border box, bottom-right corner cut 12px */}
      <polygon
        points="0,0 131.031,0 131.031,40.195 119.031,52.195 0,52.195"
        fill="var(--cam-border)"
      />
      {/* acid fill, inset 3px, corner cut 10.2px so the border stays uniform */}
      <polygon
        points="3,3 128.031,3 128.031,38.995 117.831,49.195 3,49.195"
        fill="var(--cam-acid)"
      />
      {/* "CAM" (Dinko outline): translate to baseline, scale + flip y */}
      <path
        transform="translate(18.470 37.1) scale(0.0353189 -0.0353189)"
        fill="var(--cam-carbon)"
        d="M765.0 290Q760.0 145 666.0 67.5Q572.0 -10 390.0 -10Q202.0 -10 108.5 71.5Q15.0 153 15.0 306V344Q15.0 497 108.5 578.5Q202.0 660 390.0 660Q572.0 660 666.0 582.5Q760.0 505 765.0 360H503.0Q490.0 450 390.0 450Q275.0 450 275.0 333V318Q275.0 200 390.0 200Q490.0 200 503.0 290ZM1380.0 650 1680.0 0H1410.0L1364.0 100H1126.0L1080.0 0H810.0L1110.0 650ZM1295.0 250 1245.0 358 1195.0 250ZM1730.0 650H1980.0L2190.0 211L2399.0 650H2649.0V0H2399.0V255L2289.0 1L2290.0 0H2089.0L2090.0 1L1980.0 255V0H1730.0Z"
      />
    </svg>
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
            project repository
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

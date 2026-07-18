import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { funnel } from "@/components/dss/dashboard/data"
import { cn } from "@/lib/utils"

// IssueStage is ordinal (idea -> specified -> planned -> shipped): the segments
// walk the CAM palette from neutral to completed, with abandoned on Coral (it
// leaves the progression). Each segment is hard-edged, radius 0, and every
// legend entry pairs its color with an uppercase label - never color alone.
const stageColor = [
  "var(--cam-concrete)", // idea
  "var(--cam-lilac)", // specified
  "var(--cam-blue)", // planned
  "var(--cam-deep-pine)", // shipped
  "var(--cam-coral)", // abandoned
]

const total = funnel.reduce((acc, stage) => acc + stage.count, 0)

export function FunnelCard({ className }: { className?: string }) {
  return (
    <CamPanel className={cn("flex flex-col gap-5 p-5", className)}>
      <div className="flex flex-col gap-1">
        <span className="cam-label text-[11px] text-(--cam-fg)">queue</span>
        <span className="cam-mono text-xs text-(--cam-fg-muted)">
          every issue ever filed, by stage
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="cam-display text-5xl tracking-tight text-(--cam-fg)">
          {total}
        </span>
        <span className="cam-label text-[10px] text-(--cam-fg-muted)">
          issues filed
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-5">
        <div className="flex h-6 gap-0.5">
          {funnel.map((stage, index) => (
            <div
              key={stage.stage}
              style={{
                width: `${(stage.count / total) * 100}%`,
                backgroundColor: stageColor[index],
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-5">
          {funnel.map((stage, index) => (
            <div key={stage.stage} className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0"
                  style={{ backgroundColor: stageColor[index] }}
                />
                <span className="cam-label text-[10px] text-(--cam-fg-muted)">
                  {stage.stage}
                </span>
              </span>
              <span className="cam-mono text-lg text-(--cam-fg)">
                {stage.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CamPanel>
  )
}

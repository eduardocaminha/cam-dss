import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { funnel } from "@/components/dss/dashboard/data"
import { cn } from "@/lib/utils"

// IssueStage is ordinal (idea -> specified -> planned -> shipped): the segments
// walk the CAM palette from neutral to completed, with abandoned on Coral (it
// leaves the progression). Each stage is a labeled row - color, name, a
// proportional hard bar, the count and its share - so the whole distribution
// reads at once, never color alone.
const stageColor = [
  "var(--cam-concrete)", // idea
  "var(--cam-lilac)", // specified
  "var(--cam-blue)", // planned
  "var(--cam-deep-pine)", // shipped
  "var(--cam-coral)", // abandoned
]

const total = funnel.reduce((acc, stage) => acc + stage.count, 0)
const maxCount = Math.max(...funnel.map((s) => s.count))

export function FunnelCard({ className }: { className?: string }) {
  return (
    <CamPanel className={cn("flex flex-col gap-5 p-5", className)}>
      <div className="flex flex-col gap-1">
        <span className="cam-label text-[11px] text-(--cam-fg)">queue</span>
        <span className="cam-mono text-[11px] text-(--cam-fg-muted)">
          every issue ever filed, by stage
        </span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="cam-display text-5xl tracking-tight text-(--cam-fg)">
          {total}
        </span>
        <span className="cam-label text-[11px] text-(--cam-fg-muted)">
          issues filed
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4">
        {funnel.map((stage, index) => {
          const share = Math.round((stage.count / total) * 100)
          return (
            <div key={stage.stage} className="flex items-center gap-3">
              <span
                aria-hidden
                className="size-3 shrink-0"
                style={{ backgroundColor: stageColor[index] }}
              />
              <span className="cam-label w-20 shrink-0 text-[11px] text-(--cam-fg)">
                {stage.stage}
              </span>
              <div className="h-2.5 flex-1 bg-(--cam-line)">
                <div
                  className="h-full"
                  style={{
                    width: `${(stage.count / maxCount) * 100}%`,
                    backgroundColor: stageColor[index],
                  }}
                />
              </div>
              <span className="cam-mono w-8 shrink-0 text-right text-sm text-(--cam-fg)">
                {stage.count}
              </span>
              <span className="cam-mono w-9 shrink-0 text-right text-[11px] text-(--cam-fg-muted)">
                {share}%
              </span>
            </div>
          )
        })}
      </div>
    </CamPanel>
  )
}

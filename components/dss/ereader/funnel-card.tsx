import { CamPanel } from "@/components/dss/ereader/cam-panel"
import { funnel } from "@/components/dss/ereader/data"
import { cn } from "@/lib/utils"

// IssueStage is ordinal (idea -> specified -> planned -> shipped), so the bars
// ramp through solid greys — a 16-level panel prints a grey directly, no
// dithering needed, and a filled bar reads its length faster than a patterned
// one. Abandoned is the single tinted row: it is the one stage that LEAVES the
// progression, so it steps out of the ramp instead of continuing it.
const stageFill = [
  "var(--ramp-1)", // idea
  "var(--ramp-2)", // specified
  "var(--ramp-3)", // planned
  "var(--ramp-4)", // shipped
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
                className="size-3 shrink-0 rounded-[2px]"
                style={{ backgroundColor: stageFill[index] }}
              />
              <span className="cam-label w-20 shrink-0 text-[11px] text-(--cam-fg)">
                {stage.stage}
              </span>
              <div className="eink-track h-2.5 flex-1 overflow-hidden rounded-[2px]">
                <div
                  className="h-full"
                  style={{
                    width: `${(stage.count / maxCount) * 100}%`,
                    backgroundColor: stageFill[index],
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

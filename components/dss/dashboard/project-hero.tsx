import { project } from "@/components/dss/dashboard/data"
import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { cn } from "@/lib/utils"

// Global project readouts, mono and right-aligned (DS 8.5: numbers align
// right; monospaced for metrics).
const metrics = [
  { label: "total tokens", value: project.tokens },
  { label: "total cost", value: project.cost },
  { label: "total time", value: project.time },
  { label: "issues shipped", value: String(project.issuesShipped) },
  { label: "cycles", value: String(project.cycles) },
]

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="cam-label text-[10px] text-(--cam-carbon-fg-muted)">
        {label}
      </span>
      <span className="cam-mono text-lg leading-none text-(--cam-carbon-fg)">
        {value}
      </span>
    </div>
  )
}

// The command bar: the always-dark (Carbon) header that carries the brand
// mark, the project identity and the global loop metrics. Acid Pop is the CAM
// identity mark (DS 4.4), used as a solid flat block, not a timid accent.
export function CommandBar({ className }: { className?: string }) {
  return (
    <CamPanel
      tone="carbon"
      border="primary"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-8 gap-y-5 p-5 md:p-6",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span className="cam-display bg-(--cam-acid) px-3 py-1.5 text-2xl leading-none text-(--on-acid)">
          CAM
        </span>
        <div className="flex flex-col gap-1">
          <span className="cam-label text-[10px] text-(--cam-carbon-fg-muted)">
            runtime · project
          </span>
          <span className="cam-mono text-lg leading-none text-(--cam-carbon-fg)">
            {project.name}
          </span>
        </div>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        {metrics.map((m) => (
          <Metric key={m.label} {...m} />
        ))}
      </dl>
    </CamPanel>
  )
}

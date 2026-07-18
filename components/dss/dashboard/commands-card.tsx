import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { roleColorVar } from "@/components/dss/dashboard/cam-tokens"
import { commandsFlow } from "@/components/dss/dashboard/data"
import { cn } from "@/lib/utils"

// Each command feeds a pipeline stage; the square node takes that stage's role
// color, but the command name is the primary label - never color alone (DS
// 8.4). Backlog commands feed no agent, so they get a neutral node.
const stageColor: Record<string, string> = {
  planner: roleColorVar.planner,
  implementer: roleColorVar.implementer,
  reviewer: roleColorVar.reviewer,
  ship: roleColorVar.ship,
}

export function CommandsCard({ className }: { className?: string }) {
  return (
    <CamPanel className={cn("flex flex-col gap-4 p-5", className)}>
      <div className="flex flex-col gap-1">
        <span className="cam-label text-[11px] text-(--cam-fg)">flow</span>
        <span className="cam-mono text-xs text-(--cam-fg-muted)">
          the cam commands, in loop order
        </span>
      </div>
      <div className="relative flex flex-1 flex-col justify-center gap-5">
        {/* Vertical rail the nodes sit on. */}
        <div className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-(--cam-line)" />
        {commandsFlow.map((entry) => (
          <div key={entry.command} className="flex items-baseline gap-4">
            <span
              aria-hidden
              className="relative size-3 shrink-0 self-center"
              style={{
                backgroundColor: stageColor[entry.stage] ?? "var(--cam-concrete)",
              }}
            />
            <span className="cam-mono w-28 shrink-0 text-sm text-(--cam-fg)">
              {entry.command}
            </span>
            <span className="text-sm text-(--cam-fg-muted)">
              {entry.description}
            </span>
          </div>
        ))}
      </div>
    </CamPanel>
  )
}

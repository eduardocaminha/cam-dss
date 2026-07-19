import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { backlog } from "@/components/dss/dashboard/data"
import { cn } from "@/lib/utils"

const maxWsjf = Math.max(...backlog.map((entry) => entry.wsjf))

// A rectangular metadata tag (DS 6.2: pills only for compact qualifiers; hard
// rectangles for the operational tags here).
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="cam-label shrink-0 border-2 border-(--cam-line) px-1.5 py-0.5 text-[11px] text-(--cam-fg-muted)">
      {children}
    </span>
  )
}

export function BacklogCard({ className }: { className?: string }) {
  return (
    <CamPanel className={cn("flex flex-col gap-4 p-5", className)}>
      <div className="flex flex-col gap-1">
        <span className="cam-label text-[11px] text-(--cam-fg)">backlog</span>
        <span className="cam-mono text-xs text-(--cam-fg-muted)">
          scripts/cam/issues · ranked by WSJF + topological order
        </span>
      </div>
      <div className="flex flex-1 flex-col">
        {backlog.map((entry) => {
          const blocked = entry.blockedBy.length > 0
          return (
            <div
              key={entry.id}
              className="flex flex-col gap-1.5 border-b-2 border-(--cam-line) py-3 last:border-b-0"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="cam-mono shrink-0 text-xs text-(--cam-fg-muted)">
                  {entry.id}
                </span>
                <span className="truncate text-sm text-(--cam-fg)">
                  {entry.title}
                </span>
                <Tag>{entry.stage}</Tag>
                <Tag>{entry.type}</Tag>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 flex-1 bg-(--cam-line)">
                  <div
                    className="h-full bg-(--cam-fg)"
                    style={{ width: `${(entry.wsjf / maxWsjf) * 100}%` }}
                  />
                </div>
                <span className="cam-mono shrink-0 text-xs text-(--cam-fg-muted)">
                  wsjf {entry.wsjf.toFixed(1)}
                </span>
                {blocked && (
                  <span className="cam-mono shrink-0 text-xs text-(--cam-fg-muted)">
                    <span className="text-(--state-blocked)">⊘</span>{" "}
                    {entry.blockedBy.join(", ")}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </CamPanel>
  )
}

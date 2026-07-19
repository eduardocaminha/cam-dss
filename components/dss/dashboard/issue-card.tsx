import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { SectionLabel } from "@/components/dss/dashboard/section-label"
import { StatusBadge } from "@/components/dss/dashboard/status-badge"
import { agentStateKey } from "@/components/dss/dashboard/cam-tokens"
import { issue, tokenRates } from "@/components/dss/dashboard/data"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

// story | in ($) | cached ($) | out ($) | total ($) | status
const rowGrid =
  "grid grid-cols-[minmax(0,2.4fr)_repeat(4,minmax(0,1fr))_auto] items-center gap-x-3"
const columnHeaders = ["in ($)", "cached ($)", "out ($)", "total ($)"]

const fmtK = (v: number) =>
  v === 0 ? "0" : `${Number.isInteger(v) ? v : v.toFixed(1)}k`
const fmtCost = (v: number) => `$${v.toFixed(2)}`

const rows = issue.stories.map((story) => {
  const total = story.in + story.cached + story.out
  const costIn = story.in * tokenRates.in
  const costCached = story.cached * tokenRates.cached
  const costOut = story.out * tokenRates.out
  return {
    ...story,
    total,
    costIn,
    costCached,
    costOut,
    costTotal: costIn + costCached + costOut,
  }
})

const sum = (
  key:
    | "in"
    | "cached"
    | "out"
    | "total"
    | "costIn"
    | "costCached"
    | "costOut"
    | "costTotal"
) => rows.reduce((acc, row) => acc + row[key], 0)

const totals = {
  in: sum("in"),
  costIn: sum("costIn"),
  cached: sum("cached"),
  costCached: sum("costCached"),
  out: sum("out"),
  costOut: sum("costOut"),
  total: sum("total"),
  costTotal: sum("costTotal"),
}

function NumberCells({
  row,
  className,
  dash = false,
}: {
  row: typeof totals
  className?: string
  // Stories that haven't run yet show a dash: a zero would read as "the total
  // was zero", which isn't true.
  dash?: boolean
}) {
  return (
    <>
      {[
        [row.in, row.costIn],
        [row.cached, row.costCached],
        [row.out, row.costOut],
        [row.total, row.costTotal],
      ].map(([value, cost], index) => (
        <span
          key={index}
          className={cn(
            "cam-mono text-right text-xs text-(--cam-fg)",
            className
          )}
        >
          {dash ? "—" : `${fmtK(value)} (${fmtCost(cost)})`}
        </span>
      ))}
    </>
  )
}

export function IssueCard({ className }: { className?: string }) {
  return (
    <section className={cn("flex min-h-0 flex-col gap-4", className)}>
      <SectionLabel note={`#${issue.number}`}>PRD</SectionLabel>
      <CamPanel className="flex min-h-0 flex-1 flex-col">
        <div className="border-b-2 border-(--cam-border) p-5">
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            issue #{issue.number}
          </span>
          <p className="cam-display mt-1 text-xl tracking-tight text-(--cam-fg)">
            {issue.title}
          </p>
        </div>
        {/* Column headers, mono uppercase, numbers right-aligned. */}
        <div
          className={cn(
            rowGrid,
            "border-b-2 border-(--cam-border) bg-(--cam-surface-2) px-5 py-2"
          )}
        >
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            story
          </span>
          {columnHeaders.map((text) => (
            <span
              key={text}
              className="cam-label text-right text-[11px] text-(--cam-fg-muted)"
            >
              {text}
            </span>
          ))}
          <span className="cam-label pl-2 text-[11px] text-(--cam-fg-muted)">
            status
          </span>
        </div>
        {/* Rows. Internal vertical scroll caps the table height. */}
        <div className="dash-no-scrollbar max-h-[520px] flex-1 overflow-y-auto">
          {rows.map((row) => {
            const state = agentStateKey[row.state]
            return (
              <Drawer key={row.id} swipeDirection="right">
                {/* render swaps DrawerTrigger's default <button> for this row
                    div - one element in the DOM either way, so it doesn't
                    disturb the row's own grid layout. */}
                <DrawerTrigger
                  nativeButton={false}
                  render={
                    <div
                      className={cn(
                        "relative cursor-pointer border-b-2 border-(--cam-line) px-5 py-2.5 text-left hover:bg-(--cam-fg)/5",
                        rowGrid,
                        row.state === "queued" && "text-(--cam-fg-muted)"
                      )}
                    />
                  }
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="cam-mono shrink-0 text-xs text-(--cam-fg-muted)">
                      {row.id}
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm",
                        row.state === "active" && "cam-display normal-case"
                      )}
                    >
                      {row.title}
                    </span>
                  </span>
                  <NumberCells row={row} dash={row.state === "queued"} />
                  <span className="flex justify-end pl-2">
                    <StatusBadge state={state} />
                  </span>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>
                      {row.id} · {row.title}
                    </DrawerTitle>
                    <DrawerDescription>{row.description}</DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            )
          })}
        </div>
        {/* Totals. */}
        <div
          className={cn(rowGrid, "border-t-2 border-(--cam-border) px-5 py-3")}
        >
          <span className="cam-label text-[11px] text-(--cam-fg)">total</span>
          <NumberCells row={totals} className="font-semibold" />
          <span aria-hidden />
        </div>
      </CamPanel>
    </section>
  )
}

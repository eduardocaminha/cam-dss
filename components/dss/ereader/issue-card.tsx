"use client"

import * as React from "react"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { CamPanel } from "@/components/dss/ereader/cam-panel"
import { SectionLabel } from "@/components/dss/ereader/section-label"
import { StatusBadge } from "@/components/dss/ereader/status-badge"
import { agentStateKey } from "@/components/dss/ereader/cam-tokens"
import { issue, tokenRates } from "@/components/dss/ereader/data"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

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

type Row = (typeof rows)[number]

const sum = (key: keyof Row) =>
  rows.reduce((acc, row) => acc + (row[key] as number), 0)

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

// Column widths as percentages so they always sum to 100 - the table fills the
// block exactly and a resize redistributes with the neighbour instead of
// growing the table past the block. Order matches the columns array.
const COL_ORDER = ["id", "in", "cached", "out", "total", "state"] as const
const INITIAL_WIDTHS: Record<string, number> = {
  id: 26,
  in: 15,
  cached: 15,
  out: 15,
  total: 15,
  state: 14,
}
const MIN_PCT = 7

function numColumn(
  key: "in" | "cached" | "out" | "total",
  costKey: "costIn" | "costCached" | "costOut" | "costTotal",
  label: string
): ColumnDef<Row> {
  return {
    id: key,
    accessorFn: (r) => r[key],
    header: label,
    cell: ({ row }) => {
      const r = row.original
      const dash = r.state === "queued"
      return (
        <span
          className={cn(
            "cam-mono block truncate text-right text-xs",
            dash ? "text-(--cam-fg-muted)" : "text-(--cam-fg)"
          )}
        >
          {dash ? "—" : `${fmtK(r[key])} (${fmtCost(r[costKey])})`}
        </span>
      )
    },
  }
}

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "id",
    header: "story",
    cell: ({ row }) => {
      const r = row.original
      return (
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="cam-mono shrink-0 text-xs text-(--cam-fg-muted)">
            {r.id}
          </span>
          <span className="truncate text-sm uppercase">
            {r.title}
          </span>
        </span>
      )
    },
  },
  numColumn("in", "costIn", "in ($)"),
  numColumn("cached", "costCached", "cached ($)"),
  numColumn("out", "costOut", "out ($)"),
  numColumn("total", "costTotal", "total ($)"),
  {
    accessorKey: "state",
    header: "status",
    cell: ({ row }) => (
      <span className="flex justify-end">
        <StatusBadge state={agentStateKey[row.original.state]} />
      </span>
    ),
  },
]

const RIGHT = new Set(["in", "cached", "out", "total", "state"])

export function IssueCard({ className }: { className?: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selected, setSelected] = React.useState<Row | null>(null)
  const [widths, setWidths] = React.useState(INITIAL_WIDTHS)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Drag the boundary between column i and i+1: give width to one, take it from
  // the other, so the total stays 100% and the table never exceeds the block.
  const startResize = (e: React.MouseEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    const tableW =
      scrollRef.current?.querySelector("table")?.getBoundingClientRect()
        .width ?? 1
    const a = COL_ORDER[i]
    const b = COL_ORDER[i + 1]
    const startX = e.clientX
    const startA = widths[a]
    const startB = widths[b]
    const onMove = (ev: MouseEvent) => {
      let delta = ((ev.clientX - startX) / tableW) * 100
      delta = Math.max(MIN_PCT - startA, Math.min(startB - MIN_PCT, delta))
      setWidths((w) => ({ ...w, [a]: startA + delta, [b]: startB - delta }))
    }
    const onUp = () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }

  return (
    <section className={cn("flex min-h-0 flex-col gap-4", className)}>
      <SectionLabel>PRD</SectionLabel>
      <CamPanel className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-(--cam-border) p-5">
          <span className="cam-label text-[11px] text-(--cam-fg-muted)">
            issue #{issue.number}
          </span>
          <p className="cam-display mt-1 text-xl tracking-tight text-(--cam-fg)">
            {issue.title}
          </p>
        </div>

        {/* No inner scroll: nothing sits below the table, so the card grows to
            the full table height and header + total are always in view. */}
        <div ref={scrollRef}>
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="border-(--cam-line) bg-transparent hover:bg-transparent"
                >
                  {hg.headers.map((header, i) => {
                    const right = RIGHT.has(header.column.id)
                    const sorted = header.column.getIsSorted()
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${widths[header.column.id]}%` }}
                        className="relative h-9 select-none text-(--cam-fg-muted)"
                      >
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "cam-label flex w-full items-center gap-1 text-[11px]",
                            right && "justify-end"
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ChevronUp className="size-3.5 shrink-0" />
                          ) : sorted === "desc" ? (
                            <ChevronDown className="size-3.5 shrink-0" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" />
                          )}
                        </button>
                        {i < hg.headers.length - 1 && (
                          <div
                            onMouseDown={(e) => startResize(e, i)}
                            className="absolute top-0 -right-1 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center"
                          >
                            <span className="h-full w-0.5 bg-(--cam-border) opacity-0 transition-opacity hover:opacity-60" />
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelected(row.original)}
                  className={cn(
                    "cursor-pointer border-(--cam-line)",
                    row.original.state === "queued" && "text-(--cam-fg-muted)"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: `${widths[cell.column.id]}%` }}
                      className="py-2.5"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter className="border-t border-(--cam-line) bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableCell>
                  <span className="cam-label text-[11px] text-(--cam-fg)">
                    total
                  </span>
                </TableCell>
                {(
                  [
                    [totals.in, totals.costIn],
                    [totals.cached, totals.costCached],
                    [totals.out, totals.costOut],
                    [totals.total, totals.costTotal],
                  ] as const
                ).map(([value, cost], i) => (
                  <TableCell key={i}>
                    <span className="cam-mono block truncate text-right text-xs font-semibold text-(--cam-fg)">
                      {fmtK(value)} ({fmtCost(cost)})
                    </span>
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CamPanel>

      {/* Row detail. A single controlled drawer, opened by clicking a row. */}
      <Drawer
        swipeDirection="right"
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selected?.id} · {selected?.title}
            </DrawerTitle>
            <DrawerDescription>{selected?.description}</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

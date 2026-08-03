"use client"

import * as React from "react"

import { RoleIcon } from "@/components/dss/dashboard/role-icon"
import {
  agentStateKey,
  stateSymbol,
  type RoleKey,
  type StateKey,
} from "@/components/dss/dashboard/cam-tokens"
import {
  auditor,
  implementers,
  orchestrator,
  planner,
  reviewer,
  ship,
  type PipelineStage,
} from "@/components/dss/dashboard/data"
import { OrchestratorCard, StageCard } from "@/components/dss/dashboard/pipeline"
import { useArrowNav } from "@/app/ereader/keyboard-nav"
import { cn } from "@/lib/utils"

// The pipeline as what it actually is: ONE SERIAL CHAIN. The implementers do
// not fan out — they run one after another — so the drawing is a single run
// of stages, five per row, EVERY row reading left to right like text. The
// wrap is drawn explicitly: a return line carries the flow back to the start
// of the next row, arrow pointing left, the way a carriage returns.
//
// Everything is one SVG so the nodes and the connectors can never drift out
// of alignment, and because a technical line drawing is the most e-ink thing
// there is: 1px strokes, right angles, no curves, no shadows. Each wire
// leaves its stage through a plotted square port and arrives under an
// arrowhead, so direction is stated, never inferred. Nodes are square caps
// in the sidebar-rail idiom (icon over label); selecting one inverts it to
// ink and swaps the detail card.

type NodeDef = {
  id: string
  role: RoleKey
  label: string
  number: string
  state: StateKey
  x: number
  y: number
  w: number
  row: number
  col: number
  detail: React.ReactNode
}

// --- Board geometry ---------------------------------------------------------
// A serial chain laid out as a snake over three rows: row 0 runs left to
// right, row 1 right to left, row 2 left to right again. One coordinate
// table; the connectors are derived from it, so the wiring can never
// disagree with the order.

const NODE = 80 // square cap, sidebar-rail proportions
const COLS = 5
const GAP_X = 28
const GAP_Y = 104 // room for the return line to pass between the rows
const PAD = 18
const PORT = 4 // plotted square where a wire leaves a stage
const ARROW = 5 // arrowhead size
const VIEW_W = PAD * 2 + COLS * NODE + (COLS - 1) * GAP_X
const ROWS = 2
const VIEW_H = PAD * 2 + ROWS * NODE + (ROWS - 1) * GAP_Y

/** Every row reads left to right; the chain wraps like text. */
function place(index: number) {
  const row = Math.floor(index / COLS)
  const col = index % COLS
  return {
    x: PAD + col * (NODE + GAP_X),
    y: PAD + row * (NODE + GAP_Y),
    row,
    col,
  }
}

type Stop = {
  id: string
  role: RoleKey
  label: string
  number: string
  state: StateKey
  detail: React.ReactNode
}

// Execution order, exactly as the loop runs it.
const order: Stop[] = [
  {
    id: "orchestrator",
    role: "orchestrator",
    label: "orch",
    number: "0",
    state: "running",
    detail: <OrchestratorCard />,
  },
  {
    id: "planner",
    role: "planner",
    label: "planner",
    number: "1",
    state: agentStateKey[planner.state],
    detail: <StageCard stage={planner} number={1} />,
  },
  {
    id: "auditor",
    role: "auditor",
    label: "auditor",
    number: "2",
    state: agentStateKey[auditor.state],
    detail: <StageCard stage={auditor} number={2} />,
  },
  ...implementers.map((impl) => ({
    id: `impl-${impl.n}`,
    role: "implementer" as RoleKey,
    label: `impl ${impl.n}`,
    number: `3.${impl.n}`,
    state: agentStateKey[impl.state],
    detail: (
      <StageCard
        stage={impl}
        number={`3.${impl.n}`}
        tickerOffset={impl.n * 0.4}
      />
    ),
  })),
  {
    id: "reviewer",
    role: "reviewer",
    label: "reviewer",
    number: "4",
    state: agentStateKey[reviewer.state],
    detail: <StageCard stage={reviewer} number={4} />,
  },
  {
    id: "ship",
    role: "ship",
    label: "ship",
    number: "5",
    state: agentStateKey[ship.state],
    detail: <StageCard stage={ship} number={5} />,
  },
]

const nodes: NodeDef[] = order.map((stop, i) => ({
  ...stop,
  ...place(i),
  w: NODE,
}))

/** Arrowhead triangle pointing in one of four directions. */
function head(x: number, y: number, dir: "right" | "left" | "down") {
  if (dir === "right")
    return `${x} ${y} ${x - ARROW} ${y - ARROW * 0.7} ${x - ARROW} ${y + ARROW * 0.7}`
  if (dir === "left")
    return `${x} ${y} ${x + ARROW} ${y - ARROW * 0.7} ${x + ARROW} ${y + ARROW * 0.7}`
  return `${x} ${y} ${x - ARROW * 0.7} ${y - ARROW} ${x + ARROW * 0.7} ${y - ARROW}`
}

type Wire = {
  path: string
  port: { x: number; y: number }
  heads: { points: string }[]
}

/** The connection between two consecutive stages. Along a row it is a plain
 *  horizontal run; at the wrap it drops below the row, travels back to the
 *  left and enters the next row from the top — that return leg is the one
 *  place the flow moves right-to-left, so it carries its own arrow. */
function wire(a: NodeDef, b: NodeDef): Wire {
  if (a.row === b.row) {
    const y = a.y + NODE / 2
    return {
      path: `M${a.x + NODE} ${y}H${b.x - ARROW}`,
      port: { x: a.x + NODE, y },
      heads: [{ points: head(b.x, y, "right") }],
    }
  }
  const ax = a.x + NODE / 2
  const bx = b.x + NODE / 2
  const midY = a.y + NODE + GAP_Y / 2
  return {
    path: `M${ax} ${a.y + NODE}V${midY}H${bx}V${b.y - ARROW}`,
    port: { x: ax, y: a.y + NODE },
    heads: [
      // the return leg is the only one that reads right-to-left, so it
      // states its direction in the middle of the run
      { points: head((ax + bx) / 2 - ARROW / 2, midY, "left") },
      { points: head(bx, b.y, "down") },
    ],
  }
}

/** The stage that is running right now — the sensible default selection. */
const RUNNING_ID =
  nodes.find((n) => n.state === "running" && n.id !== "orchestrator")?.id ??
  "orchestrator"

function Node({
  node,
  selected,
  onSelect,
}: {
  node: NodeDef
  selected: boolean
  onSelect: () => void
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${node.label} — stage ${node.number}`}
      className={cn("graph-node", selected && "is-selected")}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      {/* Keycap depth, exactly as the rail does it: the rail's cap carries a
          1px border with a 2px BOTTOM, so what you see under it is a sliver
          of ink following the same radius. An SVG rect can't have one
          thicker side, so the sliver is its own rounded rect sitting 2px
          lower behind the cap — only its bottom edge shows. Hover reveals
          it; pressing drops the cap into it. */}
      <rect
        x={node.x}
        y={node.y + 2}
        width={node.w}
        height={NODE}
        rx={8}
        className="graph-node-shadow"
      />
      <g className="graph-node-cap">
        <rect
          x={node.x}
          y={node.y}
          width={node.w}
          height={NODE}
          rx={8}
          className="graph-node-box"
        />
        <g transform={`translate(${node.x + node.w / 2 - 13} ${node.y + 14})`}>
          <RoleIcon role={node.role} size={26} className="graph-node-icon" />
        </g>
        <text
          x={node.x + node.w / 2}
          y={node.y + 58}
          textAnchor="middle"
          className="cam-label graph-node-label"
        >
          {node.label}
        </text>
        <text
          x={node.x + node.w - 8}
          y={node.y + 14}
          textAnchor="end"
          className="graph-node-state"
        >
          {stateSymbol[node.state]}
        </text>
      </g>
    </g>
  )
}

export function PipelineGraph({ className }: { className?: string }) {
  const [selected, setSelected] = React.useState(RUNNING_ID)
  // Arrows walk the chain: left/right by one stage, up/down by a whole row.
  const boardRef = React.useRef<SVGSVGElement>(null)
  useArrowNav(boardRef, COLS)
  const active = nodes.find((n) => n.id === selected) ?? nodes[0]

  return (
    // Narrow measure: board above, detail below. Wide measure: board left,
    // detail right — driven by the page-width preference, not the viewport,
    // because that is the control the operator just used.
    <div className={cn("graph-layout", className)}>
      <div className="graph-board">
        <svg
          ref={boardRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="graph-svg"
          role="group"
          aria-label="Agent pipeline graph"
        >
          {nodes.slice(0, -1).map((node, i) => {
            const w = wire(node, nodes[i + 1])
            return (
              <g key={`w-${node.id}`} className="graph-wire">
                <path d={w.path} />
                <rect
                  x={w.port.x - PORT / 2}
                  y={w.port.y - PORT / 2}
                  width={PORT}
                  height={PORT}
                  className="graph-port"
                />
                {w.heads.map((h, j) => (
                  <polygon key={j} points={h.points} className="graph-head" />
                ))}
              </g>
            )
          })}
          {nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              selected={node.id === selected}
              onSelect={() => setSelected(node.id)}
            />
          ))}
        </svg>
      </div>
      <div className="min-w-0">{active.detail}</div>
    </div>
  )
}

export type { PipelineStage }

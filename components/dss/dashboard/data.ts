// Static mock snapshot for the /dashboard tab. Shapes and vocabulary mirror
// cam-cli's real data model (DashboardData in src/commands/dashboard.ts,
// StatusReport/LoopPhase in src/commands/status.ts, WorkerEventKind in
// src/supervisor/events.ts, IssueStage in src/issues/types.ts). No live
// wiring yet: every value is a fixed string or number so SSR and hydration
// always agree. This tab observes the loop; it does not control it.

export const project = {
  name: "cam-cli",
  tokens: "48.2M",
  cost: "$1,284",
  time: "86h 12m",
  issuesShipped: 22,
  cycles: 31,
}

export const session = {
  state: "running", // running | paused | canceled
  branch: "cam/issue-127",
  issue: 127,
  issueTitle: "Dashboard tab for the design system",
  storiesDone: 8,
  storiesTotal: 13,
  iteration: 8,
  maxIterations: 30,
  time: "5h 07m",
  // k tokens per side.
  tokensIn: 623,
  tokensCached: 533,
  tokensOut: 3,
}

export type StoryState = "done" | "active" | "queued"

// Mock $ per k token, one rate per side, so per-story costs and the totals
// row always add up.
export const tokenRates = { in: 0.012, cached: 0.0015, out: 0.06 }

// Per-story token accounting, in k tokens per side.
export const issue = {
  number: 127,
  title: "Dashboard tab for the design system",
  stories: [
    { id: "US-001", title: "Scaffold the dashboard route", state: "done", in: 42, cached: 96, out: 0.2, description: "Create the /dashboard route under app/(app), wire it into the site nav, and lay out the empty page shell (Overview, Session, Issue, Pipeline) before any real content lands." },
    { id: "US-002", title: "Session + issue snapshot cards", state: "done", in: 58, cached: 84, out: 0.3, description: "Build the Session and Issue cards showing branch, state, iteration count, and the active issue's number and title." },
    { id: "US-003", title: "Agent pipeline band", state: "done", in: 96, cached: 61, out: 0.4, description: "Render the pipeline strip (Orchestrator, Planner, Auditor, Implementers, Reviewer, Ship) as a horizontal row of stage cards with live state." },
    { id: "US-004", title: "Token accounting per side", state: "done", in: 47, cached: 52, out: 0.2, description: "Add in/cached/out token and cost accounting per story and per session, with a totals row that sums correctly." },
    { id: "US-005", title: "Backlog list with WSJF", state: "done", in: 39, cached: 43, out: 0.2, description: "List backlog issues sorted by WSJF score, with stage and blocked-by relationships shown." },
    { id: "US-006", title: "Stage funnel chart", state: "done", in: 33, cached: 38, out: 0.2, description: "Chart backlog issue counts per IssueStage (idea -> specified -> planned -> shipped -> abandoned)." },
    { id: "US-007", title: "Grain + motion pass", state: "done", in: 52, cached: 47, out: 0.3, description: "Add the film-grain texture and entrance/pulse motion across dashboard cards for a less flat, more \"alive\" feel." },
    { id: "US-008", title: "Light/dark palette validation", state: "done", in: 24, cached: 30, out: 0.1, description: "Validate the dashboard's scoped palette in both light and dark mode for contrast and legibility." },
    { id: "US-009", title: "Wire the commands help flow", state: "active", in: 28, cached: 41, out: 0.1, description: "Surface the cam CLI command flow (issue -> spec -> plan -> next -> review -> ship) as a help reference inside the dashboard." },
    { id: "US-010", title: "Responsive pass under xl", state: "queued", in: 0, cached: 0, out: 0, description: "Fix layout breakage below the xl breakpoint - grid columns, horizontal scroll, and card min-widths." },
    { id: "US-011", title: "Empty/error states", state: "queued", in: 0, cached: 0, out: 0, description: "Design empty and error states for each card when there's no active session or the data fails to load." },
    { id: "US-012", title: "A11y sweep", state: "queued", in: 0, cached: 0, out: 0, description: "Audit focus order, contrast, and screen-reader labeling across every dashboard card." },
    { id: "US-013", title: "Docs + README section", state: "queued", in: 0, cached: 0, out: 0, description: "Document the dashboard tab in the project README and note its known gaps in CLAUDE.md." },
  ] satisfies { id: string; title: string; state: StoryState; in: number; cached: number; out: number; description: string }[],
}

export type AgentState = "done" | "active" | "queued"

export const orchestrator = {
  model: "opus",
  uptime: "5h 07m",
  tokens: "96k",
  cost: "$1.88",
  dispatches: 14,
  lastDecision: "dispatch US-009 -> implementer 2",
  // What the agent exposed, most recent last - cycles one line at a time
  // in the card (see dash-ticker-line in dashboard.css). Fixed at 4 lines
  // so the ticker's CSS keyframes (built for 4 equal slots) line up.
  activity: [
    "dispatched US-009 to implementer 2",
    "implementer 1 gate ✓ - merging",
    "budget check: 96k tokens ok",
    "watching implementer 2 for handback",
  ],
}

export type PipelineStage = {
  key: "planner" | "auditor" | "implementer" | "reviewer" | "ship"
  label: string
  state: AgentState
  model: string
  tokens: string
  cost: string
  time: string
  note: string
  activity: string[]
}

export const planner: PipelineStage = {
  key: "planner",
  label: "Planner",
  state: "done",
  model: "sonnet",
  tokens: "88k",
  cost: "$1.06",
  time: "12m",
  note: "prd.json · 13 stories",
  activity: [
    "reading issue #127 and existing routes",
    "drafting user stories from the PRD",
    "wrote prd.json (13 stories)",
    "plan verdict: PASS",
  ],
}

export const auditor: PipelineStage = {
  key: "auditor",
  label: "Auditor",
  state: "done",
  model: "sonnet",
  tokens: "42k",
  cost: "$0.50",
  time: "6m",
  note: "plan verdict PASS",
  activity: [
    "checking story dependencies",
    "validating WSJF ordering",
    "flagged 0 blocking issues",
    "verdict: PASS",
  ],
}

export const implementers: (PipelineStage & { n: number; story: string })[] = [
  { key: "implementer", label: "Implementer 1", n: 1, story: "US-001..008", state: "done", model: "sonnet", tokens: "442k", cost: "$5.30", time: "2h 39m", note: "8 stories · gates ✓✓", activity: ["implementing US-001..008", "running pnpm typecheck", "running pnpm lint", "gates ✓✓ - ready for review"] },
  { key: "implementer", label: "Implementer 2", n: 2, story: "US-009", state: "active", model: "sonnet", tokens: "41k", cost: "$0.49", time: "18m", note: "editing commands-card.tsx", activity: ["editing components/dss/dashboard/session-card.tsx", "wiring the FlowBar component", "running pnpm typecheck", "verifying in browser preview"] },
  { key: "implementer", label: "Implementer 3", n: 3, story: "US-010", state: "queued", model: "sonnet", tokens: "0", cost: "$0.00", time: "-", note: "waiting dispatch", activity: ["waiting dispatch", "waiting dispatch", "waiting dispatch", "waiting dispatch"] },
  { key: "implementer", label: "Implementer 4", n: 4, story: "US-011", state: "queued", model: "sonnet", tokens: "0", cost: "$0.00", time: "-", note: "waiting dispatch", activity: ["waiting dispatch", "waiting dispatch", "waiting dispatch", "waiting dispatch"] },
  { key: "implementer", label: "Implementer 5", n: 5, story: "US-012", state: "queued", model: "sonnet", tokens: "0", cost: "$0.00", time: "-", note: "waiting dispatch", activity: ["waiting dispatch", "waiting dispatch", "waiting dispatch", "waiting dispatch"] },
]

export const reviewer: PipelineStage = {
  key: "reviewer",
  label: "Reviewer",
  state: "queued",
  model: "sonnet",
  tokens: "0",
  cost: "$0.00",
  time: "-",
  note: "runs after implementers",
  activity: ["runs after implementers", "runs after implementers", "runs after implementers", "runs after implementers"],
}

export const ship: PipelineStage = {
  key: "ship",
  label: "Ship",
  state: "queued",
  model: "sonnet",
  tokens: "0",
  cost: "$0.00",
  time: "-",
  note: "tag + merge watch",
  activity: ["tag + merge watch", "tag + merge watch", "tag + merge watch", "tag + merge watch"],
}

// Whichever pipeline stage is currently doing work - drives the session
// state widget's label and color.
export const currentStage: PipelineStage["key"] =
  [planner, auditor, ...implementers, reviewer, ship].find(
    (stage) => stage.state === "active"
  )?.key ?? "implementer"

export const stageColorVar: Record<PipelineStage["key"], string> = {
  planner: "var(--stage-planner)",
  auditor: "var(--stage-auditor)",
  implementer: "var(--stage-impl)",
  reviewer: "var(--stage-reviewer)",
  ship: "var(--stage-ship)",
}

export const stageVerb: Record<PipelineStage["key"], string> = {
  planner: "planning",
  auditor: "auditing",
  implementer: "implementing",
  reviewer: "reviewing",
  ship: "shipping",
}

// k tokens per loop iteration, split by side (cycle-tokens events).
export const tokensPerIteration = [
  { iteration: "01", worker: 412, orch: 96 },
  { iteration: "02", worker: 388, orch: 88 },
  { iteration: "03", worker: 460, orch: 102 },
  { iteration: "04", worker: 341, orch: 74 },
  { iteration: "05", worker: 296, orch: 81 },
  { iteration: "06", worker: 512, orch: 110 },
  { iteration: "07", worker: 448, orch: 93 },
  { iteration: "08", worker: 187, orch: 41 },
]

// The cam flow, as help, not as controls (cam-cli index.ts HELP block).
export const commandsFlow = [
  { command: "cam issue", stage: "backlog", description: "capture a free-text idea into the backlog" },
  { command: "cam spec", stage: "backlog", description: "deep-spec an idea (stage: idea -> specified)" },
  { command: "cam plan", stage: "planner", description: "plan the issue into prd.json stories" },
  { command: "cam next", stage: "implementer", description: "launch the autonomous loop (tmux pane)" },
  { command: "cam review", stage: "reviewer", description: "review the diff, verdict handback" },
  { command: "cam ship", stage: "ship", description: "finalize, bump, tag, merge watch" },
]

export const backlog = [
  { id: "CAM-0114", title: "Retry-monitor for zombie panes", stage: "planned", type: "feat", wsjf: 8.5, blockedBy: [] },
  { id: "CAM-0121", title: "Orchestrator budget alerts", stage: "specified", type: "feat", wsjf: 7.2, blockedBy: ["CAM-0114"] },
  { id: "CAM-0098", title: "Journal archive rotation", stage: "planned", type: "chore", wsjf: 6.8, blockedBy: [] },
  { id: "CAM-0125", title: "Handoff schema v2", stage: "specified", type: "feat", wsjf: 5.9, blockedBy: ["CAM-0121", "CAM-0098"] },
  { id: "CAM-0103", title: "Container preflight docs", stage: "idea", type: "docs", wsjf: 4.1, blockedBy: [] },
  { id: "CAM-0127", title: "Dashboard tab for the design system", stage: "shipped", type: "feat", wsjf: 9.1, blockedBy: [] },
]

// Backlog counts by IssueStage + abandoned (IssueStatus).
export const funnel = [
  { stage: "idea", count: 48 },
  { stage: "specified", count: 31 },
  { stage: "planned", count: 26 },
  { stage: "shipped", count: 22 },
  { stage: "abandoned", count: 9 },
]

// Proof behind the completed stages, for the evidence column - derived from
// the pipeline stages' own verdicts and gates above (planner note, auditor
// "0 blocking" + "verdict: PASS", implementer 1 "gates ✓✓"). Completion is
// bound to structured evidence, not a decorative success state (DS 2.5 / 8.2).
export const evidence = [
  { proof: "PLAN VERDICT", result: "passed", metric: "PASS", source: "planner · sonnet · 12m", artifact: "prd.json · 13 stories" },
  { proof: "AUDIT REPORT", result: "passed", metric: "0 BLOCKING", source: "auditor · WSJF ordering · 6m", artifact: "verdict: PASS" },
  { proof: "GATE CHECKS", result: "passed", metric: "2 / 2 GATES", source: "implementer 1 · US-001..008", artifact: "typecheck · lint" },
] satisfies {
  proof: string
  result: "passed" | "failed"
  metric: string
  source: string
  artifact: string
}[]

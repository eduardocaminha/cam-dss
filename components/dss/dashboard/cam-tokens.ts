// Shared CAM Runtime design-system maps for the /dashboard tab. The color
// values themselves live as CSS custom properties in dashboard.css (scoped to
// [data-dash-root]); this module only maps the dashboard's domain keys (roles,
// agent states) onto those tokens plus the DS's symbols, labels and corner
// treatments (CAM_DESIGN_SYSTEM.md sections 4.4, 4.5, 6.3, 7.3), so no
// component has to restate them.

import type { AgentState } from "@/components/dss/dashboard/data"

export type RoleKey =
  | "orchestrator"
  | "planner"
  | "auditor"
  | "implementer"
  | "reviewer"
  | "ship"

export type StateKey =
  | "running"
  | "waiting"
  | "recovering"
  | "blocked"
  | "failed"
  | "completed"
  | "unknown"

// Role -> CSS var for its color, and the readable foreground on that fill.
export const roleColorVar: Record<RoleKey, string> = {
  orchestrator: "var(--role-orchestrator)",
  planner: "var(--role-planner)",
  auditor: "var(--role-auditor)",
  implementer: "var(--role-implementer)",
  reviewer: "var(--role-reviewer)",
  ship: "var(--role-ship)",
}

export const roleOnVar: Record<RoleKey, string> = {
  orchestrator: "var(--on-acid)",
  planner: "var(--on-blue)",
  auditor: "var(--on-mint)",
  implementer: "var(--on-orange)",
  reviewer: "var(--on-lilac)",
  ship: "var(--on-deep-pine)",
}

// Role -> clipped-corner class (section 6.3).
export const roleClipClass: Record<RoleKey, string> = {
  orchestrator: "cam-clip-tr-bl",
  planner: "cam-clip-tl",
  implementer: "cam-clip-br",
  reviewer: "cam-clip-tr",
  auditor: "cam-clip-bl",
  // Ship isn't in the DS corner table; give it the bottom-right cut of the
  // implementer family it finalizes, so it still reads as a clipped module.
  ship: "cam-clip-br",
}

// State -> color var, readable foreground, symbol and label (sections 4.5,
// 7.3, 8.4). Every state carries a symbol + text, never color alone.
export const stateColorVar: Record<StateKey, string> = {
  running: "var(--state-running)",
  waiting: "var(--state-waiting)",
  recovering: "var(--state-recovering)",
  blocked: "var(--state-blocked)",
  failed: "var(--state-failed)",
  completed: "var(--state-completed)",
  unknown: "var(--state-unknown)",
}

export const stateOnVar: Record<StateKey, string> = {
  running: "var(--on-acid)",
  waiting: "var(--on-lilac)",
  recovering: "var(--on-blue)",
  blocked: "var(--on-coral)",
  failed: "var(--on-coral)",
  completed: "var(--on-deep-pine)",
  unknown: "var(--on-concrete)",
}

export const stateSymbol: Record<StateKey, string> = {
  running: "→",
  waiting: "○",
  recovering: "↻",
  blocked: "▨",
  failed: "×",
  completed: "✓",
  unknown: "?",
}

export const stateLabel: Record<StateKey, string> = {
  running: "RUNNING",
  waiting: "WAITING",
  recovering: "RECOVERING",
  blocked: "BLOCKED",
  failed: "FAILED",
  completed: "PASSED",
  unknown: "UNKNOWN",
}

// The dashboard's AgentState (done | active | queued) onto DS states.
export const agentStateKey: Record<AgentState, StateKey> = {
  done: "completed",
  active: "running",
  queued: "waiting",
}

import type { RoleKey } from "@/components/dss/dashboard/cam-tokens"

// Proprietary square-grid role marks (CAM_DESIGN_SYSTEM.md section 7.2):
// modular, right-angled, one-color (currentColor), legible from 16px up. Built
// on a 24x24 grid with 2px strokes and square terminals - not a rounded
// outline icon pack. Each mirrors the DS's suggested construction:
//   orchestrator  three worker nodes off a central control rail
//   planner       one input splitting into three checkpoints
//   implementer   two interlocking rectangular blocks
//   reviewer      two diff panels divided by a vertical rule
//   auditor       a square gate with a centered validation mark
//   ship          a crate dispatched outward (tag + merge)
const paths: Record<RoleKey, React.ReactNode> = {
  orchestrator: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="12" y1="5" x2="16" y2="5" />
      <line x1="12" y1="12" x2="16" y2="12" />
      <line x1="12" y1="19" x2="16" y2="19" />
      <rect x="16" y="3" width="5" height="4" />
      <rect x="16" y="10" width="5" height="4" />
      <rect x="16" y="17" width="5" height="4" />
    </>
  ),
  planner: (
    <>
      <line x1="3" y1="12" x2="9" y2="12" />
      <polyline points="9,5 9,19" />
      <line x1="9" y1="5" x2="15" y2="5" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="19" x2="15" y2="19" />
      <rect x="15" y="3" width="4" height="4" />
      <rect x="15" y="10" width="4" height="4" />
      <rect x="15" y="17" width="4" height="4" />
    </>
  ),
  implementer: (
    <>
      <rect x="3" y="4" width="11" height="11" />
      <rect x="10" y="9" width="11" height="11" />
    </>
  ),
  reviewer: (
    <>
      <rect x="3" y="4" width="7" height="16" />
      <rect x="14" y="4" width="7" height="16" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </>
  ),
  auditor: (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <polyline points="8,12 11,15 16,9" />
    </>
  ),
  ship: (
    <>
      <rect x="4" y="10" width="16" height="11" />
      <line x1="12" y1="3" x2="12" y2="13" />
      <polyline points="8,7 12,3 16,7" />
    </>
  ),
}

const roleName: Record<RoleKey, string> = {
  orchestrator: "Orchestrator",
  planner: "Planner",
  implementer: "Implementer",
  reviewer: "Reviewer",
  auditor: "Auditor",
  ship: "Ship",
}

export function RoleIcon({
  role,
  size = 20,
  className,
}: {
  role: RoleKey
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      role="img"
      aria-label={`${roleName[role]} icon`}
    >
      {paths[role]}
    </svg>
  )
}

"use client"

import * as React from "react"

import { useArrowNav } from "@/app/ereader/keyboard-nav"
import { cn } from "@/lib/utils"

// The dashboard sections, one per menu item / view. Overview is not a menu
// item - it renders on every page. The Session view carries both Session and
// PRD, so PRD is not a separate item either.
export const sections = [
  { id: "session", label: "Session" },
  { id: "pipeline", label: "Pipeline" },
  { id: "evidence", label: "Evidence" },
  { id: "stats", label: "Stats" },
] as const

export type ViewId = (typeof sections)[number]["id"]

// The active view comes from the URL hash (#session, ...), so each section has
// its own URL and the back/forward buttons work. Defaults to session.
export function useDashboardView(): ViewId {
  const [view, setView] = React.useState<ViewId>("session")
  React.useEffect(() => {
    const read = () => {
      const hash = window.location.hash.slice(1)
      setView(
        (sections.some((s) => s.id === hash) ? hash : "session") as ViewId
      )
    }
    read()
    window.addEventListener("hashchange", read)
    return () => window.removeEventListener("hashchange", read)
  }, [])
  return view
}

// Thin-stroke 24-grid icons for the rail, in the outline vocabulary of an
// e-reader launcher (book, flow, checked page, bars).
const railIcons: Record<ViewId, React.ReactNode> = {
  session: (
    <>
      <path d="M12 5.2C10.2 3.8 7.4 3.5 4.5 3.8v15.4c2.9-.3 5.7 0 7.5 1.4 1.8-1.4 4.6-1.7 7.5-1.4V3.8c-2.9-.3-5.7 0-7.5 1.4Z" />
      <path d="M12 5.2v15.4" />
    </>
  ),
  pipeline: (
    <>
      <rect x="3" y="9.5" width="5" height="5" />
      <rect x="16" y="9.5" width="5" height="5" />
      <path d="M8 12h8" />
      <path d="M12 12v6.5h4" />
    </>
  ),
  evidence: (
    <>
      <rect x="4" y="3.5" width="16" height="17" />
      <path d="m8 12 3 3 5.5-6.5" />
    </>
  ),
  stats: (
    <>
      <rect x="4" y="12.5" width="3.4" height="7.5" />
      <rect x="10.3" y="7" width="3.4" height="13" />
      <rect x="16.6" y="10" width="3.4" height="10" />
    </>
  ),
}

// The e-reader launcher rail: a vertical strip of big outline icons with tiny
// tracked labels, the active one inverted to an ink block — the BOOX
// Library/Store/Notes idiom. Replaces the old horizontal chip menu.
export function SectionRail() {
  const view = useDashboardView()
  const ref = React.useRef<HTMLElement>(null)
  useArrowNav(ref)
  return (
    <nav ref={ref} className="rail" aria-label="Dashboard sections">
      {sections.map((s) => {
        const active = s.id === view
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active ? "page" : undefined}
            className={cn("rail-item", active && "rail-item-active")}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              {railIcons[s.id]}
            </svg>
            <span>{s.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

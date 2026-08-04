"use client"

import * as React from "react"

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

// Hard-edged menu items that switch the visible section. The active item is
// filled; the top-right corner notches on hover.
export function SectionMenu() {
  const view = useDashboardView()
  return (
    <nav className="dash-no-scrollbar flex min-w-0 gap-2 overflow-x-auto">
      {sections.map((s) => {
        const active = s.id === view
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "cam-menu-item cam-label shrink-0 border-2 border-(--cam-border) px-3 py-2 text-[11px] hover:bg-(--cam-fg) hover:text-(--cam-surface)",
              active
                ? "bg-(--cam-fg) text-(--cam-surface)"
                : "text-(--cam-fg)"
            )}
          >
            {s.label}
          </a>
        )
      })}
    </nav>
  )
}

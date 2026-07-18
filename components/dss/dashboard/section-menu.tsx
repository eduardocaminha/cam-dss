// Section navigation: hard-edged menu items (uppercase mono) that jump to each
// section of the single-page dashboard via anchor links.
const sections = [
  { id: "overview", label: "Overview" },
  { id: "session", label: "Session" },
  { id: "pipeline", label: "Pipeline" },
  { id: "prd", label: "PRD" },
  { id: "evidence", label: "Evidence" },
  { id: "stats", label: "Stats" },
]

export function SectionMenu() {
  return (
    <nav className="dash-no-scrollbar flex min-w-0 gap-2 overflow-x-auto">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="cam-menu-item cam-label shrink-0 border-2 border-(--cam-border) px-3 py-2 text-[11px] text-(--cam-fg) hover:bg-(--cam-fg) hover:text-(--cam-surface)"
        >
          {s.label}
        </a>
      ))}
    </nav>
  )
}

import { cn } from "@/lib/utils"

// Section header, e-book register: a small tracked small-caps label with a
// hairline rule underneath — the quiet reader vocabulary, not a display
// headline.
export function SectionLabel({
  children,
  note,
  action,
  className,
}: {
  children: React.ReactNode
  note?: React.ReactNode
  // Optional controls pinned to the right of the heading row (e.g. the
  // pipeline's graph/cards view switch).
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline gap-3">
        <h2 className="text-[11.5px] font-semibold tracking-[0.1em] uppercase text-(--cam-fg)">
          {children}
        </h2>
        {note && (
          <span className="cam-label text-[10px] text-(--cam-fg-muted)">
            {note}
          </span>
        )}
        {action && <span className="ml-auto self-center">{action}</span>}
      </div>
      <div aria-hidden className="border-t border-(--cam-line)" />
    </div>
  )
}

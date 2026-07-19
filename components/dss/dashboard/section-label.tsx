import { cn } from "@/lib/utils"

// Section header: an uppercase display label with an optional mono note. No
// rule/separator bar - the label stands on its own.
export function SectionLabel({
  children,
  note,
  className,
}: {
  children: React.ReactNode
  note?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <h2 className="cam-display text-xl text-(--cam-fg)">{children}</h2>
      {note && (
        <span className="cam-label text-[11px] text-(--cam-fg-muted)">
          {note}
        </span>
      )}
    </div>
  )
}

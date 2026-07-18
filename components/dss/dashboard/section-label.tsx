import { cn } from "@/lib/utils"

// Signage-style section header: an uppercase display label, an optional mono
// note, and a hard rule that runs to the edge (CAM_DESIGN_SYSTEM.md section 5
// labels + section 6 rails). One per major dashboard section.
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
    <div className={cn("flex items-baseline gap-4", className)}>
      <h2 className="cam-display text-xl text-(--cam-fg)">{children}</h2>
      {note && (
        <span className="cam-label text-[11px] text-(--cam-fg-muted)">
          {note}
        </span>
      )}
      <span
        aria-hidden
        className="h-0.5 flex-1 self-center bg-(--cam-border)"
      />
    </div>
  )
}

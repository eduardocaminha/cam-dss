"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Grab-and-slide horizontal scroller: pointer down anywhere on the rail and
// drag to scroll it. Cursor is the open hand, closing while dragging.
export function DragScroll({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef({ active: false, startX: 0, startLeft: 0 })

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
    }
    el.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || !drag.current.active) return
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX)
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.active = false
    ref.current?.releasePointerCapture?.(e.pointerId)
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "cursor-grab touch-pan-y select-none active:cursor-grabbing",
        className
      )}
    >
      {children}
    </div>
  )
}

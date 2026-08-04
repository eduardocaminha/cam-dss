"use client"

import { useEffect, type RefObject } from "react"

// Arrow-key navigation for any group of controls: the rail, the header
// toggles, the pipeline view switch, the graph nodes. Tab moves BETWEEN
// groups (browser default); inside a group the arrows walk the items and
// Enter/Space activates, which is what a device with a d-pad — or a reader
// with page keys — expects.
//
// `step` is how far Up/Down jump: 1 for a list, the row length for a grid
// (the pipeline graph is 5 nodes wide, so Up/Down move by a whole row).

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useArrowNav(
  ref: RefObject<HTMLElement | SVGElement | null>,
  step = 1,
) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const onKeyDown = (event: Event) => {
      const e = event as KeyboardEvent
      const horizontal = e.key === "ArrowLeft" || e.key === "ArrowRight"
      const vertical = e.key === "ArrowUp" || e.key === "ArrowDown"
      if (!horizontal && !vertical) return

      const items = Array.from(
        root.querySelectorAll<HTMLElement | SVGElement>(FOCUSABLE),
      )
      if (items.length === 0) return

      const active = document.activeElement
      const from = items.findIndex((el) => el === active)
      if (from === -1) return

      const delta = vertical ? step : 1
      const forward = e.key === "ArrowRight" || e.key === "ArrowDown"
      // Clamp rather than wrap: on a grid, wrapping past the end lands
      // somewhere unrelated, which reads as the focus getting lost.
      const to = Math.min(
        items.length - 1,
        Math.max(0, from + (forward ? delta : -delta)),
      )
      if (to === from) return

      e.preventDefault()
      ;(items[to] as HTMLElement).focus()
    }

    root.addEventListener("keydown", onKeyDown)
    return () => root.removeEventListener("keydown", onKeyDown)
  }, [ref, step])
}

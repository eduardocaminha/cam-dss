"use client"

import { useEffect, useRef, useState } from "react"

import { useArrowNav } from "./keyboard-nav"
import { flashScreen } from "./refresh-control"

// Page width, the reader's own margin control: "page" is the narrow reading
// column (generous paper, the default), "wide" opens the measure so the PRD
// table can show its full strings without truncating. The choice is a device
// preference, so it persists; switching flashes the panel like any full
// redraw.

const KEY = "gateship:width"
export type PageWidth = "page" | "wide"

const listeners = new Set<() => void>()
let current: PageWidth = "page"

function apply(next: PageWidth) {
  current = next
  document.documentElement.dataset.pageWidth = next
  for (const l of listeners) l()
}

export function useWidthToggle() {
  const [, force] = useState(0)

  useEffect(() => {
    const rerender = () => force((n) => n + 1)
    listeners.add(rerender)
    const stored = window.localStorage.getItem(KEY)
    apply(stored === "wide" ? "wide" : "page")
    return () => {
      listeners.delete(rerender)
    }
  }, [])

  const set = (next: PageWidth) => {
    window.localStorage.setItem(KEY, next)
    apply(next)
    flashScreen()
  }

  return { width: current, set }
}

/** Two-state margin control: page / wide. */
export function WidthToggle() {
  const { width, set } = useWidthToggle()
  const ref = useRef<HTMLSpanElement>(null)
  useArrowNav(ref)
  return (
    <span
      ref={ref}
      className="width-toggle"
      role="group"
      aria-label="Page width"
    >
      <button
        type="button"
        aria-pressed={width === "page"}
        onClick={() => set("page")}
        title="Reading column"
      >
        <svg viewBox="0 0 16 16" aria-hidden>
          <rect x="4.5" y="2.5" width="7" height="11" />
        </svg>
      </button>
      <button
        type="button"
        aria-pressed={width === "wide"}
        onClick={() => set("wide")}
        title="Full width"
      >
        <svg viewBox="0 0 16 16" aria-hidden>
          <rect x="1.5" y="2.5" width="13" height="11" />
        </svg>
      </button>
    </span>
  )
}

"use client"

import { useEffect, useState } from "react"

// Module-level hook so any client island (a view change, the width toggle,
// the theme switch) can fire the panel flash — an e-ink screen flashes on
// any full page change.
let extFlash: (() => void) | null = null

/** Play the page-turn flash (short single dim). */
export function flashScreen() {
  extFlash?.()
}

/**
 * The refresh flash overlay. It starts server-rendered, so the flash also
 * plays on first paint — the page "draws in" like a real screen — and each
 * trigger remounts it (key bump) to replay the animation. Fixed-position and
 * pointer-inert, so it never affects layout.
 *
 * The first paint uses the full boot refresh (double flicker); every later
 * trigger uses the quick page-turn variant, the way a reader turns pages far
 * faster than it boots.
 */
export function RefreshOverlay() {
  const [flash, setFlash] = useState({ tick: 1, quick: false })

  useEffect(() => {
    extFlash = () => setFlash((f) => ({ tick: f.tick + 1, quick: true }))
    return () => {
      extFlash = null
    }
  }, [])

  return (
    <div
      key={flash.tick}
      className={flash.quick ? "eink-flash eink-flash-quick" : "eink-flash"}
      aria-hidden
    />
  )
}

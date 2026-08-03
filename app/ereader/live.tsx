"use client"

import { useSyncExternalStore } from "react"

// Live bits, animated the only way an e-ink panel can animate: discrete
// state jumps. Region redraws (the `partial` class) briefly invert, like a
// partial refresh.

function subscribeSecond(cb: () => void) {
  const id = setInterval(cb, 1000)
  return () => clearInterval(id)
}

function fmtClock(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

/** Real wall clock. Remounts (key) once a minute, so the digits region does
 *  a partial-refresh flicker exactly when they change. */
export function Clock() {
  const time = useSyncExternalStore(
    subscribeSecond,
    () => fmtClock(new Date()),
    () => "3:03 PM",
  )
  return (
    <span key={time} className="partial">
      {time}
    </span>
  )
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/** Real date, same discrete-jump contract as the clock. */
export function DateStamp() {
  const date = useSyncExternalStore(
    subscribeSecond,
    () => fmtDate(new Date()),
    () => "Mon, Jul 28, 2026",
  )
  return <span>{date}</span>
}

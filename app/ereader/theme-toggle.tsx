"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import { flashScreen } from "./refresh-control"

// Dark mode, the e-reader way: the panel inverts (ink field, paper text),
// which is exactly what a Kindle or BOOX does — not a different theme, the
// same screen with the polarity flipped. Rides next-themes (the project's
// ThemeProvider in app/layout.tsx), so the choice persists and the class
// lands on <html> before paint.
// next-themes only knows the real theme after mount, so the first paint has
// to match the server's markup. A no-op store is the cheap way to say "false
// on the server, true once hydrated" without a setState-in-effect.
const noopSubscribe = () => () => {}
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={isDark ? "Light panel" : "Dark panel"}
      title={isDark ? "Light panel" : "Dark panel"}
      onClick={() => {
        setTheme(isDark ? "light" : "dark")
        flashScreen()
      }}
    >
      {/* Half-filled disc: the polarity mark of a reader's display setting. */}
      <svg viewBox="0 0 16 16" aria-hidden>
        <circle cx="8" cy="8" r="5.5" />
        <path d="M8 2.5A5.5 5.5 0 0 1 8 13.5Z" fill="currentColor" />
      </svg>
    </button>
  )
}

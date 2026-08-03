import type { Metadata } from "next"

import "./ereader.css"
import "./dashboard.css"

import { DashboardBody } from "./dashboard-body"

// Typography is all Saans: the dogfooded Saans VF (via --font-sans from the
// root layout's font-saans.css) for UI and content, and Saans Mono (declared
// in ereader.css from public/fonts) for machine data.

// Gateship is the product's display name (cam-cli CONTEXT.md, ADR-0045);
// the invoked command and every internal name (slash commands, branches,
// markers) deliberately stay `cam` — the rebrand is display-only.
export const metadata: Metadata = {
  title: "Gateship",
  description: "Gateship loop dashboard, e-ink edition",
}

export default function Page() {
  return (
    <div className="eink">
      <svg className="eink-defs" aria-hidden>
        <filter id="eink-rough">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.35"
            numOctaves="2"
            seed="3"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="0.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="eink-grain" aria-hidden />
      <div className="eink-grain-dark" aria-hidden />

      <main className="dash-main">
        <DashboardBody />
      </main>
    </div>
  )
}

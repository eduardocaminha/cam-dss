#!/usr/bin/env node
// Copies the Saans variable font from cam-profile (the single source of
// truth for the font binary) into public/fonts/. Never commit the result:
// the Displaay license prohibits redistributing the font file to third
// parties, so it stays gitignored and is fetched fresh per machine.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const REL_PATH = "design-system/fonts/SaansVF.woff2"
const LOCAL_CAM_PROFILE = path.resolve(
  import.meta.dirname,
  "../../cam-profile",
  REL_PATH
)
const DEST = path.resolve(import.meta.dirname, "../public/fonts/SaansVF.woff2")

fs.mkdirSync(path.dirname(DEST), { recursive: true })

if (fs.existsSync(LOCAL_CAM_PROFILE)) {
  fs.copyFileSync(LOCAL_CAM_PROFILE, DEST)
  console.log(`Copied from local checkout: ${LOCAL_CAM_PROFILE}`)
} else {
  console.log("Local cam-profile checkout not found, fetching via gh api...")
  const raw = execFileSync(
    "gh",
    [
      "api",
      `repos/eduardocaminha/cam-profile/contents/${REL_PATH}`,
      "-H",
      "Accept: application/vnd.github.raw",
    ],
    { maxBuffer: 1024 * 1024 * 10 }
  )
  fs.writeFileSync(DEST, raw)
  console.log("Fetched from github.com/eduardocaminha/cam-profile")
}

console.log(`Saans font synced to ${DEST}`)

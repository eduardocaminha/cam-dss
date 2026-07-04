#!/usr/bin/env node
// Installs one shadcn block and namespaces its files so multiple blocks of
// the same family (sidebar-01..16, login-01..05, signup-01..05) can coexist:
// the page moves to app/b/<block>/page.tsx and its components move to
// components/blocks/<block>/, with imports rewritten to match.
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const block = process.argv[2]
if (!block) {
  console.error("Usage: node scripts/add-block.mjs <block-name>")
  process.exit(1)
}

const COLLISION_DIRS = ["app/dashboard", "app/login", "app/signup"]
for (const dir of COLLISION_DIRS) {
  if (fs.existsSync(dir)) {
    console.error(
      `${dir} already exists - a previous block run left it behind. Resolve before continuing.`
    )
    process.exit(1)
  }
}

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] })
}

sh(`pnpm dlx shadcn@latest add ${block} -y`)

// git status --porcelain collapses a wholly-untracked directory into a
// single "app/dashboard/" line instead of listing its files; ls-files
// --others lists every untracked file individually.
const newFiles = sh("git ls-files --others --exclude-standard")
  .split("\n")
  .filter(Boolean)

const newAppFiles = newFiles.filter((f) => f.startsWith("app/"))
const newComponentFiles = newFiles.filter((f) => /^components\/[^/]+\.tsx$/.test(f))

const pageFiles = newAppFiles.filter((f) => /^app\/[^/]+\/page\.tsx$/.test(f))
if (pageFiles.length !== 1) {
  console.error(
    `Expected exactly 1 new page file for ${block}, found ${pageFiles.length}: ${pageFiles.join(", ")}`
  )
  process.exit(1)
}

const oldPageDir = path.dirname(pageFiles[0])
const newPageDir = path.join("app/b", block)
fs.mkdirSync(newPageDir, { recursive: true })

const siblingFiles = newAppFiles.filter((f) => f.startsWith(oldPageDir + "/"))
for (const f of siblingFiles) {
  fs.renameSync(f, path.join(newPageDir, path.basename(f)))
}
if (fs.existsSync(oldPageDir) && fs.readdirSync(oldPageDir).length === 0) {
  fs.rmdirSync(oldPageDir)
}

const newComponentDir = path.join("components/blocks", block)
if (newComponentFiles.length === 0) {
  console.warn(`${block}: no new components/*.tsx files detected (page-only block?)`)
} else {
  fs.mkdirSync(newComponentDir, { recursive: true })
}

const componentNames = newComponentFiles.map((f) => path.basename(f, ".tsx"))
for (const f of newComponentFiles) {
  fs.renameSync(f, path.join(newComponentDir, path.basename(f)))
}

const movedFiles = [
  path.join(newPageDir, path.basename(pageFiles[0])),
  ...newComponentFiles.map((f) => path.join(newComponentDir, path.basename(f))),
]
for (const file of movedFiles) {
  let content = fs.readFileSync(file, "utf8")
  for (const name of componentNames) {
    const re = new RegExp(`@/components/${name}(?=["'\`])`, "g")
    content = content.replace(re, `@/components/blocks/${block}/${name}`)
  }
  fs.writeFileSync(file, content)
}

console.log(
  `${block}: page -> ${newPageDir}, components (${componentNames.length}) -> ${newComponentDir}`
)

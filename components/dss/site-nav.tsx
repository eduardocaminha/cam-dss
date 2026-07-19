"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const links = [
  { href: "/components", label: "Components" },
  { href: "/tokens", label: "Tokens" },
  { href: "/blocks", label: "Blocks" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/diario", label: "Diário" },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    // min-w-0 + overflow-x-auto so the links scroll within whatever space is
    // left after the logo and theme controls instead of widening the header
    // (and the page) on narrow viewports. Scrollbar hidden inline (globals.css
    // is off-limits - shadcn apply rewrites it).
    <nav className="flex min-w-0 items-center gap-4 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {links.map((link) => {
        const active = pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 font-medium whitespace-nowrap transition-colors hover:text-foreground",
              active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

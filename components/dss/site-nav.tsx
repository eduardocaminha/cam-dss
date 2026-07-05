"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const links = [
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-4 text-sm">
      {links.map((link) => {
        const active = pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-medium transition-colors hover:text-foreground",
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

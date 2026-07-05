"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { componentGallery } from "@/components/dss/component-gallery"
import { cn } from "@/lib/utils"

export function ComponentsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {componentGallery.map((entry) => {
        const href = `/components/${entry.slug}`
        const active = pathname === href

        return (
          <Link
            key={entry.slug}
            href={href}
            className={cn(
              "rounded-md px-2 py-1 hover:bg-muted hover:text-foreground",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {entry.title}
          </Link>
        )
      })}
    </nav>
  )
}

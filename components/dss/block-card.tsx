import Link from "next/link"

import type { Block } from "@/lib/blocks"

export function BlockCard({ slug, title }: Block) {
  return (
    <Link
      href={`/b/${slug}`}
      target="_blank"
      className="group flex flex-col gap-2 rounded-lg border p-2 transition-colors hover:bg-muted"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
        <iframe
          src={`/b/${slug}`}
          title={title}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute top-0 left-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0"
        />
      </div>
      <div className="flex flex-col gap-0.5 px-1 pb-1">
        <span className="font-mono text-xs text-muted-foreground">{slug}</span>
        <span className="text-sm">{title}</span>
      </div>
    </Link>
  )
}

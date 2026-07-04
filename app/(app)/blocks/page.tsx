import { BlockCard } from "@/components/dss/block-card"
import { blockFamilies } from "@/lib/blocks"

export default function BlocksPage() {
  return (
    <div className="flex flex-col gap-10 p-6">
      {blockFamilies.map((family) => (
        <section key={family.family} className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {family.family}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {family.blocks.map((block) => (
              <BlockCard key={block.slug} {...block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

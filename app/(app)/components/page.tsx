import { componentGallery } from "@/components/dss/component-gallery"

export default function ComponentsPage() {
  return (
    <div className="flex">
      <aside className="sticky top-0 hidden h-svh w-48 shrink-0 overflow-y-auto border-r p-4 lg:block">
        <nav className="flex flex-col gap-1 text-sm">
          {componentGallery.map((entry) => (
            <a
              key={entry.slug}
              href={`#${entry.slug}`}
              className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {entry.title}
            </a>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        {componentGallery.map((entry) => (
          <section key={entry.slug} id={entry.slug} className="scroll-mt-4 border-b">
            <h2 className="px-6 pt-6 text-sm font-semibold text-muted-foreground">
              {entry.title}
            </h2>
            {entry.fullBleed ? (
              <div className="h-[600px] overflow-hidden">
                <entry.Component />
              </div>
            ) : (
              <entry.Component />
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

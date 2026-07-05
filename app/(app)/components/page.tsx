import { Badge } from "@/components/ui/badge"
import { componentGallery } from "@/components/dss/component-gallery"
import { getComponentApi } from "@/lib/component-api"

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
        {componentGallery.map((entry) => {
          const api = getComponentApi(entry.slug)

          return (
            <section
              key={entry.slug}
              id={entry.slug}
              // Mirrors ExampleWrapper's own bg-muted dark:bg-background (two
              // semantic tokens, not a raw color override) so the title/API
              // block above it doesn't show a seam against the page's plain
              // background in light mode.
              // eslint-disable-next-line no-restricted-syntax
              className="scroll-mt-4 border-b bg-muted dark:bg-background"
            >
              <h2 className="px-6 pt-6 text-sm font-semibold text-muted-foreground">
                {entry.title}
              </h2>
              {api.length > 0 && (
                <div className="flex flex-col gap-2 px-6 pt-2 pb-4">
                  {api.map(({ prop, values }) => (
                    <div key={prop} className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {prop}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {values.map((value) => (
                          <Badge key={value} variant="outline">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {entry.fullBleed ? (
                // contain: paint establishes a containing block for the
                // example's position:fixed children (shadcn's Sidebar panel
                // is fixed-positioned) - without it, the sidebar escapes this
                // box and pins itself to the viewport as the page scrolls.
                <div className="h-[600px] overflow-hidden" style={{ contain: "paint" }}>
                  <entry.Component />
                </div>
              ) : (
                <entry.Component />
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

import { RADIUS_STEPS, getCssTokens } from "@/lib/css-tokens"

export default function TokensPage() {
  const { colors, radiusBase } = getCssTokens()

  return (
    <div className="flex flex-col gap-10 p-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Colors
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((token) => (
            <div
              key={token.name}
              className="flex flex-col gap-2 rounded-lg border p-3"
            >
              <span className="font-mono text-xs text-muted-foreground">
                --{token.name}
              </span>
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <div
                    className="h-10 rounded-md border"
                    style={{ backgroundColor: token.light }}
                  />
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {token.light}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div
                    className="h-10 rounded-md border"
                    style={{ backgroundColor: token.dark }}
                  />
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {token.dark}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Radius
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          --radius: {radiusBase}
        </p>
        <div className="flex flex-wrap gap-6">
          {RADIUS_STEPS.map((step) => (
            <div key={step.name} className="flex flex-col items-center gap-2">
              <div
                className={`h-16 w-16 border bg-muted ${step.className}`}
              />
              <span className="font-mono text-xs text-muted-foreground">
                {step.className}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Fonts
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <span className="font-mono text-xs text-muted-foreground">
              font-sans (Saans)
            </span>
            <p className="font-sans text-2xl">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <span className="font-mono text-xs text-muted-foreground">
              font-mono (Geist Mono)
            </span>
            <p className="font-mono text-2xl">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

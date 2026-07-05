import { Badge } from "@/components/ui/badge"
import { themeDimensions } from "@/lib/theme-dimensions"

export default function ThemePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <p className="text-sm text-muted-foreground">
        The 10 dimensions the shared preset covers. Editing the design system
        means picking a value here (see <code>PRESET.md</code> for the
        current code and the editing loop) - not hand-editing components.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {themeDimensions.map((dim) => (
          <div key={dim.key} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">{dim.label}</h2>
              <Badge>{dim.current}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dim.values.map((value) => (
                <Badge key={value} variant="outline">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

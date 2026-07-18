"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { CamPanel } from "@/components/dss/dashboard/cam-panel"
import { tokensPerIteration } from "@/components/dss/dashboard/data"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// Monochrome, two-tone instrumentation - no gradient fills, hard bars, radius
// 0 (DS section 6 + anti-pattern "decorative charts").
const chartConfig = {
  worker: {
    label: "Worker",
    color: "var(--cam-fg)",
  },
  orch: {
    label: "Orchestrator",
    color: "var(--cam-fg-muted)",
  },
} satisfies ChartConfig

export function TokensCard({ className }: { className?: string }) {
  return (
    <CamPanel className={cn("flex flex-col gap-4 p-5", className)}>
      <div className="flex flex-col gap-1">
        <span className="cam-label text-[11px] text-(--cam-fg)">tokens</span>
        <span className="cam-mono text-xs text-(--cam-fg-muted)">
          k tokens per iteration · worker vs orchestrator
        </span>
      </div>
      <div className="flex-1">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart accessibilityLayer data={tokensPerIteration}>
            <CartesianGrid vertical={false} stroke="var(--cam-line)" />
            <XAxis
              dataKey="iteration"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="worker"
              fill="var(--color-worker)"
              radius={0}
              maxBarSize={22}
            />
            <Bar
              dataKey="orch"
              fill="var(--color-orch)"
              radius={0}
              maxBarSize={22}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </CamPanel>
  )
}

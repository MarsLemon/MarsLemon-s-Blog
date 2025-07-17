"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[]
  config: ChartConfig
  chartType?: "line" | "bar" | "area"
  height?: number
  width?: number
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      data,
      config,
      chartType = "line",
      height = 300,
      width = 500,
      showTooltip = true,
      showLegend = true,
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      className,
      ...props
    },
    ref,
  ) => {
    const ChartComponent = chartType === "line" ? LineChart : chartType === "bar" ? BarChart : AreaChart
    const DataComponent = chartType === "line" ? Line : chartType === "bar" ? Bar : Area

    return (
      <ChartContainer config={config} className={cn("min-h-[200px] w-full", className)} ref={ref} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
            {showXAxis && (
              <XAxis
                dataKey={Object.keys(data[0] || {})[0]} // Assuming first key is x-axis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
            )}
            {showYAxis && <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={["dataMin", "dataMax"]} />}
            {showTooltip && <ChartTooltip cursor={false} content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {Object.entries(config).map(([key, { color, label, type }]) => (
              <DataComponent
                key={key}
                dataKey={key}
                name={label}
                type="monotone"
                stroke={color}
                fill={color}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </ChartContainer>
    )
  },
)
Chart.displayName = "Chart"

export { Chart }

"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function ReferenceCard() {
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="flex-shrink-0 space-y-1 pb-0">
        <CardDescription>Enquiries</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          42
          <span className="ml-1 font-sans text-sm font-normal tracking-normal text-muted-foreground">
            last 7 days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col justify-end overflow-hidden p-0">
        <ChartContainer
          className="h-full min-h-0"
          config={{
            enquiries: {
              label: "Enquiries",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <AreaChart
            accessibilityLayer
            data={[
              { date: "2024-03-01", enquiries: 5 },
              { date: "2024-03-02", enquiries: 8 },
              { date: "2024-03-03", enquiries: 6 },
              { date: "2024-03-04", enquiries: 9 },
              { date: "2024-03-05", enquiries: 4 },
              { date: "2024-03-06", enquiries: 7 },
              { date: "2024-03-07", enquiries: 3 },
            ]}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            height={100}
            width={100}
          >
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, "dataMax + 2"]} hide />
            <defs>
              <linearGradient id="fillEnquiries" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-enquiries)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-enquiries)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="enquiries"
              type="natural"
              fill="url(#fillEnquiries)"
              fillOpacity={0.4}
              stroke="var(--color-enquiries)"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => (
                <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                  Enquiries
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                  </div>
                </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

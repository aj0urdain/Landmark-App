"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "Average Sale Price per Property for Last 3 Portfolios";

const chartData = [
  { portfolio: "June", avgSalePrice: 3020650 },
  { portfolio: "August", avgSalePrice: 4230097 },
  { portfolio: "September", avgSalePrice: 3635824 },
];

const chartConfig = {
  June: {
    label: "June" as string,
    color: "hsl(var(--blue))" as string,
  },
  August: {
    label: "August" as string,
    color: "hsl(var(--green))" as string,
  },
  September: {
    label: "September" as string,
    color: "hsl(var(--red))" as string,
  },
} satisfies ChartConfig;

export function StackedBar() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Average Sale Price per Property</CardTitle>
        <CardDescription>For the last 3 portfolios</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="portfolio"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                }).format(value)
              }
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey="avgSalePrice"
                fill={chartConfig[key as keyof typeof chartConfig].color} // eslint-disable-line
                radius={4}
                name={key}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average sale price for the last 3 portfolios
        </div>
      </CardFooter>
    </Card>
  );
}

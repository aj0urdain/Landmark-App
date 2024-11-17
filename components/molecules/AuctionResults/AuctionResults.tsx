import React from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Gavel, ChevronLeft, ChevronRight, ChevronsUp, ChevronsDown } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, CartesianGrid, XAxis, Area } from 'recharts';
import { Dot } from '@/components/atoms/Dot/Dot';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface AuctionResultsData {
  portfolioId: number;
  location: string;
  successRate: number;
  volume: number;
  averageSalePrice: number;
  totalPropertiesSold: number;
  soldPrior: number;
  registeredBidders?: number;
  averageYield: number;
  blendedYield: number;
}

const auctionData: Record<string, Record<string, AuctionResultsData>> = {
  '172': {
    Sydney: {
      portfolioId: 172,
      location: 'Sydney',
      successRate: 83.0,
      volume: 28635000,
      averageSalePrice: 2863500,
      totalPropertiesSold: 10,
      soldPrior: 2,
      averageYield: 6.47,
      blendedYield: 6.12,
    },
    Melbourne: {
      portfolioId: 172,
      location: 'Melbourne',
      successRate: 82.35,
      volume: 64532683,
      averageSalePrice: 4609477,
      totalPropertiesSold: 14,
      soldPrior: 4,
      averageYield: 5.49,
      blendedYield: 5.6,
    },
    Brisbane: {
      portfolioId: 172,
      location: 'Brisbane',
      successRate: 53.85,
      volume: 18975000,
      averageSalePrice: 2710714,
      totalPropertiesSold: 7,
      soldPrior: 4,
      averageYield: 6.68,
      blendedYield: 6.46,
    },
    Total: {
      portfolioId: 172,
      location: 'Total',
      successRate: 73.81,
      volume: 112142683,
      averageSalePrice: 3617506,
      totalPropertiesSold: 31,
      soldPrior: 10,
      registeredBidders: 166,
      averageYield: 6.08,
      blendedYield: 4.88,
    },
  },
  '171': {
    Sydney: {
      portfolioId: 171,
      location: 'Sydney',
      successRate: 33.33,
      volume: 18214000,
      averageSalePrice: 6071333,
      totalPropertiesSold: 3,
      soldPrior: 0,
      averageYield: 6.15,
      blendedYield: 6.21,
    },
    Melbourne: {
      portfolioId: 171,
      location: 'Melbourne',
      successRate: 66.67,
      volume: 18410000,
      averageSalePrice: 2301250,
      totalPropertiesSold: 8,
      soldPrior: 1,
      averageYield: 5.51,
      blendedYield: 5.41,
    },
    Brisbane: {
      portfolioId: 171,
      location: 'Brisbane',
      successRate: 100.0,
      volume: 25185000,
      averageSalePrice: 4197500,
      totalPropertiesSold: 6,
      soldPrior: 1,
      averageYield: 6.47,
      blendedYield: 6.22,
    },
    Total: {
      portfolioId: 171,
      location: 'Total',
      successRate: 62.96,
      volume: 61809000,
      averageSalePrice: 3635824,
      totalPropertiesSold: 17,
      soldPrior: 2,
      registeredBidders: 90,
      averageYield: 5.96,
      blendedYield: 5.97,
    },
  },
  '170': {
    Sydney: {
      portfolioId: 170,
      location: 'Sydney',
      successRate: 88.89,
      volume: 82097000,
      averageSalePrice: 5131063,
      totalPropertiesSold: 16,
      soldPrior: 2,
      averageYield: 5.35,
      blendedYield: 5.17,
    },
    Melbourne: {
      portfolioId: 170,
      location: 'Melbourne',
      successRate: 60.0,
      volume: 28483000,
      averageSalePrice: 3164778,
      totalPropertiesSold: 9,
      soldPrior: 1,
      averageYield: 5.75,
      blendedYield: 5.94,
    },
    Brisbane: {
      portfolioId: 170,
      location: 'Brisbane',
      successRate: 66.67,
      volume: 20553000,
      averageSalePrice: 3425500,
      totalPropertiesSold: 6,
      soldPrior: 1,
      averageYield: 6.68,
      blendedYield: 6.67,
    },
    Total: {
      portfolioId: 170,
      location: 'Total',
      successRate: 72.09,
      volume: 131133000,
      averageSalePrice: 4230097,
      totalPropertiesSold: 31,
      soldPrior: 4,
      registeredBidders: 158,
      averageYield: 5.74,
      blendedYield: 5.61,
    },
  },
};

const metrics = [
  { label: 'Success Rate', key: 'successRate', format: 'percentage' },
  { label: 'Volume', key: 'volume', format: 'currency' },
  { label: 'Average Sale Price', key: 'averageSalePrice', format: 'currency' },
  { label: 'Total Properties Sold', key: 'totalPropertiesSold', format: 'number' },
  { label: 'Sold Prior', key: 'soldPrior', format: 'number' },
  { label: 'Average Yield', key: 'averageYield', format: 'percentage' },
  { label: 'Blended Yield', key: 'blendedYield', format: 'percentage' },
] as const;

const getChartData = (metric: string) => {
  return [
    {
      portfolio: '170',
      Sydney: auctionData['170'].Sydney[metric as keyof AuctionResultsData],
      Melbourne: auctionData['170'].Melbourne[metric as keyof AuctionResultsData],
      Brisbane: auctionData['170'].Brisbane[metric as keyof AuctionResultsData],
      Total: auctionData['170'].Total[metric as keyof AuctionResultsData],
    },
    {
      portfolio: '171',
      Sydney: auctionData['171'].Sydney[metric as keyof AuctionResultsData],
      Melbourne: auctionData['171'].Melbourne[metric as keyof AuctionResultsData],
      Brisbane: auctionData['171'].Brisbane[metric as keyof AuctionResultsData],
      Total: auctionData['171'].Total[metric as keyof AuctionResultsData],
    },
    {
      portfolio: '172',
      Sydney: auctionData['172'].Sydney[metric as keyof AuctionResultsData],
      Melbourne: auctionData['172'].Melbourne[metric as keyof AuctionResultsData],
      Brisbane: auctionData['172'].Brisbane[metric as keyof AuctionResultsData],
      Total: auctionData['172'].Total[metric as keyof AuctionResultsData],
    },
  ];
};

const chartConfig = {
  Sydney: {
    label: 'Sydney',
    color: '#f89c28',
  },
  Melbourne: {
    label: 'Melbourne',
    color: '#cd4f9d',
  },
  Brisbane: {
    label: 'Brisbane',
    color: '#93d4eb',
  },
  Total: {
    label: 'Total',
    color: 'hsl(var(--green))',
  },
} satisfies ChartConfig;

const AuctionResults = () => {
  const [selectedLocation, setSelectedLocation] = React.useState('Total');
  const [currentMetricIndex, setCurrentMetricIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const currentPortfolio = '172';
  const INTERVAL_TIME = 5000;
  const PROGRESS_INTERVAL = 50;
  const TRANSITION_DURATION = 2500;

  const handleMetricChange = (newIndex: number) => {
    setIsTransitioning(true);
    setProgress(0);
    setCurrentMetricIndex(newIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  };

  React.useEffect(() => {
    if (isPaused || isTransitioning) return;

    const interval = setInterval(() => {
      handleMetricChange(
        currentMetricIndex === metrics.length - 1 ? 0 : currentMetricIndex + 1,
      );
    }, INTERVAL_TIME);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100 || isTransitioning) return prev;
        return prev + 100 / (INTERVAL_TIME / PROGRESS_INTERVAL);
      });
    }, PROGRESS_INTERVAL);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPaused, isTransitioning, currentMetricIndex]);

  const handlePrevMetric = () => {
    handleMetricChange(
      currentMetricIndex === 0 ? metrics.length - 1 : currentMetricIndex - 1,
    );
  };

  const handleNextMetric = () => {
    handleMetricChange(
      currentMetricIndex === metrics.length - 1 ? 0 : currentMetricIndex + 1,
    );
  };

  const getPreviousPortfolioValue = (metric: string, location: string) => {
    const previousPortfolio = '171';
    return auctionData[previousPortfolio][location][metric as keyof AuctionResultsData];
  };

  const currentMetric = metrics[currentMetricIndex];
  const value =
    auctionData[currentPortfolio][selectedLocation][
      currentMetric.key as keyof AuctionResultsData
    ];
  const previousValue = getPreviousPortfolioValue(currentMetric.key, selectedLocation);

  const getValueFormat = (metric: string, value: number) => {
    switch (metric) {
      case 'successRate':
      case 'averageYield':
      case 'blendedYield':
        return { decimals: 2, prefix: '', suffix: '%' };
      case 'volume':
      case 'averageSalePrice':
        if (value >= 1000000) {
          const millions = value / 1000000;
          return {
            decimals: 2,
            prefix: '$',
            suffix: 'M',
            overrideValue: millions,
          };
        }
        return { decimals: 0, prefix: '$', suffix: '' };
      default:
        return { decimals: 0, prefix: '', suffix: '' };
    }
  };

  const format = getValueFormat(currentMetric.key, value as number);
  const showTrend = previousValue !== undefined;
  const trend = showTrend ? (value as number) > (previousValue as number) : null;

  return (
    <Card
      className="col-span-4 flex h-[360px] flex-col opacity-80 hover:opacity-100 transition-all duration-150 ease-linear"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CardTitle className="p-6 pb-2">
        <div className="flex justify-between w-full items-center">
          <Link
            href={`/wiki/library/portfolios/${currentPortfolio}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium animated-underline-1"
          >
            <Gavel className="h-3 w-3" />
            Portfolio {currentPortfolio} Results
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedLocation}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(auctionData[currentPortfolio]).map((location) => (
                <DropdownMenuItem
                  key={location}
                  onClick={() => {
                    setSelectedLocation(location);
                    setCurrentMetricIndex(0);
                  }}
                >
                  {location}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardTitle>

      <div className="px-6">
        <div className="flex flex-col gap-2">
          <Progress
            value={progress}
            className="h-[2px] bg-muted [&>div]:bg-muted-foreground/25"
          />

          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="icon" onClick={handlePrevMetric}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-muted-foreground tracking-tight text-sm font-light flex items-center gap-2">
              <p className="text-muted-foreground">{currentMetric.label}</p>
              <Dot size="tiny" className={cn('bg-muted-foreground')} />
              <p
                className={cn('text-foreground font-medium')}
                style={{
                  color: chartConfig[selectedLocation].color,
                }}
              >
                {selectedLocation}
              </p>
            </div>

            <Button variant="ghost" size="icon" onClick={handleNextMetric}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 min-h-0 pb-0">
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col justify-center items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center h-full">
                <p
                  className="font-bold text-4xl flex items-start gap-1 animate-slide-up-fade-in [animation-duration:3500ms] select-none"
                  key={currentMetric.key}
                >
                  <CountUp
                    start={0}
                    end={format.overrideValue ?? (value as number)}
                    decimals={format.decimals}
                    duration={2}
                    useEasing
                    smartEasingAmount={0.5}
                    easingFn={(t, b, c, d) => {
                      // Quartic easing in/out
                      t /= d / 2;
                      if (t < 1) return (c / 2) * t * t * t * t + b;
                      t -= 2;
                      return (-c / 2) * (t * t * t * t - 2) + b;
                    }}
                    prefix={format.prefix}
                    suffix={format.suffix}
                  />
                  {trend ? (
                    <ChevronsUp className="h-4 w-4 text-green-500 animate-pulse delay-[2500ms]" />
                  ) : (
                    <ChevronsDown className="h-4 w-4 text-red-500 animate-pulse delay-[2500ms]" />
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="h-[180px]">
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={getChartData(currentMetric.key)}
                height={180}
                margin={{
                  left: 10,
                  right: 10,
                  top: 12,
                  bottom: 6,
                }}
                animationDuration={2500}
                animationBegin={0}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="portfolio"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                {Object.entries(chartConfig).map(([key, config]) => (
                  <React.Fragment key={key}>
                    <defs>
                      <linearGradient id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={config.color} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey={key}
                      type="monotone"
                      fill={`url(#fill${key})`}
                      fillOpacity={0.4}
                      stroke={config.color}
                    />
                  </React.Fragment>
                ))}
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionResults;

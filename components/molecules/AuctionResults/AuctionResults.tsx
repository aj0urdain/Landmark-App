import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Gavel } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from '@/components/ui/carousel';
import CountUp from 'react-countup';

interface AuctionResultsData {
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

const auctionData: Record<string, AuctionResultsData> = {
  Sydney: {
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
};

const ResultRow = ({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: 'percentage' | 'currency' | 'number';
}) => {
  const formattedValue =
    format === 'percentage'
      ? `${value.toFixed(2)}%`
      : format === 'currency'
        ? `$${value.toLocaleString()}`
        : value.toLocaleString();

  const suffix = format === 'percentage' ? '%' : '';

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <p className="font-bold text-4xl">
        <CountUp
          start={0}
          end={value}
          decimals={2}
          duration={4}
          useEasing
          suffix={suffix}
        />
      </p>
      <p className="text-muted-foreground uppercase tracking-tight text-sm font-medium">
        {label}
      </p>
    </div>
  );
};

const ResultsCarousel = ({ data }: { data: AuctionResultsData }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [key, setKey] = React.useState(0);

  const metrics = [
    { label: 'Success Rate', value: data.successRate, format: 'percentage' },
    { label: 'Volume', value: data.volume, format: 'currency' },
    { label: 'Average Sale Price', value: data.averageSalePrice, format: 'currency' },
    { label: 'Total Properties Sold', value: data.totalPropertiesSold, format: 'number' },
    { label: 'Sold Prior', value: data.soldPrior, format: 'number' },
    ...(data.registeredBidders
      ? [{ label: 'Registered Bidders', value: data.registeredBidders, format: 'number' }]
      : []),
    { label: 'Average Yield', value: data.averageYield, format: 'percentage' },
    { label: 'Blended Yield', value: data.blendedYield, format: 'percentage' },
  ] as const;

  React.useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
      setKey((prev) => prev + 1);
    });
  }, [api]);

  return (
    <div className="relative px-8 h-full w-full">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent className="h-full">
          {metrics.map((metric) => (
            <CarouselItem key={metric.label}>
              <div className="p-1 h-full w-full" key={key}>
                <Card className="h-full w-full border-none">
                  <CardContent className="flex items-center justify-center p-6 w-full h-full">
                    <div className="flex flex-col justify-center items-center h-full w-full">
                      <p className="font-bold text-4xl animate-slide-down-fade-in opacity-0 [animation-duration:4s] [animation-delay:1s] [animation-fill-mode:forwards]">
                        <CountUp
                          start={0}
                          end={metric.value}
                          decimals={2}
                          duration={4}
                          useEasing
                          suffix={metric.format === 'percentage' ? '%' : ''}
                        />
                      </p>
                      <p className="text-muted-foreground uppercase tracking-tight opacity-0 text-sm font-medium animate-slide-up-fade-in [animation-delay:0.5s] [animation-duration:4s] [animation-fill-mode:forwards]">
                        {metric.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

const AuctionResults = () => {
  return (
    <Card className="col-span-2 flex h-full flex-col">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium p-4">
        <Gavel className="h-3 w-3" />
        Portfolio 172 Results
      </div>

      <div className="flex-1">
        <Tabs defaultValue="Total" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(auctionData).map((location) => (
              <TabsTrigger key={location} value={location}>
                {location}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 p-2 w-full">
            {Object.entries(auctionData).map(([location, data]) => (
              <TabsContent
                key={location}
                value={location}
                className="h-full m-0 w-full p-0"
              >
                <ResultsCarousel data={data} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

export default AuctionResults;

'use client';

import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { CloudDownload, BookOpen } from 'lucide-react';

const PortfolioMagazine = ({ portfolioId }: { portfolioId: string }) => {
  const supabase = createBrowserClient();

  const { data: magazines, isLoading } = useQuery({
    queryKey: ['portfolio-magazines', portfolioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_magazines')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📄 Portfolio magazines:', data);

      return data;
    },
  });

  if (isLoading) return <div>Loading magazines...</div>;

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Portfolio Magazines</CardTitle>
      </CardHeader>
      <CardContent>
        {!magazines?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex flex-col select-none items-start space-y-2 rounded-md border p-4 opacity-60">
              <div className="relative h-40 w-full bg-muted/50 rounded-md flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-muted-foreground">
                Portfolio Magazine {portfolioId}
              </h3>
              <p className="text-sm text-muted-foreground">Not uploaded yet</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-muted-foreground flex items-center gap-2"
                      disabled
                    >
                      <span className="flex items-center gap-2">
                        <CloudDownload className="h-4 w-4" />
                        Download
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Magazine not uploaded yet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {magazines.map((magazine) => (
              <li
                key={magazine.id}
                className="flex flex-col select-none items-start space-y-2 rounded-md border p-4"
              >
                {magazine.stack_image_path && magazine.file_path && (
                  <a
                    href={magazine.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full cursor-pointer group"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={magazine.stack_image_path}
                        alt={magazine.title || 'Magazine cover'}
                        fill
                        className="rounded-md object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <CloudDownload className="h-12 w-12 text-foreground animate-bounce" />
                      </div>
                    </div>
                  </a>
                )}
                {magazine.stack_image_path && !magazine.file_path && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={magazine.stack_image_path}
                      alt={magazine.title || 'Magazine cover'}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold">{magazine.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Published: {new Date(magazine.created_at).toLocaleDateString()}
                </p>
                {magazine.file_path && (
                  <Button
                    variant="outline"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                  >
                    <a
                      href={magazine.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="animated-underline-1 flex items-center gap-2"
                    >
                      <CloudDownload className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioMagazine;

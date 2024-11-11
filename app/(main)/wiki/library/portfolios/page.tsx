'use client';

import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Portfolio {
  id: number;
  created_at: string;
  magazine_deadline: string | null;
  magazine_print: string | null;
  advertising_period_start: string | null;
  advertising_period_end: string | null;
}

export default function PortfoliosPage() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching portfolios:', error);
        throw error;
      }

      return data as Portfolio[];
    },
  });

  if (isLoading) {
    return <div>Loading portfolios...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Portfolios</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolios?.map((portfolio) => (
          <Card
            key={portfolio.id}
            onClick={() => {
              router.push(`/wiki/library/portfolios/${portfolio.id}`);
            }}
          >
            <CardHeader>
              <CardTitle>Portfolio {portfolio.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd>{format(new Date(portfolio.created_at), 'PPP')}</dd>
                </div>
                {portfolio.advertising_period_start && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Advertising Period</dt>
                    <dd>
                      {format(new Date(portfolio.advertising_period_start), 'PP')} -{' '}
                      {portfolio.advertising_period_end
                        ? format(new Date(portfolio.advertising_period_end), 'PP')
                        : 'TBD'}
                    </dd>
                  </div>
                )}
                {portfolio.magazine_deadline && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Magazine Deadline</dt>
                    <dd>{format(new Date(portfolio.magazine_deadline), 'PP')}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

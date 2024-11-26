'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Create a loading component
const LoadingComponent = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-4 w-4 animate-spin" />
  </div>
);

// Dynamically import the content component with SSR disabled
const Portfolios = dynamic(() => import('@/components/templates/Portfolios/Portfolios'), {
  ssr: false,
  loading: LoadingComponent,
});

export default function PortfoliosPage() {
  return <Portfolios />;
}

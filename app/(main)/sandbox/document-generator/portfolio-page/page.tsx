'use client';

import PortfolioPageContent from '@/components/templates/PortfolioPageContent/PortfolioPageContent';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const PortfolioPageWrapper = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return <PortfolioPageContent searchParams={searchParams} router={router} />;
};

const PortfolioPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PortfolioPageWrapper />
    </Suspense>
  );
};

export default PortfolioPage;

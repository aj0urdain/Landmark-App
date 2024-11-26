'use client';

import PortfolioPageContent from '@/components/templates/PortfolioPageContent/PortfolioPageContent';
import { Suspense } from 'react';

const PortfolioPageWrapper = () => {
  return <PortfolioPageContent />;
};

const PortfolioPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PortfolioPageWrapper />
    </Suspense>
  );
};

export default PortfolioPage;

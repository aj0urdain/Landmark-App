'use client';

import React, { useState } from 'react';
import PortfolioPageViewer from '@/components/templates/PortfolioPageViewer';
import { Card } from '@/components/ui/card';
import PortfolioPageControls from '@/components/organisms/PortfolioPageControls/PortfolioPageControls';

const PortfolioPage = () => {
  const [zoom, setZoom] = useState(0.9);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [content, setContent] = useState('');

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className='flex flex-col w-full h-full items-center justify-center gap-4 mx-4 2xl:mx-auto max-w-6xl py-4'>
      <div className='flex flex-row items-center justify-center gap-4 w-full h-full'>
        <PortfolioPageControls
          setOverlayOpacity={setOverlayOpacity}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          content={content}
          setContent={setContent}
        />
        <Card className='relative w-[55%] h-full z-10'>
          <PortfolioPageViewer
            zoom={zoom}
            overlayOpacity={overlayOpacity}
            content={content}
          />
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPage;

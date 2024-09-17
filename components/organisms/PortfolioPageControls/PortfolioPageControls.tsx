import { Card } from '@/components/ui/card';
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Minus, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface PortfolioPageControlsProps {
  setOverlayOpacity: (opacity: number) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  content: string;
  setContent: (content: string) => void;
}

const PortfolioPageControls = ({
  setOverlayOpacity,
  zoom,
  onZoomIn,
  onZoomOut,
  content,
  setContent,
}: PortfolioPageControlsProps) => {
  return (
    <Card className='w-[45%] h-full p-4'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Overlay Opacity</h3>
        <Slider
          defaultValue={[50]}
          max={100}
          min={0}
          step={1}
          onValueChange={(value) => setOverlayOpacity(value[0] / 100)}
        />
      </div>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Zoom Controls</h3>
        <div className='flex space-x-2'>
          <button
            onClick={onZoomOut}
            className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'
          >
            <Minus size={20} />
          </button>
          <span className='flex items-center px-2 bg-gray-200 rounded'>
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={onZoomIn}
            className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'
          >
            <Plus size={20} />
          </button>
        </div>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold mb-2'>Content</h3>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Enter your content here. Each new line will create a new block.'
            className='h-40'
          />
        </div>
      </div>
    </Card>
  );
};

export default PortfolioPageControls;

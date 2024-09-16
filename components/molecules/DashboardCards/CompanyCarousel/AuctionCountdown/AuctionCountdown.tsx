'use client';

import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const targetDate = new Date('2024-09-18T10:30:00+10:00');

// Renderer callback with condition
const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return <span>Auction has started!</span>;
  } else {
    return (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    );
  }
};

export default function AuctionCountdown() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className='w-full h-full flex items-center justify-between'>
      <div className='flex flex-col items-start justify-between h-full p-6 w-1/2'>
        <h1 className='text-xl font-bold mb-4'>Days Until Auction</h1>

        <div className='flex flex-col w-full gap-2'>
          <div>
            <p className='text-lg font-bold'>Melbourne</p>
            <p className='text-muted-foreground text-sm'>Crown Casino</p>
          </div>

          <div className='flex items-center text-sm font-bold text-warning-foreground'>
            {isClient ? (
              <Countdown date={targetDate} renderer={renderer} />
            ) : (
              <span>Loading...</span>
            )}
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-center p-4 w-1/2'>
        <Calendar
          mode='single'
          selected={targetDate}
          disabled={true}
          modifiers={{
            today: new Date(),
          }}
          modifiersStyles={{
            today: {
              fontWeight: 'bold',
              textDecoration: 'underline',
            },
          }}
          className='rounded-md border shadow max-w-full max-h-full overflow-hidden'
        />
      </div>
    </Card>
  );
}

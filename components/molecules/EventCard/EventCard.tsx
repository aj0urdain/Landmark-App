import React from 'react';
import { Card } from '@/components/ui/card';
import { Event } from '../CompanyCalendar/CompanyCalendar';
import { format } from 'date-fns';

import { getEventColor, getEventTypeInfo } from '@/utils/eventTypeInfo';

import Link from 'next/link';
import { AuctionCard } from './AuctionCard/AuctionCard';
import { Badge } from '@/components/ui/badge';

interface EventDetails {
  auction_location: string;
  first_name: string;
  last_name: string;
}

interface EventCardProps {
  event: Event & {
    details?: EventDetails;
  };
  variant: 'preview' | 'full' | 'featured';
}

export function EventCard({ event, variant }: EventCardProps) {
  const renderEventContent = () => {
    if (event.type === 'auction') {
      return <AuctionCard event={event} variant={variant} />;
    }

    const { icon: Icon, bgColor } = getEventTypeInfo(event.type);

    return (
      <div className="flex relative p-3 h-full w-full flex-col justify-between gap-2">
        <p
          className={`text-muted-foreground ${variant === 'preview' ? 'text-xs' : 'text-sm'}`}
        >
          {formatEventDate()}
        </p>
        <div className="flex items-center gap-2">
          <Icon
            className={`h-4 w-4`}
            style={{
              color: typeof bgColor === 'string' ? bgColor : bgColor.default,
            }}
          />
          <p className={`${variant === 'preview' ? 'text-base' : 'text-lg'} font-bold`}>
            {event.title}
          </p>
        </div>
        {event.type !== 'birthday' && event.type !== 'work_anniversary' ? (
          <Badge
            variant="secondary"
            className="text-muted-foreground text-sm px-2 py-0.5 absolute top-3 right-3"
          >
            {event.portfolio_id}
          </Badge>
        ) : null}
      </div>
    );
  };

  const formatEventDate = () => {
    if (event.type === 'advertising_period' && event.end_date) {
      return `${format(new Date(event.start_date), 'MMM d')} - ${format(new Date(event.end_date), 'MMM d, yyyy')}`;
    }
    return format(new Date(event.start_date), 'MMM d, yyyy');
  };

  const cardContent = (
    <Card
      className={`group box-border flex h-full w-full flex-col overflow-hidden border transition-all duration-300
        ${variant === 'preview' ? 'h-[100px]' : ''}
        ${
          variant === 'featured' ? 'bg-muted' : ''
        } hover:border-[color:var(--hover-border-color)]`}
      style={
        {
          '--hover-border-color': getEventColor(event).bgColor,
        } as React.CSSProperties
      }
    >
      {renderEventContent()}
    </Card>
  );

  if (event.type === 'auction') {
    return (
      <Link
        href={`/events/auctions/${event.portfolio_id.toString()}/${event.details.auction_location}`}
      >
        {cardContent}
      </Link>
    );
  }

  if (['birthday', 'work_anniversary'].includes(event.type)) {
    return (
      <Link href={`/wiki/people/${event.details.first_name}-${event.details.last_name}`}>
        {cardContent}
      </Link>
    );
  }

  if (
    [
      'magazine_print',
      'signed_schedule',
      'magazine_deadline',
      'advertising_period',
      'press_bookings',
      'hsagesmh_w1',
      'hsagesmh_w2',
      'bcm_natives',
      'afr',
      'adelaide_advertiser',
    ].includes(event.type)
  ) {
    return (
      <Link
        href={`/wiki/library/portfolios/${event.portfolio_id.toString()}?tab=overview`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

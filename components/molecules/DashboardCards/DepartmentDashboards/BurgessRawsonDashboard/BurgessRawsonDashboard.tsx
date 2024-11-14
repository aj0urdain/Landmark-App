import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import LiveChat from '@/components/molecules/LiveChat/LiveChat';
import { Bell, Calendar } from 'lucide-react';
import AuctionResults from '@/components/molecules/AuctionResults/AuctionResults';

const BurgessRawsonDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Burgess Rawson" isLast={isLast}>
      <DashboardCardRow height={360}>
        <div className="col-span-12 grid grid-cols-5 h-full flex-col gap-4">
          <Card className="col-span-3 flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Upcoming Auction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-sm text-muted">
              <p>Possible table of events?</p>
              <p>May include filter to change upcoming events via day/week/month</p>
            </CardContent>
          </Card>
          <AuctionResults />
        </div>
      </DashboardCardRow>
      <DashboardCardRow height={420}>
        <div className="col-span-6 flex h-full flex-col gap-4">
          <Card className="row-span-1 flex h-1/2 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Company Events
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-sm text-muted">
              <p>Possible table of events?</p>
              <p>May include filter to change upcoming events via day/week/month</p>
            </CardContent>
          </Card>
          <Card className="row-span-1 flex h-1/2 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Bell className="h-3 w-3" />
                Company Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-sm text-muted">
              <p>Either show card or multiple cards</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6 h-full overflow-visible">
          <LiveChat chatName="Burgess Rawson" height={420} />
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default BurgessRawsonDashboard;

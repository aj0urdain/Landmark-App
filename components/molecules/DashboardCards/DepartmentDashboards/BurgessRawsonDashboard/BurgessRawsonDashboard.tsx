import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import LiveChat from '@/components/molecules/LiveChat/LiveChat';
import { Bell, Calendar } from 'lucide-react';
import AuctionResults from '@/components/molecules/AuctionResults/AuctionResults';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

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
        <GenericDepartmentRow department="Burgess Rawson" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default BurgessRawsonDashboard;

import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';
import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import AuctionResults from '@/components/molecules/AuctionResults/AuctionResults';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';
import DashboardEventsPreview from '@/components/molecules/DashboardEventsPreview/DashboardEventsPreview';

const BurgessRawsonDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Burgess Rawson" isLast={isLast}>
      <DashboardCardRow height={360}>
        <div className="col-span-12 grid grid-cols-5 h-full flex-col gap-4">
          <DashboardEventsPreview />
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

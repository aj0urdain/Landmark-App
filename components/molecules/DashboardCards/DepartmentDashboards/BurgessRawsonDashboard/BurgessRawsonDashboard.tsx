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
        <DashboardEventsPreview />
        <AuctionResults />
      </DashboardCardRow>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Burgess Rawson" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default BurgessRawsonDashboard;

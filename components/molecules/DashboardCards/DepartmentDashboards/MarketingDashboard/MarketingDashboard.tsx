import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';
import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const MarketingDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Marketing" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Marketing" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default MarketingDashboard;

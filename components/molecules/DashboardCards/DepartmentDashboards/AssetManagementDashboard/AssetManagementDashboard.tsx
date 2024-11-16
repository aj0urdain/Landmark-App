import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';
const AssetManagementDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Asset Management" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Asset Management" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default AssetManagementDashboard;

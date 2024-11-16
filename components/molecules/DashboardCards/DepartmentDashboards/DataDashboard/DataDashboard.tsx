import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';
const DataDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Data" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Data" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default DataDashboard;

import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';
const DesignDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Design" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Design" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default DesignDashboard;

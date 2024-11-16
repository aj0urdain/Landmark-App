import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const FinanceDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Finance" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Finance" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};
export default FinanceDashboard;

import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const OperationsDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Operations" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Operations" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};
export default OperationsDashboard;

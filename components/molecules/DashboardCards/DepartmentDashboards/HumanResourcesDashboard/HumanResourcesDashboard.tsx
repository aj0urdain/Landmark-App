import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const HumanResourcesDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Human Resources" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Human Resources" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default HumanResourcesDashboard;

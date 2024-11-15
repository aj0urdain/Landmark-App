import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const SeniorLeadershipDashboard = ({ isLast }: { isLast: boolean }) => {
  const department = 'Senior Leadership';

  return (
    <DashboardContainer department={department} isLast={isLast}>
      <DashboardCardRow>
        <GenericDepartmentRow department={department} />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default SeniorLeadershipDashboard;

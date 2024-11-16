import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const AgencyDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Agency" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Agency" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default AgencyDashboard;

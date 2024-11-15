import React from 'react';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';
import DashboardContainer from '@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer';
import { GenericDepartmentRow } from '@/components/molecules/GenericDepartmentRow/GenericDepartmentRow';

const TechnologyDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Technology" isLast={isLast}>
      <DashboardCardRow height={420}>
        <GenericDepartmentRow department="Technology" />
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default TechnologyDashboard;

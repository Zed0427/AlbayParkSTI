import React from 'react';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
import UrgentCasesCard from '../../../components/shared/UrgentCasesCard';
import ApprovalCard from '../../../components/shared/ApprovalCard';
import QuickActions from '../../../components/shared/QuickActions';

const AssistantVetDashboard: React.FC = () => {
  return (
    <ScreenWrapper>
      <UrgentCasesCard />
      <ApprovalCard />
      <QuickActions />
    </ScreenWrapper>
  );
};

export default AssistantVetDashboard;
import React from 'react';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
// import DailyTasksCard from './components/DailyTasksCard';
import UrgentCasesCard from '../../../components/shared/UrgentCasesCard';
import QuickActions from '../../../components/shared/QuickActions';
import { cases, appointments, tasks } from '../../../data/mockData'; // Add tasks import

const urgentCases = cases.filter(
  (caseItem) => 
    caseItem.priority === 'high' || 
    caseItem.status === 'Critical' || 
    caseItem.status === 'Urgent'
);
const CaretakerDashboard: React.FC = () => {
  return (
    <ScreenWrapper>
      {/* <DailyTasksCard /> */}
      <UrgentCasesCard urgentCases={urgentCases} />
      <QuickActions />
    </ScreenWrapper>
  );
};

export default CaretakerDashboard;
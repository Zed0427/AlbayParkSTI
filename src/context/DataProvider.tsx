import React, { createContext, useContext, useState } from 'react';
import {
  User,
  Animal,
  HealthRecord,
  Appointment,
  Task,
  Schedule,
  Report,
  QuickAction,
  Activity,
  Inventory,
  Notification,
  UrgentCase,
  Case,
  Medication,
} from '../data/models';

import {
  schedules ,
  users,
  animals,
  healthRecords,
  appointments,
  tasks,
  inventory,
  reports,
  quickActions,
  recentActivities,
  cases,
  urgentCases,
  notifications,
  medications,
} from '../data/mockData';


const DataContext = createContext<DataContextData>({} as DataContextData);

interface DataProviderProps {
  children: React.ReactNode;
}

interface DataContextData {
  medications: Medication[];
  urgentCases: UrgentCase[];
  users: User[];
  notifications: Notification[];
  animals: Animal[];
  healthRecords: HealthRecord[];
  appointments: Appointment[];
  tasks: Task[];
  schedules: Schedule[];
  reports: Report[];
  quickActions: QuickAction[];
  recentActivities: Activity[];
  cases: Case[];
  inventory: Inventory[];
  setHealthRecords: React.Dispatch<React.SetStateAction<HealthRecord[]>>;
  isLoading: boolean;  // Add isLoading
  error: string | null;  // Add error
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [healthRecordsState, setHealthRecordsState] = useState<HealthRecord[]>(healthRecords);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <DataContext.Provider
      value={{
        medications,
        users,
        animals,
        urgentCases,
        notifications,
        healthRecords: healthRecordsState,
        appointments,
        tasks,
        reports,
        quickActions,
        recentActivities,
        inventory,
        cases,
        schedules,  // Don't forget to add schedules
        setHealthRecords: setHealthRecordsState,
        isLoading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


export const useData = () => useContext(DataContext);

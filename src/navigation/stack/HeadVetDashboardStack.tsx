// src/navigation/stack/HeadVetDashboardStack.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HeadVetDashboard from '../../features/HeadVet/dashboard/HeadVetDashboard';
import AppointmentSchedulerScreen from '../../components/shared/appointment/AppointmentSchedulerScreen';

const Stack = createStackNavigator();

const HeadVetDashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HeadVetDashboard" component={HeadVetDashboard} options={{ headerShown: false }} />
      <Stack.Screen name="AppointmentSchedulerScreen" component={AppointmentSchedulerScreen} options={{ headerShown: false }}  />
    </Stack.Navigator>
  );
};

export default HeadVetDashboardStack;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../components/shared/profile/ProfileScreen';
import NotificationsScreen from '../components/shared/NotificationsScreen';
import HeadVetDashboard from '../features/HeadVet/dashboard/HeadVetDashboard';
import AssistantVetDashboard from '../features/AssistantVet/dashboard/AssistantVetDashboard';
import CaretakerDashboard from '../features/Caretaker/dashboard/CaretakerDashboard';
import AdminDashboard from '../features/Admin/dashboard/AdminDashboard';
import HealthRecordsScreen from '../components/shared/health-record/HealthRecordsScreen';
import AppointmentSchedulerScreen from '../components/shared/appointment/AppointmentSchedulerScreen';
import MedicationTrackerScreen from '../features/HeadVet/medics/MedicationTrackerScreen';
import InventoryManagementScreen from '../components/shared/inventory/InventoryManagementScreen';
import ReportsAndAnalyticsScreen from '../features/HeadVet/reports/ReportsAndAnalyticsScreen';
import DailyTasksScreen from '../features/Caretaker/tasks/DailyTasksScreen';
import AppointmentRequestScreen from '../features/Caretaker/appoint-request/AppointmentRequestScreen';
import UrgentCaseReportingScreen from '../components/shared/urgent-case/UrgentCaseReportingScreen';
import UserManagementScreen from '../features/Admin/user-management/UserManagementScreen';
import SystemLogsScreen from '../features/Admin/system-logs/SystemLogsScreen';
import CustomHeader from '../components/shared/header/CustomHeader';
import { healthRecords } from '../data/mockData';
import HealthRecordsStack from './stack/AnimalStack';
import AnimalDetailsScreen from '../components/shared/health-record/haelth-record-details/AnimalDetailsScreen';
import { RootStackParamList } from '../types/types';
import FilterModal from '../components/shared/modals/FilterModal';
import AnimalStack from './stack/AnimalStack';
import HeadVetDashboardStack from './stack/HeadVetDashboardStack';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  const { authData } = useAuth();

  if (!authData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>User not found. Please log in.</Text>
      </View>
    );
  }
  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBar,
        }}
      >
        {renderScreensByRole()}
      </Tab.Navigator>
    );
  };


  const renderScreensByRole = () => {
    switch (authData.role) {
      case 'headVet':
        return (
          <>
            <Tab.Screen
              name="Dashboard"
              component={HeadVetDashboardStack}
              options={tabOptions('home-outline', 'Dashboard')}
            />
            <Tab.Screen
              name="Health Records"
              component={HealthRecordsStack}
              options={tabOptions('document-text-outline', 'Records')}
            />
            <Tab.Screen
              name="Appointment Scheduler"
              component={AppointmentSchedulerScreen}
              options={tabOptions('calendar-outline', 'Appointments')}
            />
            <Tab.Screen
              name="Medication Tracker"
              component={MedicationTrackerScreen}
              options={tabOptions('medkit-outline', 'Medications')}
            />
            <Tab.Screen
              name="Reports and Analytics"
              component={ReportsAndAnalyticsScreen}
              options={tabOptions('stats-chart-outline', 'Reports')}
            />
          </>
        );
      case 'assistantVet':
        return (
          <>
                   <Tab.Screen
              name="Dashboard"
              component={CaretakerDashboard}
              options={tabOptions('home-outline', 'Dashboard')}
            />
            <Tab.Screen
              name="Health Records"
              component={HealthRecordsStack}
              options={tabOptions('document-text-outline', 'Records')}
            />
             <Tab.Screen
              name="Appointment Scheduler"
              component={AppointmentSchedulerScreen}
              options={tabOptions('calendar-outline', 'Appointments')}
            />
            <Tab.Screen
              name="Urgent Cases"
              component={UrgentCaseReportingScreen}
              options={tabOptions('alert-circle-outline', 'Urgent Cases')}
            />
          </>
        );
      case 'caretakerA':
      case 'caretakerB':
      case 'caretakerC':
        return (
          <>
            <Tab.Screen
              name="Dashboard"
              component={CaretakerDashboard}
              options={tabOptions('home-outline', 'Dashboard')}
            />
            <Tab.Screen
              name="Health Records"
              component={AnimalStack}
              options={tabOptions('document-text-outline', 'Records')}
            />
            <Tab.Screen
              name="Daily Tasks"
              component={DailyTasksScreen}
              options={tabOptions('list-outline', 'Tasks')}
            />
          </>
        );
      case 'admin':
        return (
          <>
            <Tab.Screen
              name="Dashboard"
              component={AdminDashboard}
              options={tabOptions('home-outline', 'Dashboard')}
            />
            <Tab.Screen
              name="User Management"
              component={UserManagementScreen}
              options={tabOptions('people-outline', 'Users')}
            />
            <Tab.Screen
              name="System Logs"
              component={SystemLogsScreen}
              options={tabOptions('document-text-outline', 'Logs')}
            />
          </>
        );
      default:
        return <Tab.Screen name="Dashboard" component={AdminDashboard} options={tabOptions('home-outline', 'Dashboard')} />;
    }
  };


  const tabOptions = (iconName: keyof typeof Ionicons.glyphMap, label: string): BottomTabNavigationOptions => ({
    tabBarIcon: ({ color, size, focused }) => (
      <View style={[styles.iconContainer, focused && styles.activeTab]}>
        <Ionicons name={iconName} size={size} color={focused ? '#fff' : color} />
      </View>
    ),
    tabBarLabel: ({ focused }) => (focused ? <Text style={styles.activeLabel}>{label}</Text> : null),
    headerShown: false,
  });

  return (
    <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={TabNavigator}
      options={{
        header: () => <CustomHeader />,
      }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
    />
    
  </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 10,
    paddingTop: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#53a39c',
    borderRadius: 35,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    top: -18,
    transform: [{ scale: 1.1 }],
  },
  activeLabel: {
    color: '#53a39c',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    top: -4,
  },
});

export default MainNavigator;

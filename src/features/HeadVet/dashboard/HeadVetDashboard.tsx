import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
import UrgentCasesCard from '../../../components/shared/UrgentCasesCard';
import ApprovalCard from '../../../components/shared/ApprovalCard';
import QuickActions from '../../../components/shared/QuickActions';
import { cases, appointments, tasks } from '../../../data/mockData';
import { useData } from '../../../context/DataProvider';

const { width } = Dimensions.get('window');

const HeadVetDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const urgentCases = cases.filter(
    (caseItem) =>
      caseItem.priority === 'high' ||
      caseItem.status === 'Critical' ||
      caseItem.status === 'Urgent'
  );
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Requested'
  );
  const pendingTasks = tasks.filter((task) => task.status === 'pending');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  if (!cases || !appointments || !tasks) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScreenWrapper refreshing={refreshing} onRefresh={handleRefresh}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <UrgentCasesCard urgentCases={urgentCases} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <ApprovalCard appointments={pendingAppointments} tasks={pendingTasks} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <QuickActions />
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeadVetDashboard;

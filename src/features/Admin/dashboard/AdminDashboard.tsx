import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';

const AdminDashboard: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text>User Management</Text>
        <Text>System Logs</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default AdminDashboard;
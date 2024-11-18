import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';

const SystemLogsScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>System Logs</Text>
        <Text>View system usage and performance logs.</Text>
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

export default SystemLogsScreen;
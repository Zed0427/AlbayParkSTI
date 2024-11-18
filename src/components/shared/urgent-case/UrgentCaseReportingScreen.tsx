import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../screen-wrapper/ScreenWrapper';
const UrgentCaseReportingScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Urgent Case Reporting</Text>
        <Text>Report an urgent case for an animal.</Text>
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

export default UrgentCaseReportingScreen;
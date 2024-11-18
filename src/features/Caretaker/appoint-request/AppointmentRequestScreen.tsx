import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
const AppointmentRequestScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Appointment Request</Text>
        <Text>Request an appointment for an animal.</Text>
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

export default AppointmentRequestScreen;
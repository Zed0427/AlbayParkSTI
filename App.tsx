import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/utils/theme';
import { Text } from 'react-native';

const App: React.FC = () => {
  const { authData, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("onboardingComplete");
        console.log("AsyncStorage onboardingComplete:", value);
        setOnboardingComplete(value === "true");
      } catch (error) {
        console.error("Error fetching onboardingComplete:", error);
        setOnboardingComplete(false); // Default to false on error
      }
    };
    checkOnboarding();
  }, []);

  if (loading || onboardingComplete === undefined) {
    return <Text>Loading onboarding state...</Text>;
  }

  return (
    <NavigationContainer>
      <AppNavigator
        onboardingComplete={onboardingComplete}
        authData={authData}
        setOnboardingComplete={setOnboardingComplete} // Pass the state setter
      />
    </NavigationContainer>
  );
};

const AppWrapper: React.FC = () => (
  <PaperProvider theme={theme}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </PaperProvider>
);

export default AppWrapper;

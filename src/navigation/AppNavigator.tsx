import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import OnboardingScreen from '../components/shared/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

interface AppNavigatorProps {
  onboardingComplete: boolean;
  authData?: any;
  setOnboardingComplete: (value: boolean) => void; // Add the missing prop
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  onboardingComplete,
  authData,
  setOnboardingComplete,
}) => {
  console.log("Rendering AppNavigator. onboardingComplete:", onboardingComplete, "authData:", authData);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingComplete ? (
        <Stack.Screen name="Onboarding">
          {(props) => <OnboardingScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
        </Stack.Screen>
      ) : authData ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

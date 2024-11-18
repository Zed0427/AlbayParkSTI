import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AnimalListScreen from "../../components/shared/health-record/HealthRecordsScreen";
import MemberAnimalListScreen from "../../components/shared/health-record/haelth-record-details/MemberAnimalListScreen";
import AnimalDetailsScreen from "../../components/shared/health-record/haelth-record-details/AnimalDetailsScreen";
import { RootStackParamList } from "../../types/types";

const Stack = createStackNavigator<RootStackParamList>(); // Explicitly use RootStackParamList for typing

const AnimalStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="AnimalList"
        component={AnimalListScreen}
          options={{ headerShown: false }}
/>
      <Stack.Screen
        name="MemberAnimalList" // Correctly match this name
        component={MemberAnimalListScreen} // Use MemberAnimalListScreen here
        options={{ title: "Animal List" }} // Update title if needed
      />
      <Stack.Screen
        name="AnimalDetails"
        component={AnimalDetailsScreen}
        options={{ title: "Animal Details" }}
      />
    </Stack.Navigator>
  );
};

export default AnimalStack;

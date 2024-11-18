import { Member } from '../data/models';

import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Auth: undefined; // Added this for Auth screen navigation
  AnimalList: undefined;
  AppointmentSchedulerScreen: undefined;
  ApprovalCard: undefined;
  MemberAnimalList: { member: Member };
  AnimalDetails: { animalId: string };
  MainTabs: undefined;
  Profile: undefined;
  Notifications: undefined;
  FilterModal: undefined;
  AnimalCategoryDetails: { category: string; animals: any[] };
  Onboarding: undefined;
};

// Props for screens
export type AnimalDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  'AnimalDetails'
>;

export type FilterModalScreenProps = StackScreenProps<
  RootStackParamList,
  'FilterModal'
>;

// Add filter-related types
export type FilterOptions = {
  name: string;
  minAge: string;
  maxAge: string;
  healthStatus: string[];
  gender: string | null;
};

// For global type augmentation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

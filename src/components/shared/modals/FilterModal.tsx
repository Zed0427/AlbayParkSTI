 // src/components/shared/health-record/FilterModal.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Title, TextInput, Chip, Portal, Modal, IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; // If you want to use FontAwesome instead

type FilterOptions = {
  name: string;
  minAge: string;
  maxAge: string;
  healthStatus: string[];
  gender: string | null;
};

const FilterModal: React.FC = () => {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<FilterOptions>({
    name: '',
    minAge: '',
    maxAge: '',
    healthStatus: [],
    gender: null,
  });

  const healthStatusOptions = ['healthy', 'sick', 'under treatment'];
  const genderOptions = ['male', 'female'];

  const handleHealthStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      healthStatus: prev.healthStatus.includes(status)
        ? prev.healthStatus.filter(s => s !== status)
        : [...prev.healthStatus, status]
    }));
  };

  const handleGenderSelect = (gender: string) => {
    setFilters(prev => ({
      ...prev,
      gender: prev.gender === gender ? null : gender
    }));
  };

  const handleApplyFilters = () => {
    // Here you would pass back the filters to the main screen
    navigation.goBack();
  };

  const handleReset = () => {
    setFilters({
      name: '',
      minAge: '',
      maxAge: '',
      healthStatus: [],
      gender: null,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <FontAwesome name="window-close" size={25} color="#333" />
      </TouchableOpacity>
      <ScrollView>
        <Title style={styles.title}>Filter Animals</Title>

        <View style={styles.section}>
          <TextInput
            label="Name"
            value={filters.name}
            onChangeText={(text) => setFilters(prev => ({ ...prev, name: text }))}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Age Range</Title>
          <View style={styles.ageContainer}>
            <TextInput
              label="Min Age"
              value={filters.minAge}
              onChangeText={(text) => setFilters(prev => ({ ...prev, minAge: text }))}
              mode="outlined"
              keyboardType="numeric"
              style={styles.ageInput}
            />
            <TextInput
              label="Max Age"
              value={filters.maxAge}
              onChangeText={(text) => setFilters(prev => ({ ...prev, maxAge: text }))}
              mode="outlined"
              keyboardType="numeric"
              style={styles.ageInput}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Health Status</Title>
          <View style={styles.chipContainer}>
            {healthStatusOptions.map((status) => (
              <Chip
                key={status}
                selected={filters.healthStatus.includes(status)}
                onPress={() => handleHealthStatusToggle(status)}
                style={styles.chip}
                mode="outlined"
              >
                {status}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Gender</Title>
          <View style={styles.chipContainer}>
            {genderOptions.map((gender) => (
              <Chip
                key={gender}
                selected={filters.gender === gender}
                onPress={() => handleGenderSelect(gender)}
                style={styles.chip}
                mode="outlined"
              >
                {gender}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleReset} 
            style={styles.resetButton}
          >
            Reset
          </Button>
          <Button 
            mode="contained" 
            onPress={handleApplyFilters}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 30, // Moves the button to the right
    zIndex: 10, // Ensures it stays above other elements
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageInput: {
    width: '48%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 20,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default FilterModal;
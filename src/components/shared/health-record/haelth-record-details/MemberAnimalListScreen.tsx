import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import ScreenWrapper from '../../screen-wrapper/ScreenWrapper';
import { Animal } from '../../../../data/models';

// Add new interfaces for filter state
interface FilterState {
  searchText: string;
  ageRange: {
    min: string;
    max: string;
  };
  gender: 'all' | 'male' | 'female';
  healthStatus: 'all' | 'healthy' | 'sick' | 'recovering';
  sortBy: 'name' | 'age' | 'status';
  sortOrder: 'asc' | 'desc';
}

const MemberAnimalListScreen = ({ route }: any) => {
    const { member } = route.params;
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
  
  // Add filter state
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    ageRange: { min: '', max: '' },
    gender: 'all',
    healthStatus: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Filter and sort animals based on current filters
  const getFilteredAnimals = () => {
    let filtered = [...member.animals];

    // Text search
    if (filters.searchText) {
      filtered = filtered.filter(animal => 
        animal.uniqueName.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    // Age range
    if (filters.ageRange.min) {
      filtered = filtered.filter(animal => 
        parseInt(animal.age) >= parseInt(filters.ageRange.min)
      );
    }
    if (filters.ageRange.max) {
      filtered = filtered.filter(animal => 
        parseInt(animal.age) <= parseInt(filters.ageRange.max)
      );
    }

    // Gender
    if (filters.gender !== 'all') {
      filtered = filtered.filter(animal => animal.gender === filters.gender);
    }

    // Health status
    if (filters.healthStatus !== 'all') {
      filtered = filtered.filter(animal => animal.healthStatus === filters.healthStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.uniqueName.localeCompare(b.uniqueName);
          break;
        case 'age':
          comparison = parseInt(a.age) - parseInt(b.age);
          break;
        case 'status':
          comparison = a.healthStatus.localeCompare(b.healthStatus);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  useEffect(() => {
    // Start floating animation for the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Add the missing functions
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    // Start the slide-up animation for the bottom sheet
    Animated.timing(slideAnim, {
      toValue: isModalVisible ? 300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh behavior
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const renderAnimalItem = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      style={styles.animalCard}
      onPress={() => handleAnimalPress(item)}
      activeOpacity={0.8}
    >
      {/* Image on the Left */}
      <Image source={{ uri: item.imageUri }} style={styles.animalImage} />

      {/* Details Container */}
      <View style={styles.cardDetails}>
        <View style={styles.detailsContent}>
          <View style={styles.nameRow}>
            <Text style={styles.animalName}>{item.uniqueName}</Text>
            <FontAwesome 
              name={item.gender === 'male' ? 'mars' : 'venus'} 
              size={20} 
              color="#666" 
            />
          </View>
          <Text style={styles.animalAge}>{item.age} old</Text>
          <Text style={styles.animalGroup}>{item.type}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.healthStatus === 'healthy'
                    ? '#4CAF50'
                    : item.healthStatus === 'sick'
                    ? '#f44336'
                    : '#ff9800',
              },
            ]}
          >
            <Text style={styles.statusText}>{item.healthStatus}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleAnimalPress = (animal: Animal) => {
    navigation.navigate('AnimalDetails', { animalId: animal.id });
  };





  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      {children}
    </View>
  );

  const FilterButton = ({ 
    label, 
    selected, 
    onPress 
  }: { 
    label: string; 
    selected: boolean; 
    onPress: () => void 
  }) => (
    <TouchableOpacity 
      style={[styles.filterButton, selected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, selected && styles.filterButtonTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Updated Modal Content
  const renderBottomSheet = () => (
    <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.bottomSheetContent}>
        {/* Header */}
        <Text style={styles.sheetHeader}>Filter Animals</Text>
        
        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={filters.searchText}
          onChangeText={(text) => setFilters(prev => ({ ...prev, searchText: text }))}
        />
  
        {/* Health Status Filter */}
        <FilterSection title="Health Status">
          <View style={styles.filterButtonGroup}>
            <FilterButton
              label="All"
              selected={filters.healthStatus === 'all'}
              onPress={() => setFilters(prev => ({ ...prev, healthStatus: 'all' }))}
            />
            <FilterButton
              label="Healthy"
              selected={filters.healthStatus === 'healthy'}
              onPress={() => setFilters(prev => ({ ...prev, healthStatus: 'healthy' }))}
            />
            <FilterButton
              label="Sick"
              selected={filters.healthStatus === 'sick'}
              onPress={() => setFilters(prev => ({ ...prev, healthStatus: 'sick' }))}
            />
            <FilterButton
              label="Recovering"
              selected={filters.healthStatus === 'recovering'}
              onPress={() => setFilters(prev => ({ ...prev, healthStatus: 'recovering' }))}
            />
          </View>
        </FilterSection>
  
        {/* Sort Options */}
        <FilterSection title="Sort By">
          <View style={styles.filterButtonGroup}>
            <FilterButton
              label="Name"
              selected={filters.sortBy === 'name'}
              onPress={() => setFilters(prev => ({ ...prev, sortBy: 'name' }))}
            />
            <FilterButton
              label="Age"
              selected={filters.sortBy === 'age'}
              onPress={() => setFilters(prev => ({ ...prev, sortBy: 'age' }))}
            />
            <FilterButton
              label="Status"
              selected={filters.sortBy === 'status'}
              onPress={() => setFilters(prev => ({ ...prev, sortBy: 'status' }))}
            />
          </View>
          <View style={styles.filterButtonGroup}>
            <FilterButton
              label="Ascending"
              selected={filters.sortOrder === 'asc'}
              onPress={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
            />
            <FilterButton
              label="Descending"
              selected={filters.sortOrder === 'desc'}
              onPress={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
            />
          </View>
        </FilterSection>
  
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setFilters({
              searchText: '',
              ageRange: { min: '', max: '' },
              gender: 'all',
              healthStatus: 'all',
              sortBy: 'name',
              sortOrder: 'asc',
            })}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={toggleModal}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  // Update the return statement to use filtered animals
  return (
    <ScreenWrapper
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.wrapper}
    >
      <Text style={styles.header}>{member.name}</Text>
      <FlatList
        data={getFilteredAnimals()}
        keyExtractor={(item) => item.id}
        renderItem={renderAnimalItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No animals found</Text>
          </View>
        )}
      />

      <Animated.View
        style={[
          styles.searchButton,
          { transform: [{ translateY: buttonAnim }] },
        ]}
      >
        <TouchableOpacity onPress={toggleModal}>
          <FontAwesome name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
  visible={isModalVisible}
  transparent
  animationType="none"
  onRequestClose={toggleModal}
>
  <TouchableOpacity 
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={toggleModal}  // Close when clicking the overlay
  >
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={(e) => e.stopPropagation()}  // Prevent closing when clicking the sheet
    >
      {renderBottomSheet()}
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
      },
    
      bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 3.84,
      },
    
      bottomSheetContent: {
        width: '100%',
      },
    
      sheetHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
      },
    
      searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
      },
    
      filterSection: {
        marginBottom: 16,
      },
    
      filterButtonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
        marginBottom: 8,
      },
    
      filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
    
      actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
      },
  wrapper: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  animalCard: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  animalImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginRight: -40, // Overlaps the white container
    zIndex: 1, // Ensure image stays on top
  },
  cardDetails: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 16,
  },
  detailsContent: {
    paddingLeft: 40, // Ensures text doesn’t overlap with the image
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  animalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  animalAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  animalGroup: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  searchButton: {
    position: 'absolute', // Keeps the button fixed on the screen
    bottom: -220,          // Adjusts the distance from the bottom
    right: 20,           // Adjusts the distance from the right
    backgroundColor: '#26A69A',
    borderRadius: 30,     // Ensures the button is circular
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,         // Adds a shadow for a floating effect
    zIndex: 10,           // Ensures the button appears above other elements
  },
  closeButton: {
    backgroundColor: '#26A69A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterScrollView: {
    maxHeight: '80%',
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  filterButtonSelected: {
    backgroundColor: '#26A69A',
    borderColor: '#26A69A',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  ageSeparator: {
    color: '#666',
    fontSize: 14,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#26A69A',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MemberAnimalListScreen;
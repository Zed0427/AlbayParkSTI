import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../../context/AuthContext';
import { members } from '../../../data/mockData';
import { Member } from '../../../data/models';
import { RootStackParamList } from '../../../types/types';

type CategoryType = 'avian' | 'mammal' | 'reptile' | null;

const AnimalListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { authData, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [refreshing, setRefreshing] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26A69A" />
      </View>
    );
  }

  if (!authData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Please log in to view animal groups</Text>
      </View>
    );
  }

  const filterMembers = (): Member[] => {
    // Map caretaker roles to categories
    const caretakerRolesToCategories: { [key: string]: CategoryType } = {
      caretakerA: 'avian',
      caretakerB: 'mammal',
      caretakerC: 'reptile',
    };

    // If user is a caretaker, filter their assigned category
    if (authData.role.startsWith('caretaker')) {
      const assignedCategory = caretakerRolesToCategories[authData.role];
      return members.filter(
        (member) =>
          member.category === assignedCategory &&
          member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // General filtering logic based on selectedCategory
    if (selectedCategory) {
      return members.filter(
        (member) =>
          member.category === selectedCategory &&
          member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Show all members if no category is selected
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredMembers = filterMembers();

  const handleCategoryPress = (category: CategoryType) => {
    // Toggle the category button: deselect if it's already selected
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };

  const handleMemberPress = (member: Member) => {
    navigation.navigate('MemberAnimalList', { member });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate refresh
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search animal groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Buttons */}
      {!authData.role.includes('caretaker') && (
        <View style={styles.categoryContainer}>
          {(['avian', 'mammal', 'reptile'] as CategoryType[]).map((category) => (
         <TouchableOpacity
         key={category}
         style={[
           styles.categoryButton,
           selectedCategory === category && category !== null && styles.categoryButtonActive, // Ensure category !== null
         ]}
         onPress={() => handleCategoryPress(category)}
         activeOpacity={0.8}
       >
         <FontAwesome
           name={
             category === 'avian'
               ? 'twitter'
               : category === 'mammal'
               ? 'paw'
               : category === 'reptile'
               ? 'bug'
               : undefined
           }
           size={20}
           color={selectedCategory === category ? '#fff' : '#26A69A'}
         />
         <Text
           style={[
             styles.categoryButtonText,
             selectedCategory === category && category !== null && styles.categoryButtonTextActive, // Ensure category !== null
           ]}
         >
           {category && category.charAt(0).toUpperCase() + category.slice(1)} {/* Handle null */}
         </Text>
       </TouchableOpacity>
       
          ))}
        </View>
      )}

      {/* Animal Groups */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberContainer}
            onPress={() => handleMemberPress(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.memberImage} />
            <View style={styles.overlay}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberCount}>{item.totalHeads} animals</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No animal groups found</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#E8F5F9',
  },
  categoryButtonActive: {
    backgroundColor: '#26A69A',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#26A69A',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  row: {
    justifyContent: 'space-between',
  },
  memberContainer: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
  },
  memberImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberCount: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AnimalListScreen;

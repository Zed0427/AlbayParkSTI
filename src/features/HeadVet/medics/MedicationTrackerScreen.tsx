import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Card, Title, Paragraph, Searchbar, useTheme, FAB, Modal, TextInput, Button } from 'react-native-paper';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInRight, FadeInUp, Layout } from 'react-native-reanimated';

interface InventoryItem {
  id: string;
  name: string;
  type: 'medicine' | 'equipment';
  quantity: number;
  unit: string;
  expiryDate?: string;
}

const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Antibiotics', type: 'medicine', quantity: 100, unit: 'pills', expiryDate: '2024-06-30' },
  { id: '2', name: 'Painkillers', type: 'medicine', quantity: 50, unit: 'pills', expiryDate: '2024-12-31' },
  { id: '3', name: 'Bandages', type: 'equipment', quantity: 200, unit: 'pieces' },
  { id: '4', name: 'Syringes', type: 'equipment', quantity: 500, unit: 'pieces' },
  { id: '5', name: 'Vitamins', type: 'medicine', quantity: 75, unit: 'bottles', expiryDate: '2025-03-15' },
];

const MedicationTrackerScreen: React.FC = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'medicine' | 'equipment'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({} as Omit<InventoryItem, 'id'>);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedType === 'all' || item.type === selectedType)
  );

  const filterOptions = [
    { value: 'all', label: 'All Items', icon: 'apps' },
    { value: 'medicine', label: 'Medicine', icon: 'medical' },
    { value: 'equipment', label: 'Equipment', icon: 'construct' },
  ];

  const handleAddItem = () => {
    if (newItem.name && newItem.type && newItem.quantity && newItem.unit) {
      setInventory([...inventory, { ...newItem, id: Date.now().toString() }]);
      setNewItem({} as Omit<InventoryItem, 'id'>);
      setModalVisible(false);
    }
  };

  const handleEditItem = () => {
    if (editingItem) {
      setInventory(inventory.map(item => item.id === editingItem.id ? editingItem : item));
      setEditingItem(null);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item, index }: { item: InventoryItem; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(400)} layout={Layout.springify()}>
      <TouchableOpacity onPress={() => { setEditingItem(item); setModalVisible(true); }}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name={item.type === 'medicine' ? 'medical' : 'construct'} 
                size={24} 
                color={theme.colors.primary} 
              />
              <Title style={styles.cardTitle}>{item.name}</Title>
            </View>
            <Paragraph style={styles.cardParagraph}>Quantity: {item.quantity} {item.unit}</Paragraph>
            {item.expiryDate && (
              <Paragraph style={styles.cardParagraph}>Expires: {item.expiryDate}</Paragraph>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilterSection = () => (
    <Card style={styles.filterCard}>
      <Card.Content style={styles.filterContent}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterButton,
              selectedType === option.value && styles.filterButtonSelected,
            ]}
            onPress={() => setSelectedType(option.value as typeof selectedType)}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={selectedType === option.value ? theme.colors.primary : theme.colors.backdrop}
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterText,
                selectedType === option.value && styles.filterTextSelected
              ]}
            >
              {option.label}
            </Text>
            {selectedType === option.value && (
              <View style={styles.selectedDot} />
            )}
          </TouchableOpacity>
        ))}
      </Card.Content>
    </Card>
  );


  return (
    <ScreenWrapper>
      <Animated.View style={styles.container} entering={FadeInUp.duration(500)}>
      <View style={styles.header}>
          <Title style={styles.title}>Inventory Tracker</Title>
          <View style={styles.searchContainer}>
          <Searchbar
  placeholder="Search inventory"
  onChangeText={setSearchQuery}
  value={searchQuery}
  style={styles.searchBar}
  icon="magnify"  // Changed from "search" to "magnify"
  iconColor={theme.colors.primary}
/>
          </View>
          {renderFilterSection()}
        </View>
        <FlatList
          data={filteredInventory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => { setEditingItem(null); setModalVisible(true); }}
        />
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Title style={styles.modalTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</Title>
          <TextInput
            label="Name"
            value={editingItem?.name || newItem.name || ''}
            onChangeText={(text) => editingItem ? setEditingItem({...editingItem, name: text}) : setNewItem({...newItem, name: text})}
            style={styles.input}
          />
          <TextInput
            label="Type"
            value={editingItem?.type || newItem.type || ''}
            onChangeText={(text) => editingItem ? setEditingItem({...editingItem, type: text as 'medicine' | 'equipment'}) : setNewItem({...newItem, type: text as 'medicine' | 'equipment'})}
            style={styles.input}
          />
          <TextInput
            label="Quantity"
            value={editingItem?.quantity?.toString() || newItem.quantity?.toString() || ''}
            onChangeText={(text) => {
              const quantity = parseInt(text);
              editingItem ? setEditingItem({...editingItem, quantity}) : setNewItem({...newItem, quantity});
            }}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Unit"
            value={editingItem?.unit || newItem.unit || ''}
            onChangeText={(text) => editingItem ? setEditingItem({...editingItem, unit: text}) : setNewItem({...newItem, unit: text})}
            style={styles.input}
          />
          <TextInput
            label="Expiry Date (optional)"
            value={editingItem?.expiryDate || newItem.expiryDate || ''}
            onChangeText={(text) => editingItem ? setEditingItem({...editingItem, expiryDate: text}) : setNewItem({...newItem, expiryDate: text})}
            style={styles.input}
          />
          <Button mode="contained" onPress={editingItem ? handleEditItem : handleAddItem} style={styles.button}>
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </Modal>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  filterCard: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  filterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  filterButtonSelected: {
    backgroundColor: '#53a39c',
  },
  filterIcon: {
    marginRight: 8,
    color: '#171c24',
  },
  filterText: {
    fontSize: 14,
    color: '#171c24',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#171c24',
    fontWeight: '600',
  },
  selectedDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#53a39c',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  cardParagraph: {
    color: '#666',
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#171c24',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
});

export default MedicationTrackerScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../screen-wrapper/ScreenWrapper';
import { useData } from '../../../context/DataProvider';
import { useAuth } from '../../../context/AuthContext';
import { Inventory } from '../../../data/models'; // Import the Inventory model

const InventoryManagementScreen: React.FC = () => {
  const { inventory } = useData();
  const { authData } = useAuth();

  // Filter inventory based on user role
  const filteredInventory = inventory.filter((item: Inventory) => {
    if (authData?.role === 'assistantVet') { // Use the correct role key
      return item.quantity < item.threshold;
    }
    return true;
  });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Inventory Management</Text>
        {filteredInventory.map((item: Inventory) => (
          <View key={item.id} style={styles.inventoryItem}>
            <Text>{item.itemName}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Threshold: {item.threshold}</Text>
          </View>
        ))}
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
  inventoryItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default InventoryManagementScreen;

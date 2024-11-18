import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
import { useData } from '../../../context/DataProvider';

const UserManagementScreen: React.FC = () => {
  const { users } = useData();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>User Management</Text>
        {users.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <Text>{user.name}</Text>
            <Text>{user.role}</Text>
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
  userItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default UserManagementScreen;
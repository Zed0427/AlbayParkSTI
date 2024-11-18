import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useData } from '../../../../context/DataProvider';

const DailyTasksCard: React.FC = () => {
  const { tasks } = useData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Tasks</Text>
      {tasks.map((task) => (
        <TouchableOpacity key={task.id} style={styles.taskItem}>
          <Text>{task.description}</Text>
          <Text>{task.status}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default DailyTasksCard;
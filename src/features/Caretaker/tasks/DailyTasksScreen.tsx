import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
import { useData } from '../../../context/DataProvider';

const DailyTasksScreen: React.FC = () => {
  const { tasks } = useData();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Tasks</Text>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text>{task.description}</Text>
            <Text>{task.status}</Text>
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
  taskItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default DailyTasksScreen;
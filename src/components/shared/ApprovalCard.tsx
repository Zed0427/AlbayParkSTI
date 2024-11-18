import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text, IconButton, useTheme } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Task, Appointment } from '../../data/models';

interface ApprovalsProps {
  appointments: Appointment[];
  tasks: Task[];
}

const ApprovalCard: React.FC<ApprovalsProps> = ({ appointments, tasks }) => {
  const theme = useTheme();

  const pendingItems = [
    ...appointments.filter(a => a.status === 'Requested'),
    ...tasks.filter(t => t.status === 'pending')
  ];

  if (pendingItems.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Pending Approvals</Title>
          <Text style={styles.emptyText}>No items pending approval</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>Pending Approvals</Title>
          <Text style={styles.count}>{pendingItems.length} pending</Text>
        </View>
        {pendingItems.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInRight.delay(index * 100)}
            style={styles.approvalItem}
          >
            <View style={styles.approvalContent}>
              <View style={styles.approvalInfo}>
                <Text style={styles.approvalTitle}>
                  {'procedure' in item ? item.procedure : item.description}
                </Text>
                <Text style={styles.approvalMeta}>
                  {'time' in item ? `Appointment · ${item.time}` : 'Task · Pending'}
                </Text>
              </View>
              <View style={styles.approvalActions}>
                <IconButton
                  icon="close"
                  size={20}
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => {}}
                />
                <IconButton
                  icon="check"
                  size={20}
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => {}}
                />
              </View>
            </View>
          </Animated.View>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  count: {
    color: '#666',
    fontSize: 14,
  },
  approvalItem: {
    marginBottom: 12,
  },
  approvalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  approvalInfo: {
    flex: 1,
    marginRight: 16,
  },
  approvalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  approvalMeta: {
    color: '#666',
    fontSize: 12,
  },
  approvalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 4,
  },
  approveButton: {
    backgroundColor: '#4caf50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontSize: 16,
  },
});

export default ApprovalCard;
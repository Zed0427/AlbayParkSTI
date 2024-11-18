import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Title, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Action {
  icon: string;
  label: string;
  gradient: [string, string]; // Define as tuple type
  description: string;
}

const QuickActions: React.FC = () => {
  const theme = useTheme();
  
  const actions: Action[] = [
    { 
      icon: 'calendar', 
      label: 'Schedule', 
      gradient: ['#4CAF50', '#2E7D32'] as [string, string],
      description: 'Manage appointments'
    },
    { 
      icon: 'create', 
      label: 'Reports', 
      gradient: ['#2196F3', '#1565C0'] as [string, string],
      description: 'Create new report'
    },
    { 
      icon: 'medical', 
      label: 'Inventory', 
      gradient: ['#9C27B0', '#6A1B9A'] as [string, string],
      description: 'Check supplies'
    },
    { 
      icon: 'people', 
      label: 'Staff', 
      gradient: ['#FF9800', '#F57C00'] as [string, string],
      description: 'Manage team'
    },
  ];

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Quick Actions</Title>
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(index * 100).springify()}
              style={styles.actionWrapper}
            >
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  // Handle action press
                }}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon} size={24} color="white" />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  actionGradient: {
    padding: 16,
    height: 120,
    justifyContent: 'space-between',
  },
  actionLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});

export default QuickActions;
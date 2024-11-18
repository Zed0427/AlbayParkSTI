import React from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Card, Title, Text, Button, IconButton, useTheme } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Case } from '../../data/models';

const { width } = Dimensions.get('window');

interface UrgentCasesProps {
  urgentCases: Case[];
}

// Define possible status types
type CaseStatus = 'active' | 'monitoring' | 'resolved' | 'Critical' | 'Urgent' | 'Moderate';

type StatusColors = {
  [key in CaseStatus | 'Default']: [string, string];
};

const UrgentCasesCard: React.FC<UrgentCasesProps> = ({ urgentCases }) => {
  const theme = useTheme();

  const statusColors: StatusColors = {
    Critical: ['#f44336', '#d32f2f'],
    Urgent: ['#ff9800', '#f57c00'],
    Moderate: ['#4caf50', '#388e3c'],
    active: ['#2196F3', '#1976D2'],
    monitoring: ['#FF9800', '#F57C00'],
    resolved: ['#4CAF50', '#388E3C'],
    Default: ['#9e9e9e', '#757575']
  };

  const getStatusColor = (status: CaseStatus | undefined): [string, string] => {
    if (!status) return statusColors.Default;
    return statusColors[status] || statusColors.Default;
  };

  const getDisplayStatus = (status: CaseStatus | undefined): string => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!urgentCases || urgentCases.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Urgent Cases</Title>
          <Text style={styles.emptyText}>No urgent cases at the moment</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>Urgent Cases</Title>
          <IconButton 
            icon="arrow-right" 
            onPress={() => {}} 
            style={styles.headerIcon}
          />
        </View>
        <FlatList
          data={urgentCases}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInRight.delay(index * 100)}
              style={styles.caseItem}
            >
              <LinearGradient
                colors={getStatusColor(item.status as CaseStatus)}
                style={styles.caseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.caseHeader}>
                  <Text style={styles.caseType}>{item.type || 'General Case'}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {getDisplayStatus(item.status as CaseStatus)}
                    </Text>
                  </View>
                </View>
                <Title style={styles.caseTitle}>{item.condition}</Title>
                <Text style={styles.caseDescription} numberOfLines={3}>
                  {item.details || 'No details available'}
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => {}}
                  style={styles.viewButton}
                  labelStyle={styles.viewButtonLabel}
                >
                  View Details
                </Button>
              </LinearGradient>
            </Animated.View>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
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
  headerIcon: {
    marginRight: -8,
  },
  listContainer: {
    paddingRight: 8,
  },
  caseItem: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  caseGradient: {
    padding: 16,
    height: 200,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseType: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  caseTitle: {
    color: 'white',
    fontSize: 20,
    marginVertical: 16,
  },
  caseDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  viewButtonLabel: {
    color: 'white',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontSize: 16,
  },
});

export default UrgentCasesCard;
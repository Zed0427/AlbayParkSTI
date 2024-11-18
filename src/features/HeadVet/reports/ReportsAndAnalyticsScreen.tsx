import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, Chip, Portal, Modal, IconButton, List, useTheme } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../../components/shared/screen-wrapper/ScreenWrapper';
import { animals, healthRecords, users, animalHealthOverview } from '../../../data/mockData';

const { width } = Dimensions.get('window');

const ReportingAnalyticsScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const [refreshing, setRefreshing] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);

  const timeRanges = [
    { label: 'Day', value: 'day', icon: 'today' },
    { label: 'Week', value: 'week', icon: 'calendar-number-outline' },
    { label: 'Month', value: 'month', icon: 'calendar-outline' },
    { label: 'Year', value: 'year', icon: 'calendar' },
  ];

  const healthMetrics = [
    { label: 'Healthy', value: 75, color: '#4CAF50' },
    { label: 'Under Treatment', value: 15, color: '#FFC107' },
    { label: 'Critical', value: 10, color: '#F44336' },
  ];

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => theme.colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderOverviewCards = () => (
    <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.overviewContainer}>
      {[
        { icon: 'paw', title: 'Animals', value: animals.length, trend: '+5%', trendIcon: 'trending-up', trendColor: '#4CAF50' },
        { icon: 'medkit', title: 'Health Cases', value: healthRecords.length, trend: '-3%', trendIcon: 'trending-down', trendColor: '#F44336' },
        { icon: 'people', title: 'Staff', value: users.length, trend: '0%', trendIcon: 'remove', trendColor: '#757575' },
      ].map((item, index) => (
        <Animated.View key={item.title} entering={FadeInRight.delay(index * 100).duration(500)} style={styles.overviewCard}>
          <Card>
            <Card.Content>
              <View style={styles.cardIconHeader}>
                <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
                <Title style={styles.cardTitle}>{item.title}</Title>
              </View>
              <Text style={styles.cardValue}>{item.value}</Text>
              <View style={styles.cardTrend}>
                <Ionicons name={item.trendIcon} size={16} color={item.trendColor} />
                <Text style={[styles.trendText, { color: item.trendColor }]}>{item.trend}</Text>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderTimeRangeSelector = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.timeRangeSelectorContainer}>
      <Card style={styles.timeRangeSelectorCard}>
        <Card.Content style={styles.timeRangeSelectorContent}>
          {timeRanges.map((range, index) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range.value && styles.timeRangeButtonSelected,
                index === 0 && styles.timeRangeButtonFirst,
                index === timeRanges.length - 1 && styles.timeRangeButtonLast,
              ]}
              onPress={() => setSelectedTimeRange(range.value as 'day' | 'week' | 'month' | 'year')}
            >
              <Ionicons 
                name={range.icon} 
                size={18} 
                color={selectedTimeRange === range.value ? theme.colors.primary : theme.colors.backdrop}
                style={styles.timeRangeIcon}
              />
              <Text 
                style={[
                  styles.timeRangeText,
                  selectedTimeRange === range.value && styles.timeRangeTextSelected
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>
    </Animated.View>
  );

  const renderCharts = () => (
    <Animated.View entering={FadeInUp.delay(400).duration(500)}>
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Health Trends</Title>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{ data: [85, 82, 88, 90, 87, 92] }],
            }}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Health Distribution</Title>
          <PieChart
            data={healthMetrics.map((metric) => ({
              name: metric.label,
              population: metric.value,
              color: metric.color,
              legendFontColor: theme.colors.onSurface,
              legendFontSize: 12,
            }))}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Activity Trends</Title>
          <BarChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }],
            }}
            width={width - 48}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
          />
        </Card.Content>
      </Card>
    </Animated.View>
  );

  return (
    <ScreenWrapper refreshing={refreshing} onRefresh={onRefresh}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* <Animated.View entering={FadeInUp.duration(500)} style={styles.timeRangeSelector}>
          {timeRanges.map((range) => (
            <Chip
              key={range.value}
              selected={selectedTimeRange === range.value}
              onPress={() => setSelectedTimeRange(range.value as 'day' | 'week' | 'month' | 'year')}
              style={styles.timeRangeChip}
            >
              {range.label}
            </Chip>
          ))}
        </Animated.View> */}
        {renderTimeRangeSelector()}
        {renderOverviewCards()}
        {renderCharts()}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.actionButtons}>
          <Button mode="contained" onPress={() => setIsReportModalVisible(true)} icon="file-plus">
            Generate Report
          </Button>
          <Button mode="outlined" onPress={() => setIsExportModalVisible(true)} icon="export">
            Export Data
          </Button>
        </Animated.View>
      </ScrollView>

      <Portal>
        <Modal visible={isReportModalVisible} onDismiss={() => setIsReportModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Title style={styles.modalTitle}>Generate Report</Title>
          <List.Section>
            {['Monthly Health Overview', 'Staff Performance Report', 'Inventory Status Report'].map((report, index) => (
              <List.Item
                key={index}
                title={report}
                left={(props) => <List.Icon {...props} icon="file-document-outline" />}
                right={() => <Button mode="outlined">Generate</Button>}
              />
            ))}
          </List.Section>
          <Button onPress={() => setIsReportModalVisible(false)}>Cancel</Button>
        </Modal>

        <Modal visible={isExportModalVisible} onDismiss={() => setIsExportModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Title style={styles.modalTitle}>Export Data</Title>
          <List.Section>
            {[
              { title: 'PDF Format', icon: 'file-pdf-box' },
              { title: 'CSV Format', icon: 'file-delimited' },
              { title: 'Excel Format', icon: 'file-excel' },
            ].map((item, index) => (
              <List.Item
                key={index}
                title={item.title}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                onPress={() => setIsExportModalVisible(false)}
              />
            ))}
          </List.Section>
          <Button onPress={() => setIsExportModalVisible(false)}>Cancel</Button>
        </Modal>
      </Portal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  timeRangeSelectorContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  timeRangeSelectorCard: {
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timeRangeSelectorContent: {
    flexDirection: 'row',
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  timeRangeButtonSelected: {
    backgroundColor: '#53a39c',
  },
  timeRangeButtonFirst: {
    marginLeft: 0,
  },
  timeRangeButtonLast: {
    marginRight: 0,
  },
  timeRangeIcon: {
    marginRight: 4,
    color: '#171C24',
  },
  timeRangeText: {
    fontSize: 13,
    color: '#171C24',
    fontWeight: '500',
  },
  timeRangeTextSelected: {
  color: '#171C24',
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  timeRangeChip: {
    marginRight: 8,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  overviewCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  cardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  chartCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default ReportingAnalyticsScreen;
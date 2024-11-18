import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator, Button } from 'react-native-paper';
import ScreenWrapper from './screen-wrapper/ScreenWrapper';
import { useData } from '../../context/DataProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { notifications as mockNotifications } from '../../data/mockData'; // Import mock data directly

interface Notification {
  id: string;
  message: string;
  date: string;
}

const getNotificationIcon = (message: string) => {
  if (message.includes('commented')) return { name: 'chatbubble', color: '#2196F3' };
  if (message.includes('task')) return { name: 'checkmark-circle', color: '#4CAF50' };
  if (message.includes('appointment')) return { name: 'calendar', color: '#9C27B0' };
  if (message.includes('Urgent')) return { name: 'alert-circle', color: '#F44336' };
  if (message.includes('stock')) return { name: 'medical', color: '#FF9800' };
  return { name: 'notifications', color: '#607D8B' };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const NotificationsScreen: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call with mock data
        setTimeout(() => {
          setNotifications(mockNotifications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);


  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set(prev).add(id));
  };

  const renderNotification = ({ item, index }: { item: Notification; index: number }) => {
    const icon = getNotificationIcon(item.message);
    const isRead = readNotifications.has(item.id);


    return (
      <Animated.View 
      entering={FadeInRight.delay(index * 100).duration(400)}
      style={styles.notificationContainer}
    >
      <TouchableOpacity
        onPress={() => markAsRead(item.id)}
        style={[
          styles.notificationItem,
          isRead && styles.notificationRead
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={[
            styles.message,
            isRead && styles.messageRead
          ]}>
            {item.message}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        {!isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View 
      entering={FadeInDown.duration(400)} 
      style={styles.emptyContainer}
    >
      <Ionicons name="notifications-off" size={64} color={theme.colors.backdrop} />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubtext}>
        We'll notify you when something important happens
      </Text>
      <Button 
        mode="contained" 
        onPress={() => setIsLoading(true)}
        style={styles.refreshButton}
      >
        Refresh
      </Button>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            {notifications.length > 0 && (
              <TouchableOpacity onPress={() => setReadNotifications(new Set())}>
                <Text style={styles.clearAll}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => {
            setIsLoading(true);
            setTimeout(() => {
              setNotifications(mockNotifications);
              setIsLoading(false);
            }, 1000);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAll: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    position: 'relative',
  },
  notificationRead: {
    backgroundColor: '#f8f8f8',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  messageRead: {
    color: '#666',
    fontWeight: '400',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  refreshButton: {
    marginTop: 24,
    borderRadius: 8,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});

export default NotificationsScreen;
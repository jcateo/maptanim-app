import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#4b5563',
    fontSize: 16,
    marginTop: 16,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
  },
  notificationIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  markReadButton: {
    marginLeft: 8,
  },
  clearAllButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  clearAllText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
}

export default function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // TODO: Fetch notifications from backend
    // For now, showing sample notifications
    setNotifications([
      {
        id: '1',
        title: 'Watering Reminder',
        message: 'North Field Farm needs watering. Soil moisture is below 40%.',
        type: 'warning',
        timestamp: '2 hours ago',
        read: false,
      },
      {
        id: '2',
        title: 'Crop Ready to Harvest',
        message: 'Your Rice crop in South Farm is ready for harvesting.',
        type: 'success',
        timestamp: '5 hours ago',
        read: false,
      },
      {
        id: '3',
        title: 'Weather Alert',
        message: 'Heavy rain expected tomorrow. Consider protecting delicate crops.',
        type: 'warning',
        timestamp: '1 day ago',
        read: true,
      },
      {
        id: '4',
        title: 'Pest Alert',
        message: 'Armyworms detected in nearby farms. Apply preventive measures.',
        type: 'warning',
        timestamp: '2 days ago',
        read: true,
      },
    ]);
  }, []);

  const getIconName = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'check-circle';
      default:
        return 'info';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <MaterialIcons
        name={getIconName(item.type)}
        size={24}
        color={getIconColor(item.type)}
        style={styles.notificationIcon}
      />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.timestamp}</Text>
      </View>
      {!item.read && (
        <TouchableOpacity style={styles.markReadButton}>
          <MaterialIcons name="close" size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { marginLeft: 16 }]}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.content}
            scrollEnabled={true}
          />
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={() => setNotifications([])}
            >
              <Text style={styles.clearAllText}>Clear All Notifications</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

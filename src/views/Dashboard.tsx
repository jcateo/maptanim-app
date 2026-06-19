import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Farm } from '../types';
import { getFarms, deleteFarm, calculateProgress, calculateDaysRemaining } from '../lib/utils';
import { CROPS } from '../data';
import HamburgerMenu from '../components/HamburgerMenu';

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
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#4b5563',
    fontSize: 13,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
    fontSize: 18,
  },
  farmCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  farmInfo: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default function Dashboard({ navigation }: any) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadFarms();
    const unsubscribe = navigation.addListener('focus', loadFarms);
    return unsubscribe;
  }, [navigation]);

  const loadFarms = async () => {
    try {
      const data = await getFarms();
      setFarms(data);
    } catch (error) {
      console.error('Error loading farms:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFarms();
    setRefreshing(false);
  };

  const handleMenuNavigate = (screen: string) => {
    if (screen === 'History') {
      navigation.navigate('History');
    } else if (screen === 'Notifications') {
      navigation.navigate('Notifications');
      setUnreadNotifications(0);
    } else if (screen === 'ReportIssue') {
      navigation.navigate('ReportIssue');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // TODO: Clear user session and navigate to login
          navigation.getParent().navigate('Auth');
        },
      },
    ]);
  };

  const handleDeleteFarm = (id: string) => {
    Alert.alert('Delete Farm', 'Are you sure you want to delete this farm?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteFarm(id);
          await loadFarms();
        },
      },
    ]);
  };

  const FarmCard = ({ farm }: { farm: Farm }) => {
    const progress = calculateProgress(farm);
    const daysRemaining = calculateDaysRemaining(farm);

    const zoneCrops = Array.from(
      new Set(
        farm.zones
          .flatMap(z => z.polygons)
          .map(p => p.cropId)
          .filter(Boolean)
      )
    ).map(id => CROPS[id!]?.name).filter(Boolean);

    const cropListText = zoneCrops.length > 0 ? zoneCrops.join(', ') : farm.crop.name;

    return (
      <TouchableOpacity
        style={styles.farmCard}
        onPress={() => navigation.navigate('FarmDetail', { farmId: farm.id })}
        activeOpacity={0.7}
      >
        <Text style={styles.farmName}>{farm.name}</Text>
        <Text style={styles.farmInfo}>
          Crops: {cropListText} • Status: {farm.status}
        </Text>
        <Text style={styles.farmInfo}>
          Planting Date: {new Date(farm.plantingDate).toLocaleDateString()}
        </Text>
        <Text style={styles.farmInfo}>
          Days to Harvest: {daysRemaining} days
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
          Progress: {progress}%
        </Text>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteFarm(farm.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleMenuNavigate}
        onLogout={handleLogout}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="menu" size={28} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Farms</Text>
            <Text style={styles.headerSubtitle}>{farms.length} farm(s) active</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => handleMenuNavigate('Notifications')}
          style={{ position: 'relative' }}
        >
          <MaterialIcons name="notifications" size={28} color="#111827" />
          {unreadNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {farms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No farms yet</Text>
          <Text style={{ color: '#9ca3af', marginTop: 8 }}>
            Create your first farm to get started
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { marginTop: 16 }]}
            onPress={() => navigation.navigate('CreateFarm')}
          >
            <Text style={styles.addButtonText}>+ Create Farm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.addButton, { marginHorizontal: 24, marginTop: 16 }]}
            onPress={() => navigation.navigate('CreateFarm')}
          >
            <Text style={styles.addButtonText}>+ Create New Farm</Text>
          </TouchableOpacity>
          <ScrollView
            style={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          >
            {farms.map(farm => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
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
  harvestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  farmName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cropName: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  detailValue: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
});

interface HarvestedCrop {
  id: string;
  farmName: string;
  cropName: string;
  quantity: number;
  unit: string;
  harvestedDate: string;
  plantedDate: string;
  daysToGrow: number;
}

export default function HistoryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [harvests, setHarvests] = useState<HarvestedCrop[]>([]);

  useEffect(() => {
    // TODO: Fetch actual harvest history from backend/storage
    // For now, showing sample data
    setHarvests([
      {
        id: '1',
        farmName: 'North Field Farm',
        cropName: 'Rice',
        quantity: 50,
        unit: 'kg',
        harvestedDate: '2026-06-10',
        plantedDate: '2026-03-15',
        daysToGrow: 87,
      },
      {
        id: '2',
        farmName: 'South Farm',
        cropName: 'Corn',
        quantity: 75,
        unit: 'kg',
        harvestedDate: '2026-06-05',
        plantedDate: '2026-02-20',
        daysToGrow: 105,
      },
    ]);
  }, []);

  const renderHarvestItem = ({ item }: { item: HarvestedCrop }) => (
    <View style={styles.harvestCard}>
      <Text style={styles.farmName}>{item.farmName}</Text>
      <Text style={styles.cropName}>Crop: {item.cropName}</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Quantity Harvested:</Text>
        <Text style={styles.detailValue}>{item.quantity} {item.unit}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Growth Period:</Text>
        <Text style={styles.detailValue}>{item.daysToGrow} days</Text>
      </View>

      <Text style={styles.dateText}>
        Planted: {item.plantedDate} → Harvested: {item.harvestedDate}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { marginLeft: 16 }]}>Harvest History</Text>
      </View>

      {harvests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No harvests recorded yet</Text>
        </View>
      ) : (
        <FlatList
          data={harvests}
          renderItem={renderHarvestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MonitoringHub() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farm Monitoring</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monitor Your Crops</Text>
          <Text style={styles.cardText}>
            Track crop health, monitor weather conditions, and receive alerts for potential issues.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weather Alerts</Text>
          <Text style={styles.cardText}>
            Get real-time weather updates and recommendations for your farm.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Indicators</Text>
          <Text style={styles.cardText}>
            Visual indicators show your crop's overall health and growth progress.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});

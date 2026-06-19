import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CROPS, DISEASES } from '../data';

export default function AgriLibrary() {
  const insets = useSafeAreaInsets();
  const cropsArray = Object.values(CROPS);
  const diseasesArray = Object.values(DISEASES);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agri Library</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Available Crops ({cropsArray.length})</Text>
          {cropsArray.map(crop => (
            <View key={crop.id} style={styles.card}>
              <Text style={styles.cardEmoji}>{crop.imageUrl}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{crop.name}</Text>
                <Text style={styles.cardSubtitle}>{crop.daysToHarvest}d to harvest</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🦠 Disease Database ({diseasesArray.length})</Text>
          {diseasesArray.map((disease, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.diseaseEmoji}>🔬</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{disease.name}</Text>
                <Text style={styles.cardSubtitle}>{disease.affectedCrops.length} crop(s)</Text>
              </View>
            </View>
          ))}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  diseaseEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});

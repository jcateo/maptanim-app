import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Farm } from '../types';
import { getFarms } from '../lib/utils';
import { CROPS } from '../data';

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
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 28,
    backgroundColor: '#e5e7eb',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  stageLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  stageLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  stageLabelActive: {
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    borderRadius: 6,
    paddingVertical: 4,
  },
  stageTipsContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    padding: 16,
    marginTop: 16,
  },
  stageTipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 10,
  },
  stageTip: {
    marginBottom: 8,
    paddingLeft: 12,
  },
  stageTipText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  stageTipBullet: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stageButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  stageButtonActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCardDisabled: {
    opacity: 0.6,
    borderLeftColor: '#d1d5db',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#16a34a',
  },
  actionButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  actionButtonCompleted: {
    backgroundColor: '#10b981',
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 13,
  },
  notesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  riskCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: '#b45309',
    lineHeight: 20,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  farmInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  infoValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
});

interface FarmDetailScreenProps {
  navigation: any;
  route: any;
}

const GROWTH_STAGES = [
  { 
    id: 'germination', 
    label: 'Germination', 
    daysStart: 0, 
    daysEnd: 10,
    tips: [
      'Keep soil consistently moist but not waterlogged',
      'Maintain temperature between 20-25°C for optimal germination',
      'Protect seedlings from strong wind and direct sunlight',
      'Use well-draining soil with good organic matter',
      'Monitor for fungal diseases and damping off',
    ]
  },
  { 
    id: 'vegetative', 
    label: 'Vegetative', 
    daysStart: 10, 
    daysEnd: 30,
    tips: [
      'Provide 12-14 hours of sunlight daily',
      'Water deeply but less frequently as roots develop',
      'Apply nitrogen-rich fertilizer every 2 weeks',
      'Thin seedlings to prevent overcrowding',
      'Watch for pests like aphids and spider mites',
    ]
  },
  { 
    id: 'flowering', 
    label: 'Flowering', 
    daysStart: 30, 
    daysEnd: 60,
    tips: [
      'Reduce nitrogen and increase phosphorus/potassium',
      'Ensure consistent watering during flower development',
      'Maintain temperatures around 18-25°C',
      'Monitor for pollinator activity',
      'Watch for blossom end rot and calcium deficiency',
    ]
  },
  { 
    id: 'maturity', 
    label: 'Maturity', 
    daysStart: 60, 
    daysEnd: 999,
    tips: [
      'Reduce watering frequency as fruit ripens',
      'Maintain steady nutrient levels',
      'Monitor fruit color and firmness for harvest readiness',
      'Continue pest and disease monitoring',
      'Prepare harvest tools and storage facilities',
    ]
  },
];

function getDaysSincePlanting(plantingDate: string): number {
  const planting = new Date(plantingDate);
  const today = new Date();
  const diff = today.getTime() - planting.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getCurrentStage(daysSincePlanting: number): string {
  for (const stage of GROWTH_STAGES) {
    if (daysSincePlanting >= stage.daysStart && daysSincePlanting < stage.daysEnd) {
      return stage.id;
    }
  }
  return 'maturity';
}

function getStageProgress(daysSincePlanting: number): number {
  const currentStage = getCurrentStage(daysSincePlanting);
  const stage = GROWTH_STAGES.find(s => s.id === currentStage);
  if (!stage) return 100;
  
  const stageDuration = stage.daysEnd - stage.daysStart;
  const daysInStage = Math.min(daysSincePlanting - stage.daysStart, stageDuration);
  return Math.round((daysInStage / stageDuration) * 100);
}

function getStageInfo(stageId: string) {
  return GROWTH_STAGES.find(s => s.id === stageId);
}

export default function FarmDetailScreen({ navigation, route }: FarmDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { farmId } = route.params;
  const [farm, setFarm] = useState<Farm | null>(null);
  const [watered, setWatered] = useState(false);
  const [fertilized, setFertilized] = useState(false);
  const [harvestReady, setHarvestReady] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadFarmDetails();
  }, [farmId]);

  const loadFarmDetails = async () => {
    try {
      const farms = await getFarms();
      const selectedFarm = farms.find((f) => f.id === farmId);
      if (selectedFarm) {
        setFarm(selectedFarm);
      }
    } catch (error) {
      console.error('Error loading farm:', error);
    }
  };

  if (!farm) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const daysSincePlanting = getDaysSincePlanting(farm.plantingDate);
  const currentStage = getCurrentStage(daysSincePlanting);
  const isMaturity = currentStage === 'maturity';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{farm.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Farm Info */}
        <View style={styles.farmInfoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Crop</Text>
            <Text style={styles.infoValue}>{farm.crop.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Planted Date</Text>
            <Text style={styles.infoValue}>
              {new Date(farm.plantingDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Days Since Planting</Text>
            <Text style={styles.infoValue}>{daysSincePlanting} days</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{farm.status}</Text>
          </View>
        </View>

        {/* Growth Stage Tracker */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <MaterialIcons name="trending-up" size={20} color="#16a34a" />
            <Text style={styles.sectionTitleText}>Growth Stage Tracker</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressLabel}>
              {daysSincePlanting} days • {getStageInfo(currentStage)?.label}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getStageProgress(daysSincePlanting)}%`,
                  },
                ]}
              >
                {getStageProgress(daysSincePlanting) > 15 && (
                  <Text style={styles.progressText}>
                    {getStageProgress(daysSincePlanting)}%
                  </Text>
                )}
              </View>
            </View>
            
            {/* Stage Labels */}
            <View style={styles.stageLabelsContainer}>
              {GROWTH_STAGES.map((stage) => (
                <Text
                  key={stage.id}
                  style={[
                    styles.stageLabel,
                    stage.id === currentStage && styles.stageLabelActive,
                  ]}
                >
                  {stage.label}
                </Text>
              ))}
            </View>
          </View>

          {/* Stage-Specific Tips */}
          <View style={styles.stageTipsContainer}>
            <Text style={styles.stageTipsTitle}>
              💡 {getStageInfo(currentStage)?.label} Stage Tips
            </Text>
            {getStageInfo(currentStage)?.tips.map((tip, index) => (
              <View key={index} style={styles.stageTip}>
                <Text style={styles.stageTipText}>
                  <Text style={styles.stageTipBullet}>✓</Text>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Management Actions */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <MaterialIcons name="build" size={20} color="#16a34a" />
            <Text style={styles.sectionTitleText}>Management Actions</Text>
          </View>

          {/* Mark Watered Today */}
          <View style={[styles.actionCard, watered && styles.actionCardDisabled]}>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>💧 Mark Watered Today</Text>
              <Text style={styles.actionDescription}>
                Record that the farm was watered today
              </Text>
            </View>
            {watered ? (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check" size={16} color="#16a34a" />
                <Text style={styles.completedText}>Done</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setWatered(true);
                  Alert.alert('Success', 'Farm marked as watered today');
                }}
              >
                <Text style={styles.actionButtonText}>Mark</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Record Fertilizer Application */}
          <View style={[styles.actionCard, fertilized && styles.actionCardDisabled]}>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>🌱 Record Fertilizer Application</Text>
              <Text style={styles.actionDescription}>
                Log fertilizer or nutrient application
              </Text>
            </View>
            {fertilized ? (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check" size={16} color="#16a34a" />
                <Text style={styles.completedText}>Done</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setFertilized(true);
                  Alert.alert('Success', 'Fertilizer application recorded');
                }}
              >
                <Text style={styles.actionButtonText}>Record</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mark as Ready to Harvest */}
          <View style={[styles.actionCard, !isMaturity && styles.actionCardDisabled]}>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>🚜 Mark as Ready to Harvest</Text>
              <Text style={styles.actionDescription}>
                {isMaturity
                  ? 'Crop has reached maturity - ready for harvest'
                  : `Crop will be ready in ${Math.ceil(
                      getDaysSincePlanting(farm.plantingDate) - 60
                    )} days`}
              </Text>
            </View>
            {harvestReady ? (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check" size={16} color="#16a34a" />
                <Text style={styles.completedText}>Ready</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  !isMaturity && styles.actionButtonDisabled,
                ]}
                onPress={() => {
                  if (isMaturity) {
                    setHarvestReady(true);
                    Alert.alert('Success', 'Farm marked as ready to harvest');
                  } else {
                    Alert.alert(
                      'Not Ready',
                      'The crop must reach maturity stage before harvest'
                    );
                  }
                }}
                disabled={!isMaturity}
              >
                <Text style={styles.actionButtonText}>Mark Ready</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Observation Notes */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <MaterialIcons name="notes" size={20} color="#16a34a" />
            <Text style={styles.sectionTitleText}>Observation Notes</Text>
          </View>
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Add your observations:</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Record any observations about the crop health, weather, or other notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              editable
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

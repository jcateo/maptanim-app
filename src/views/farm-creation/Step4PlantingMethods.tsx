import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Crop } from '../../types';

interface Step4PlantingMethodsProps {
  crop: Crop;
  selectedMethod?: string;
  onChange: (method: string) => void;
}

export default function Step4PlantingMethods({
  crop,
  selectedMethod,
  onChange,
}: Step4PlantingMethodsProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Step 4: Planting Methods</Text>
      <Text style={styles.subtitle}>Choose how you'll plant your {crop.name}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Methods</Text>

        {crop.plantingMethod.methods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.methodCard,
              selectedMethod === method.name && styles.methodCardSelected,
            ]}
            onPress={() => onChange(method.name)}
          >
            <View style={styles.methodHeader}>
              <Text style={styles.methodName}>{method.name}</Text>
              <View style={styles.checkmark}>
                {selectedMethod === method.name && (
                  <Text style={styles.checkmarkText}>✓</Text>
                )}
              </View>
            </View>

            <View style={styles.stepsContainer}>
              {method.steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planting Specifications</Text>
        <View style={styles.specBox}>
          <SpecRow label="Spacing" value={crop.plantingMethod.spacing} />
          <SpecRow label="Depth" value={crop.plantingMethod.depth} />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Select the planting method that best fits your farm setup and resources.
        </Text>
      </View>
    </ScrollView>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  methodCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  methodCardSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepsContainer: {
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginRight: 8,
    minWidth: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  specBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
  },
  info: {
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    marginBottom: 16,
  },
  infoText: {
    color: '#047857',
    fontSize: 12,
    lineHeight: 18,
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Crop } from '../../types';

interface Step5SupportStructureProps {
  crop: Crop;
  value?: string;
  onChange: (structure: string) => void;
}

export default function Step5SupportStructure({
  crop,
  value,
  onChange,
}: Step5SupportStructureProps) {
  const { supportStructure } = crop;
  const isSelected = value === 'yes';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Step 5: Support Structure</Text>
      <Text style={styles.subtitle}>
        Does your {crop.name} need support?
      </Text>

      {!supportStructure ? (
        <View style={styles.noStructureBox}>
          <Text style={styles.noStructureText}>
            {crop.name} typically does not require support structures.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.proceedButton]}
            onPress={() => onChange('none')}
          >
            <Text style={styles.proceedButtonText}>Continue Without Support</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{supportStructure.description}</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => onChange('yes')}
            >
              <View style={styles.radio}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                Yes, I'll use support structures
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, !isSelected && styles.optionButtonSelected]}
              onPress={() => onChange('no')}
            >
              <View style={styles.radio}>
                {!isSelected && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.optionText, !isSelected && styles.optionTextSelected]}>
                No, I won't use support structures
              </Text>
            </TouchableOpacity>
          </View>

          {isSelected && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Materials Needed</Text>
              <View style={styles.materialsList}>
                {supportStructure.materials?.map((material, index) => (
                  <View key={index} style={styles.materialItem}>
                    <Text style={styles.materialBullet}>•</Text>
                    <Text style={styles.materialText}>{material}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.detailsTitle, { marginTop: 16 }]}>Installation Steps</Text>
              <View style={styles.stepsList}>
                {supportStructure.steps?.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Proper support structures help improve air circulation, reduce disease, and increase yields.
        </Text>
      </View>
    </ScrollView>
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
  noStructureBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    marginBottom: 24,
  },
  noStructureText: {
    color: '#047857',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionButtonSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  optionTextSelected: {
    color: '#047857',
    fontWeight: '600',
  },
  detailsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  materialsList: {
    gap: 8,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  materialBullet: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 8,
  },
  materialText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  stepsList: {
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
    minWidth: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: '#10b981',
  },
  proceedButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  info: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 16,
  },
  infoText: {
    color: '#0c4a6e',
    fontSize: 12,
    lineHeight: 18,
  },
});

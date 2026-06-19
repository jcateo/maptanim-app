import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Crop } from '../../types';

interface Step6NutrientNeedsProps {
  crop: Crop;
  selectedNeeds?: { n: string; p: string; k: string };
  selectedDeficiencies?: string[];
  onNeedsChange: (needs: { n: string; p: string; k: string }) => void;
  onDeficienciesChange: (deficiencies: string[]) => void;
}

export default function Step6NutrientNeeds({
  crop,
  selectedNeeds,
  selectedDeficiencies,
  onNeedsChange,
  onDeficienciesChange,
}: Step6NutrientNeedsProps) {
  const handleDeficiencyToggle = (deficiency: string) => {
    const current = selectedDeficiencies || [];
    if (current.includes(deficiency)) {
      onDeficienciesChange(current.filter(d => d !== deficiency));
    } else {
      onDeficienciesChange([...current, deficiency]);
    }
  };

  React.useEffect(() => {
    if (!selectedNeeds) {
      onNeedsChange({
        n: crop.nutrientNeeds.n,
        p: crop.nutrientNeeds.p,
        k: crop.nutrientNeeds.k,
      });
    }
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Step 6: Nutrient Needs & Deficiency Symptoms</Text>
      <Text style={styles.subtitle}>
        Manage nutrients and watch for deficiency signs
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Nutrient Levels</Text>
        <View style={styles.nutrientGrid}>
          <NutrientCard
            label="Nitrogen (N)"
            value={crop.nutrientNeeds.n}
            color="#3b82f6"
            symbol="N"
          />
          <NutrientCard
            label="Phosphorus (P)"
            value={crop.nutrientNeeds.p}
            color="#f59e0b"
            symbol="P"
          />
          <NutrientCard
            label="Potassium (K)"
            value={crop.nutrientNeeds.k}
            color="#ef4444"
            symbol="K"
          />
        </View>

        <View style={styles.fertiliserBox}>
          <Text style={styles.fertilizerLabel}>Recommended Fertilizer</Text>
          <Text style={styles.fertilizerValue}>{crop.nutrientNeeds.bestFertilizer}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deficiency Symptoms to Monitor</Text>
        <Text style={styles.smallText}>
          Select the symptoms you want to keep watch for:
        </Text>

        <View style={styles.deficiencyList}>
          {crop.nutrientNeeds.deficiencies.map((deficiency, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.deficiencyItem,
                selectedDeficiencies?.includes(deficiency) &&
                  styles.deficiencyItemSelected,
              ]}
              onPress={() => handleDeficiencyToggle(deficiency)}
            >
              <View style={styles.checkbox}>
                {selectedDeficiencies?.includes(deficiency) && (
                  <Text style={styles.checkmarkIcon}>✓</Text>
                )}
              </View>
              <Text
                style={[
                  styles.deficiencyText,
                  selectedDeficiencies?.includes(deficiency) &&
                    styles.deficiencyTextSelected,
                ]}
              >
                {deficiency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What to Do</Text>
        <View style={styles.remedyBox}>
          <Text style={styles.remedyTitle}>Remedy for Deficiencies</Text>
          <Text style={styles.remedyText}>{crop.nutrientNeeds.remedy}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Regular monitoring and proper fertilizer application will help prevent nutrient deficiencies.
        </Text>
      </View>
    </ScrollView>
  );
}

function NutrientCard({
  label,
  value,
  color,
  symbol,
}: {
  label: string;
  value: string;
  color: string;
  symbol: string;
}) {
  return (
    <View style={styles.nutrientCard}>
      <View style={[styles.nutrientSymbol, { backgroundColor: color }]}>
        <Text style={styles.nutrientSymbolText}>{symbol}</Text>
      </View>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <Text style={styles.nutrientValue}>{value}</Text>
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
  smallText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  nutrientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  nutrientCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nutrientSymbol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientSymbolText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  nutrientLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  nutrientValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  fertiliserBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  fertilizerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  fertilizerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  deficiencyList: {
    gap: 8,
  },
  deficiencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  deficiencyItemSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkIcon: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  deficiencyText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  deficiencyTextSelected: {
    color: '#047857',
    fontWeight: '600',
  },
  remedyBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  remedyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  remedyText: {
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
  },
  info: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    marginBottom: 16,
  },
  infoText: {
    color: '#166534',
    fontSize: 12,
    lineHeight: 18,
  },
});

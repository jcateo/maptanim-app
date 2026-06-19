import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Farm, FarmZone, Polygon, Point, Crop, SoilType } from '../types';
import { generateId } from '../lib/utils';
import { CROPS } from '../data';

import Step1PlantingDate from './farm-creation/Step1PlantingDate';
import Step2ImageCapture from './farm-creation/Step2ImageCapture';
import Step2PolygonDraw from './farm-creation/Step2PolygonDraw';
import Step3CropSelection from './farm-creation/Step3CropSelection';
import Step4PlantingMethods from './farm-creation/Step4PlantingMethods';
import Step5SupportStructure from './farm-creation/Step5SupportStructure';
import Step6NutrientNeeds from './farm-creation/Step6NutrientNeeds';
import Step7ReviewFarm from './farm-creation/Step7ReviewFarm';

interface FarmCreationState {
  step: number;
  plantingDate?: string;
  zones: FarmZone[];
  crop?: Crop;
  soil?: SoilType;
  plantingMethod?: string;
  supportStructure?: string;
  nutrientNeeds?: { n: string; p: string; k: string };
  deficiencies?: string[];
  notes?: string;
}

interface FarmCreationFlowProps {
  onSave: (farm: Farm) => void;
  onCancel: () => void;
  editingFarm?: Farm;
}

export default function FarmCreationFlow({
  onSave,
  onCancel,
  editingFarm,
}: FarmCreationFlowProps) {
  const [state, setState] = useState<FarmCreationState>({
    step: 1,
    zones: editingFarm?.zones || [],
    plantingDate: editingFarm?.plantingDate,
    crop: editingFarm?.crop,
    soil: editingFarm?.soil,
    plantingMethod: editingFarm?.plantingMethod,
    supportStructure: editingFarm?.supportStructure,
    nutrientNeeds: editingFarm?.nutrientNeeds,
    deficiencies: editingFarm?.deficiencies,
    notes: editingFarm?.notes,
  });

  const handleNextStep = () => {
    // Validation based on step
    if (state.step === 1 && !state.plantingDate) {
      Alert.alert('Required', 'Please select a planting date');
      return;
    }
    if (state.step === 2 && state.zones.length === 0) {
      Alert.alert('Required', 'Please capture an image and draw at least one zone');
      return;
    }
    if (state.step === 3) {
      const activePolys = state.zones.flatMap(z => z.polygons);
      const firstPolyWithCrop = activePolys.find(p => p.cropId);
      if (!firstPolyWithCrop || !firstPolyWithCrop.cropId) {
        Alert.alert('Required', 'Please assign a crop to at least one zone');
        return;
      }
      // Set the first zone's crop for subsequent steps
      const crop = CROPS[firstPolyWithCrop.cropId];
      setState(prev => ({ ...prev, crop }));
    }
    if (state.step === 4 && !state.plantingMethod) {
      Alert.alert('Required', 'Please select a planting method');
      return;
    }
    if (state.step === 6 && !state.nutrientNeeds) {
      Alert.alert('Required', 'Please select nutrient needs');
      return;
    }

    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handlePrevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const handleSave = () => {
    const activePolys = state.zones.flatMap(z => z.polygons);
    const firstPolyWithCrop = activePolys.find(p => p.cropId);
    
    if (!firstPolyWithCrop || !firstPolyWithCrop.cropId || !state.plantingDate) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    const crop = CROPS[firstPolyWithCrop.cropId];

    const farm: Farm = {
      id: editingFarm?.id || generateId(),
      name: `${crop.name} Farm - ${new Date(state.plantingDate).toLocaleDateString()}`,
      plantingDate: state.plantingDate,
      zones: state.zones,
      crop: crop,
      soil: state.soil || 'Loam',
      plantingMethod: state.plantingMethod || '',
      supportStructure: state.supportStructure,
      nutrientNeeds: state.nutrientNeeds || { n: '', p: '', k: '' },
      deficiencies: state.deficiencies,
      notes: state.notes,
      status: 'Active',
      createdAt: editingFarm?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(farm);
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Step1PlantingDate
            value={state.plantingDate}
            onChange={date => setState(prev => ({ ...prev, plantingDate: date }))}
          />
        );
      case 2:
        return (
          <Step2ImageCapture
            zones={state.zones}
            onZonesChange={zones => setState(prev => ({ ...prev, zones }))}
            onNext={() => setState(prev => ({ ...prev, step: 2.1 }))}
          />
        );
      case 2.1:
        return (
          <Step2PolygonDraw
            zones={state.zones}
            onZonesChange={zones => setState(prev => ({ ...prev, zones }))}
            onBack={() => setState(prev => ({ ...prev, step: 2 }))}
            onNext={() => setState(prev => ({ ...prev, step: 3 }))}
          />
        );
      case 3:
        return (
          <Step3CropSelection
            zones={state.zones}
            onZonesChange={zones => setState(prev => ({ ...prev, zones }))}
            selectedSoil={state.soil}
            onSoilChange={soil => setState(prev => ({ ...prev, soil }))}
          />
        );
      case 4:
        return (
          <Step4PlantingMethods
            crop={state.crop!}
            selectedMethod={state.plantingMethod}
            onChange={method => setState(prev => ({ ...prev, plantingMethod: method }))}
          />
        );
      case 5:
        return (
          <Step5SupportStructure
            crop={state.crop!}
            value={state.supportStructure}
            onChange={structure => setState(prev => ({ ...prev, supportStructure: structure }))}
          />
        );
      case 6:
        return (
          <Step6NutrientNeeds
            crop={state.crop!}
            selectedNeeds={state.nutrientNeeds}
            selectedDeficiencies={state.deficiencies}
            onNeedsChange={needs =>
              setState(prev => ({ ...prev, nutrientNeeds: needs }))
            }
            onDeficienciesChange={defs =>
              setState(prev => ({ ...prev, deficiencies: defs }))
            }
          />
        );
      case 7:
        return (
          <Step7ReviewFarm
            plantingDate={state.plantingDate!}
            crop={state.crop!}
            zones={state.zones}
            soil={state.soil!}
            plantingMethod={state.plantingMethod!}
            supportStructure={state.supportStructure}
            nutrientNeeds={state.nutrientNeeds!}
            deficiencies={state.deficiencies}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>
          Step {Math.ceil(state.step)} of 7
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>{renderStep()}</ScrollView>

      <View style={styles.footer}>
        {state.step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevStep}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        {state.step < 7 && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        )}
        {state.step === 7 && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Farm</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  backButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#10b981',
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#059669',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Svg, { Polygon as SvgPolygon, Text as SvgText } from 'react-native-svg';
import { Crop, SoilType, FarmZone } from '../../types';
import { CROPS } from '../../data';

interface Step3CropSelectionProps {
  zones: FarmZone[];
  onZonesChange: (zones: FarmZone[]) => void;
  selectedSoil?: SoilType;
  onSoilChange: (soil: SoilType) => void;
}

const SOIL_IMAGES = {
  Loam: require('../../../assets/loam_soil.png'),
  Clay: require('../../../assets/clay_soil.png'),
  Sandy: require('../../../assets/sandy_soil.png'),
  Silty: require('../../../assets/silty_soil.png'),
  Chalky: require('../../../assets/chalky_soil.png'),
  Peaty: require('../../../assets/peaty_soil.png'),
};

const SOIL_DESCRIPTIONS = {
  Loam: 'Loam soil is a fertile mixture of sand, silt, and clay. It retains moisture well, provides excellent drainage and aeration, and is rich in organic nutrients, making it ideal for most vegetables.',
  Clay: 'Clay soil has dense, fine particles that retain water and nutrients very well. However, it drains slowly and can become hard and compacted, requiring careful watering and aeration.',
  Sandy: 'Sandy soil consists of large, coarse particles that drain water and nutrients very quickly. It warms up fast in spring and is easy to work, but needs frequent watering and composting.',
  Silty: 'Silty soil has medium-sized particles, feels smooth and soapy to the touch, and retains moisture exceptionally well. It is highly fertile but easily compacted when wet.',
  Chalky: 'Chalky soil is alkaline, shallow, and stony, lying over chalk or limestone deposits. It drains quickly and can cause nutrient deficiencies (like iron deficiency) in some acid-loving crops.',
  Peaty: 'Peaty soil is rich in organic matter, dark, and highly acidic. It holds moisture very well and provides a soft, spongy environment that is highly supportive for roots.'
};

export default function Step3CropSelection({
  zones,
  onZonesChange,
  selectedSoil,
  onSoilChange,
}: Step3CropSelectionProps) {
  const cropList = Object.values(CROPS);
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null);
  const [selectedSoilDetail, setSelectedSoilDetail] = useState<SoilType | null>(null);
  const [canvasLayout, setCanvasLayout] = useState<{ width: number; height: number } | null>(null);

  const activeZone = zones[activeZoneIndex];

  // Auto-select the first polygon if none is selected
  useEffect(() => {
    if (activeZone && activeZone.polygons.length > 0) {
      const activePolys = activeZone.polygons;
      const found = activePolys.find(p => p.id === selectedPolygonId);
      if (!found) {
        setSelectedPolygonId(activePolys[0].id);
      }
    } else {
      setSelectedPolygonId(null);
    }
  }, [activeZoneIndex, zones]);

  // Find currently selected polygon & crop
  const allPolygons = zones.flatMap(z => z.polygons);
  const selectedPolygon = allPolygons.find(p => p.id === selectedPolygonId);
  const assignedCrop = selectedPolygon?.cropId ? CROPS[selectedPolygon.cropId] : undefined;

  const handlePolygonSelect = (polygonId: string, zoneIdx: number) => {
    setActiveZoneIndex(zoneIdx);
    setSelectedPolygonId(polygonId);
  };

  const handleCropSelect = (crop: Crop) => {
    if (!selectedPolygonId) {
      alert('Please select a zone first to assign a crop');
      return;
    }
    const updatedZones = [...zones];
    // Find zone and polygon to update
    for (let zIndex = 0; zIndex < updatedZones.length; zIndex++) {
      const polygon = updatedZones[zIndex].polygons.find(p => p.id === selectedPolygonId);
      if (polygon) {
        polygon.cropId = crop.id;
        onZonesChange(updatedZones);
        
        // Auto-recommend and select first suitable soil type if not already set or not compatible
        if (!selectedSoil || !crop.suitableSoils.includes(selectedSoil)) {
          onSoilChange(crop.suitableSoils[0]);
        }
        break;
      }
    }
  };

  const handleSoilSelect = (soil: SoilType) => {
    onSoilChange(soil);
    setSelectedSoilDetail(soil); // Open educational modal
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Step 3: Intercropping (Select crops for zones)</Text>
      <Text style={styles.subtitle}>
        Select a zone from the map or list, then assign a crop to it:
      </Text>

      {/* Map Layout display with SVG Overlay */}
      {activeZone && (
        <View
          style={styles.canvasContainer}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCanvasLayout({ width, height });
          }}
        >
          <Image
            source={{ uri: activeZone.imageUri }}
            style={styles.canvas}
            resizeMode="cover"
          />
          {canvasLayout && (
            <Svg style={StyleSheet.absoluteFillObject}>
              {activeZone.polygons.map((polygon) => {
                const isSelected = polygon.id === selectedPolygonId;
                const pointsString = polygon.points
                  .map(p => {
                    const cx = (p.x / activeZone.imageWidth) * canvasLayout.width;
                    const cy = (p.y / activeZone.imageHeight) * canvasLayout.height;
                    return `${cx},${cy}`;
                  })
                  .join(' ');

                const cropEmoji = polygon.cropId ? CROPS[polygon.cropId]?.imageUrl : '';

                // Calculate bounding box center for text overlay
                const xs = polygon.points.map(p => p.x);
                const ys = polygon.points.map(p => p.y);
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);
                
                const centerX = ((minX + maxX) / 2 / activeZone.imageWidth) * canvasLayout.width;
                const centerY = ((minY + maxY) / 2 / activeZone.imageHeight) * canvasLayout.height;

                return (
                  <React.Fragment key={polygon.id}>
                    <SvgPolygon
                      points={pointsString}
                      fill={polygon.color ? polygon.color + (isSelected ? '77' : '33') : '#10b98133'}
                      stroke={isSelected ? '#f59e0b' : (polygon.color || '#10b981')}
                      strokeWidth={isSelected ? 4 : 2}
                      onPress={() => handlePolygonSelect(polygon.id, activeZoneIndex)}
                    />
                    {cropEmoji ? (
                      <SvgText
                        x={centerX}
                        y={centerY}
                        fontSize={20}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        onPress={() => handlePolygonSelect(polygon.id, activeZoneIndex)}
                      >
                        {cropEmoji}
                      </SvgText>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </Svg>
          )}
        </View>
      )}

      {/* Zone Navigator / Switcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Zone to Configure</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneList}>
          {zones.map((zone, zIdx) => 
            zone.polygons.map((polygon, pIdx) => {
              const isSelected = polygon.id === selectedPolygonId;
              const crop = polygon.cropId ? CROPS[polygon.cropId] : null;
              return (
                <TouchableOpacity
                  key={polygon.id}
                  style={[styles.zoneChip, isSelected && styles.zoneChipSelected]}
                  onPress={() => handlePolygonSelect(polygon.id, zIdx)}
                >
                  <Text style={[styles.zoneChipColor, { color: polygon.color }]}>■</Text>
                  <Text style={[styles.zoneChipText, isSelected && styles.zoneChipTextSelected]}>
                    {polygon.name || `Zone ${pIdx + 1}`} {crop ? `(${crop.imageUrl})` : '(No Crop)'}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Crop Selector for Active Zone */}
      {selectedPolygonId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available Crops for "{selectedPolygon?.name || 'Selected Zone'}"
          </Text>
          <View style={styles.cropGrid}>
            {cropList.map(crop => {
              const isAssignedToThisZone = selectedPolygon?.cropId === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  style={[
                    styles.cropCard,
                    isAssignedToThisZone && styles.cropCardSelected,
                  ]}
                  onPress={() => handleCropSelect(crop)}
                >
                  <Text style={styles.cropEmoji}>{crop.imageUrl}</Text>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <Text style={styles.cropInfo}>{crop.daysToHarvest}d to harvest</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Crop Details & Soil guide */}
      {assignedCrop && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Soil Types</Text>
            <Text style={styles.smallText}>
              Select the soil type matching your zone (Click to view sample image & details):
            </Text>
            <View style={styles.soilGrid}>
              {assignedCrop.suitableSoils.map(soil => (
                <TouchableOpacity
                  key={soil}
                  style={[
                    styles.soilButton,
                    selectedSoil === soil && styles.soilButtonSelected,
                  ]}
                  onPress={() => handleSoilSelect(soil)}
                >
                  <Text
                    style={[
                      styles.soilButtonText,
                      selectedSoil === soil && styles.soilButtonTextSelected,
                    ]}
                  >
                    🔍 {soil}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>"{assignedCrop.name}" Details</Text>
            <View style={styles.detailsBox}>
              <DetailRow label="Scientific Name" value={assignedCrop.scientificName || 'N/A'} />
              <DetailRow label="Growth Habit" value={assignedCrop.growthHabit} />
              <DetailRow label="Days to Harvest" value={`${assignedCrop.daysToHarvest} days`} />
              <DetailRow label="Growing Seasons" value={assignedCrop.seasons.join(', ')} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrient Requirements</Text>
            <View style={styles.nutrientBox}>
              <NutrientRow label="Nitrogen (N)" value={assignedCrop.nutrientNeeds.n} />
              <NutrientRow label="Phosphorus (P)" value={assignedCrop.nutrientNeeds.p} />
              <NutrientRow label="Potassium (K)" value={assignedCrop.nutrientNeeds.k} />
              <DetailRow label="Recommended Fertilizer" value={assignedCrop.nutrientNeeds.bestFertilizer} />
            </View>
          </View>
        </>
      )}

      {/* Educational Soil Modal */}
      {selectedSoilDetail && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedSoilDetail}
          onRequestClose={() => setSelectedSoilDetail(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🌾 {selectedSoilDetail} Soil Guide</Text>
              
              <Image
                source={SOIL_IMAGES[selectedSoilDetail]}
                style={styles.modalImage}
                resizeMode="cover"
              />

              <Text style={styles.modalDescription}>
                {SOIL_DESCRIPTIONS[selectedSoilDetail]}
              </Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedSoilDetail(null)}
              >
                <Text style={styles.modalCloseButtonText}>Close Guide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 You must configure at least one crop for your drawn planting zones. 
          Tap on recommended soils to check their texture illustrations.
        </Text>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function NutrientRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.nutrientRow}>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  canvasContainer: {
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  canvas: {
    width: '100%',
    height: Dimensions.get('window').width * 0.75,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1f2937',
  },
  zoneList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  zoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  zoneChipSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  zoneChipColor: {
    fontSize: 14,
    marginRight: 6,
  },
  zoneChipText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  zoneChipTextSelected: {
    color: '#047857',
    fontWeight: '600',
  },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cropCard: {
    width: '31%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cropCardSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  cropEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  cropName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  cropInfo: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  detailsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
  },
  smallText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  soilGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  soilButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  soilButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  soilButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  soilButtonTextSelected: {
    color: '#fff',
  },
  nutrientBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  nutrientLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  nutrientValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

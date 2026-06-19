import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Svg, { Polygon as SvgPolygon } from 'react-native-svg';
import { FarmZone, Crop } from '../../types';
import { CROPS } from '../../data';

interface Step7ReviewFarmProps {
  plantingDate: string;
  crop: Crop;
  zones: FarmZone[];
  soil: string;
  plantingMethod: string;
  supportStructure?: string;
  nutrientNeeds: { n: string; p: string; k: string };
  deficiencies?: string[];
}

export default function Step7ReviewFarm({
  plantingDate,
  crop,
  zones,
  soil,
  plantingMethod,
  supportStructure,
  nutrientNeeds,
  deficiencies,
}: Step7ReviewFarmProps) {
  const totalPolygons = zones.reduce((sum, zone) => sum + zone.polygons.length, 0);

  // Group unique crops across all zones
  const activeCropsList = Array.from(
    new Set(
      zones
        .flatMap(z => z.polygons)
        .map(p => p.cropId)
        .filter(Boolean)
    )
  ).map(id => CROPS[id!]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Step 7: Review Your Farm</Text>
      <Text style={styles.subtitle}>Verify all details before saving</Text>

      <View style={styles.section}>
        <SectionHeader title="📅 Planting Schedule" />
        <InfoRow label="Planting Date" value={new Date(plantingDate).toLocaleDateString()} />
        <InfoRow label="Days to Harvest (Primary)" value={`${crop.daysToHarvest} days`} />
        <InfoRow
          label="Estimated Harvest"
          value={new Date(
            new Date(plantingDate).getTime() + crop.daysToHarvest * 24 * 60 * 60 * 1000
          ).toLocaleDateString()}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="🌾 Planted Crops" />
        {activeCropsList.length > 0 ? (
          activeCropsList.map(activeCrop => (
            <View key={activeCrop.id} style={styles.cropInfoRow}>
              <Text style={styles.cropEmoji}>{activeCrop.imageUrl}</Text>
              <View style={styles.cropDetails}>
                <Text style={styles.cropName}>{activeCrop.name}</Text>
                <Text style={styles.cropScientific}>{activeCrop.scientificName || 'N/A'}</Text>
              </View>
              <Text style={styles.cropHarvest}>{activeCrop.daysToHarvest}d harvest</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCropText}>No crops configured yet</Text>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="🗺️ Farm Layout & Zones" />
        <InfoRow label="Total Images/Zones" value={zones.length.toString()} />
        <InfoRow label="Total Planting Areas" value={totalPolygons.toString()} />

        {zones.map((zone, index) => (
          <ZonePreviewCard key={zone.id} zone={zone} index={index} />
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="🌱 Soil & Planting" />
        <InfoRow label="Soil Type" value={soil} />
        <InfoRow label="Planting Method" value={plantingMethod} />
        <InfoRow label="Plant Spacing" value={crop.plantingMethod.spacing} />
        <InfoRow label="Planting Depth" value={crop.plantingMethod.depth} />
      </View>

      {supportStructure && supportStructure !== 'none' && (
        <View style={styles.section}>
          <SectionHeader title="🏗️ Support Structure" />
          <Text style={styles.supportText}>
            {supportStructure === 'yes'
              ? '✓ This farm will use support structures'
              : 'No support structures will be used'}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="⚗️ Nutrient Management (Primary Crop)" />
        <View style={styles.nutrientGrid}>
          <NutrientBox label="Nitrogen (N)" value={nutrientNeeds.n} color="#3b82f6" />
          <NutrientBox label="Phosphorus (P)" value={nutrientNeeds.p} color="#f59e0b" />
          <NutrientBox label="Potassium (K)" value={nutrientNeeds.k} color="#ef4444" />
        </View>
        <InfoRow label="Recommended Fertilizer" value={crop.nutrientNeeds.bestFertilizer} />

        {deficiencies && deficiencies.length > 0 && (
          <View style={styles.deficiencyBox}>
            <Text style={styles.deficiencyTitle}>Symptoms to Monitor</Text>
            {deficiencies.map((deficiency, index) => (
              <Text key={index} style={styles.deficiencyItem}>
                • {deficiency}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>✓ Farm Ready to Save</Text>
        <Text style={styles.summaryText}>
          All information has been filled in. Click "Save Farm" to create your farm profile and
          start monitoring!
        </Text>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function ZonePreviewCard({ zone, index }: { zone: FarmZone; index: number }) {
  const [canvasLayout, setCanvasLayout] = useState<{ width: number; height: number } | null>(null);

  return (
    <View style={styles.zonePreview}>
      <Text style={styles.zonePreviewTitle}>Zone {index + 1}</Text>
      
      {zone.imageUri && (
        <View
          style={styles.canvasContainer}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCanvasLayout({ width, height });
          }}
        >
          <Image
            source={{ uri: zone.imageUri }}
            style={styles.zoneImage}
            resizeMode="cover"
          />
          {canvasLayout && (
            <Svg style={StyleSheet.absoluteFillObject}>
              {zone.polygons.map((polygon) => {
                const pointsString = polygon.points
                  .map(p => {
                    const cx = (p.x / zone.imageWidth) * canvasLayout.width;
                    const cy = (p.y / zone.imageHeight) * canvasLayout.height;
                    return `${cx},${cy}`;
                  })
                  .join(' ');

                return (
                  <SvgPolygon
                    key={polygon.id}
                    points={pointsString}
                    fill={polygon.color ? polygon.color + '33' : '#10b98133'}
                    stroke={polygon.color || '#10b981'}
                    strokeWidth={2}
                  />
                );
              })}
            </Svg>
          )}
        </View>
      )}

      {/* List of planting areas inside this zone */}
      <View style={styles.polygonList}>
        {zone.polygons.map((polygon, pIdx) => {
          const crop = polygon.cropId ? CROPS[polygon.cropId] : null;
          return (
            <View key={polygon.id} style={styles.polygonItem}>
              <Text style={[styles.polygonColor, { color: polygon.color }]}>■</Text>
              <Text style={styles.polygonName}>
                {polygon.name || `Area ${pIdx + 1}`}
              </Text>
              <Text style={styles.polygonCrop}>
                {crop ? `${crop.imageUrl} ${crop.name}` : '❌ No Crop'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function NutrientBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.nutrientBox}>
      <View style={[styles.nutrientColor, { backgroundColor: color }]} />
      <Text style={styles.nutrientBoxLabel}>{label}</Text>
      <Text style={styles.nutrientBoxValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'right',
    maxWidth: '50%',
  },
  cropInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cropEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  cropDetails: {
    flex: 1,
  },
  cropName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  cropScientific: {
    fontSize: 11,
    color: '#9ca3af',
  },
  cropHarvest: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  noCropText: {
    fontSize: 13,
    color: '#ef4444',
    fontStyle: 'italic',
  },
  zonePreview: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  zonePreviewTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  canvasContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
  },
  zoneImage: {
    width: '100%',
    height: '100%',
  },
  polygonList: {
    gap: 4,
  },
  polygonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  polygonColor: {
    fontSize: 16,
    marginRight: 8,
  },
  polygonName: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  polygonCrop: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  supportText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '500',
    paddingVertical: 8,
  },
  nutrientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  nutrientBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nutrientColor: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginBottom: 6,
  },
  nutrientBoxLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  nutrientBoxValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  deficiencyBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  deficiencyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  deficiencyItem: {
    fontSize: 12,
    color: '#b45309',
    lineHeight: 18,
  },
  summaryBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: '#0c663c',
    lineHeight: 18,
  },
});

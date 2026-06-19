import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  GestureResponderEvent,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import Svg, { Polygon as SvgPolygon, Polyline as SvgPolyline, Circle as SvgCircle } from 'react-native-svg';
import { FarmZone, Point, Polygon } from '../../types';
import { generateId } from '../../lib/utils';

interface Step2PolygonDrawProps {
  zones: FarmZone[];
  onZonesChange: (zones: FarmZone[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Step2PolygonDraw({
  zones,
  onZonesChange,
  onBack,
  onNext,
}: Step2PolygonDrawProps) {
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [canvasLayout, setCanvasLayout] = useState<{ width: number; height: number } | null>(null);

  if (zones.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No images to draw on</Text>
        <Text style={styles.subtitle}>Please go back and capture an image first</Text>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeZone = zones[activeZoneIndex];

  const handleCanvasPress = (event: GestureResponderEvent) => {
    if (!canvasLayout) return;
    const { locationX, locationY } = event.nativeEvent;
    
    // Convert canvas-relative touch coordinates to image-relative coordinates
    const newPoint: Point = {
      x: (locationX / canvasLayout.width) * activeZone.imageWidth,
      y: (locationY / canvasLayout.height) * activeZone.imageHeight,
    };
    
    setDrawingPoints([...drawingPoints, newPoint]);
  };

  const handleFinishPolygon = () => {
    if (drawingPoints.length < 3) {
      alert('A polygon needs at least 3 points');
      return;
    }

    const defaultName = `Zone ${activeZone.polygons.length + 1}`;
    const newPolygon: Polygon = {
      id: generateId(),
      points: drawingPoints,
      color: COLORS[selectedColorIndex % COLORS.length],
      name: defaultName,
    };

    const updatedZones = [...zones];
    updatedZones[activeZoneIndex].polygons.push(newPolygon);
    onZonesChange(updatedZones);
    setDrawingPoints([]);
    setSelectedColorIndex((selectedColorIndex + 1) % COLORS.length);
  };

  const handleClearPoints = () => {
    setDrawingPoints([]);
  };

  const handleRemoveLastPoint = () => {
    setDrawingPoints(drawingPoints.slice(0, -1));
  };

  const handleRemovePolygon = (polygonId: string) => {
    const updatedZones = [...zones];
    updatedZones[activeZoneIndex].polygons = updatedZones[
      activeZoneIndex
    ].polygons.filter(p => p.id !== polygonId);
    onZonesChange(updatedZones);
  };

  const handleRenamePolygon = (polygonId: string, name: string) => {
    const updatedZones = [...zones];
    const polygon = updatedZones[activeZoneIndex].polygons.find(p => p.id === polygonId);
    if (polygon) {
      polygon.name = name;
      onZonesChange(updatedZones);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Step 2.1: Draw your planting zones</Text>
      <Text style={styles.subtitle}>
        Tap on the image below to place points. Tap 3 or more points, then click "Complete Zone".
      </Text>

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCanvasPress}
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
            {/* Render completed polygons */}
            {activeZone.polygons.map((polygon) => {
              const pointsString = polygon.points
                .map(p => {
                  const cx = (p.x / activeZone.imageWidth) * canvasLayout.width;
                  const cy = (p.y / activeZone.imageHeight) * canvasLayout.height;
                  return `${cx},${cy}`;
                })
                .join(' ');

              return (
                <SvgPolygon
                  key={polygon.id}
                  points={pointsString}
                  fill={polygon.color ? polygon.color + '33' : '#10b98133'} // 20% opacity fill
                  stroke={polygon.color || '#10b981'}
                  strokeWidth={3}
                />
              );
            })}

            {/* Render current drawing path */}
            {drawingPoints.length > 0 && (
              <>
                <SvgPolyline
                  points={drawingPoints
                    .map(p => {
                      const cx = (p.x / activeZone.imageWidth) * canvasLayout.width;
                      const cy = (p.y / activeZone.imageHeight) * canvasLayout.height;
                      return `${cx},${cy}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                />
                {drawingPoints.map((p, idx) => {
                  const cx = (p.x / activeZone.imageWidth) * canvasLayout.width;
                  const cy = (p.y / activeZone.imageHeight) * canvasLayout.height;
                  return (
                    <SvgCircle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#f59e0b"
                    />
                  );
                })}
              </>
            )}
          </Svg>
        )}
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.pointButton]}
            onPress={handleClearPoints}
          >
            <Text style={styles.buttonText}>Clear Points ({drawingPoints.length})</Text>
          </TouchableOpacity>

          {drawingPoints.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.undoButton]}
              onPress={handleRemoveLastPoint}
            >
              <Text style={styles.buttonText}>Undo</Text>
            </TouchableOpacity>
          )}

          {drawingPoints.length >= 3 && (
            <TouchableOpacity
              style={[styles.button, styles.finishButton]}
              onPress={handleFinishPolygon}
            >
              <Text style={styles.buttonText}>Complete Zone</Text>
            </TouchableOpacity>
          )}
        </View>

        {activeZone.polygons.length > 0 && (
          <View style={styles.polygonsContainer}>
            <Text style={styles.polygonsTitle}>Drawn Zones ({activeZone.polygons.length})</Text>
            <Text style={styles.helperText}>Tap on a zone name below to rename it:</Text>
            {activeZone.polygons.map((polygon, index) => (
              <View key={polygon.id} style={styles.polygonItem}>
                <Text style={[styles.polygonColor, { color: polygon.color }]}>■</Text>
                <TextInput
                  style={styles.zoneNameInput}
                  value={polygon.name || `Zone ${index + 1}`}
                  onChangeText={(text) => handleRenamePolygon(polygon.id, text)}
                  placeholder={`Zone ${index + 1}`}
                />
                <Text style={styles.polygonPointsCount}>({polygon.points.length} pts)</Text>
                <TouchableOpacity
                  onPress={() => handleRemovePolygon(polygon.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {zones.length > 1 && (
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={() => setActiveZoneIndex(Math.max(0, activeZoneIndex - 1))}
            disabled={activeZoneIndex === 0}
          >
            <Text style={[styles.navButtonText, activeZoneIndex === 0 && { color: '#9ca3af' }]}>← Prev Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.nextImageButton]}
            onPress={() => setActiveZoneIndex(Math.min(zones.length - 1, activeZoneIndex + 1))}
            disabled={activeZoneIndex === zones.length - 1}
          >
            <Text style={[styles.navButtonText, activeZoneIndex === zones.length - 1 && { color: '#9ca3af' }]}>Next Image →</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 You can draw multiple zones on the same image (e.g. to partition different crops). 
          Later you can assign different crops to each individual zone you've drawn.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.proceedButton, zones.every(z => z.polygons.length === 0) && styles.disabledButton]}
        onPress={onNext}
        disabled={zones.every(z => z.polygons.length === 0)}
      >
        <Text style={styles.proceedButtonText}>Proceed to Crop Selection →</Text>
      </TouchableOpacity>
    </ScrollView>
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
    lineHeight: 20,
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
  controlsContainer: {
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointButton: {
    backgroundColor: '#10b981',
    flex: 1,
    minWidth: 100,
  },
  undoButton: {
    backgroundColor: '#f59e0b',
    flex: 1,
    minWidth: 80,
  },
  finishButton: {
    backgroundColor: '#3b82f6',
    flex: 1,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  polygonsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  polygonsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  helperText: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
  },
  polygonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  polygonColor: {
    fontSize: 20,
    marginRight: 8,
  },
  zoneNameInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  polygonPointsCount: {
    fontSize: 11,
    color: '#9ca3af',
    marginHorizontal: 8,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#e5e7eb',
  },
  nextImageButton: {
    backgroundColor: '#dbeafe',
  },
  navButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
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
  proceedButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  proceedButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

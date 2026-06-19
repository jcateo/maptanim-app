import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FarmZone } from '../../types';
import { generateId } from '../../lib/utils';

interface Step2ImageCaptureProps {
  zones: FarmZone[];
  onZonesChange: (zones: FarmZone[]) => void;
  onNext: () => void;
}

export default function Step2ImageCapture({
  zones,
  onZonesChange,
  onNext,
}: Step2ImageCaptureProps) {
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const zone: FarmZone = {
        id: generateId(),
        imageUri: result.assets[0].uri,
        polygons: [],
        imageWidth: result.assets[0].width || 1000,
        imageHeight: result.assets[0].height || 750,
      };
      onZonesChange([zone]); // Enforce only 1 image
      setTimeout(onNext, 150); // Auto-advance to draw polygons
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const zone: FarmZone = {
        id: generateId(),
        imageUri: result.assets[0].uri,
        polygons: [],
        imageWidth: result.assets[0].width || 1000,
        imageHeight: result.assets[0].height || 750,
      };
      onZonesChange([zone]); // Enforce only 1 image
      setTimeout(onNext, 150); // Auto-advance to draw polygons
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 2: Capture Farm Image</Text>
      <Text style={styles.subtitle}>
        Take a photo or upload an image of your garden layout.
      </Text>

      {zones.length > 0 ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: zones[0].imageUri }}
            style={styles.mainPreview}
            resizeMode="cover"
          />
          <View style={styles.previewControls}>
            <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={handleTakePhoto}>
              <Text style={styles.buttonText}>📷 Retake Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={handlePickImage}>
              <Text style={styles.buttonText}>🖼️ Replace Image</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.proceedButton]} onPress={onNext}>
            <Text style={styles.proceedButtonText}>Proceed to Draw Zones →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.captureBox}>
          <TouchableOpacity style={styles.bigButton} onPress={handleTakePhoto}>
            <Text style={styles.bigButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bigButton, styles.uploadButton]} onPress={handlePickImage}>
            <Text style={styles.bigButtonText}>🖼️ Upload Image</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 24,
    lineHeight: 20,
  },
  captureBox: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 40,
  },
  bigButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadButton: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
  },
  bigButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  mainPreview: {
    width: '100%',
    height: Dimensions.get('window').width * 0.7,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  previewControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  proceedButton: {
    backgroundColor: '#059669',
    width: '100%',
  },
  proceedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

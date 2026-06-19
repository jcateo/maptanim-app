import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Step1PlantingDateProps {
  value?: string;
  onChange: (date: string) => void;
}

export default function Step1PlantingDate({ value, onChange }: Step1PlantingDateProps) {
  const [date, setDate] = React.useState(value ? new Date(value) : new Date());
  const [showPicker, setShowPicker] = React.useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate.toISOString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 1: When will you plant?</Text>
      <Text style={styles.subtitle}>Select your planting date</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          📅 {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          The planting date helps us calculate harvest time and monitor your farm's progress.
        </Text>
      </View>
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
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
  },
  info: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  infoText: {
    color: '#047857',
    fontSize: 14,
    lineHeight: 20,
  },
});

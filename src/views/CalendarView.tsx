import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CalendarView() {
  const insets = useSafeAreaInsets();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(selectedMonth);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farm Calendar</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthName}>{monthName}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekLabels}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.weekLabel}>
              <Text style={styles.weekLabelText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {emptyDays.map(i => (
            <View key={`empty-${i}`} style={styles.emptyDay} />
          ))}
          {days.map(day => (
            <TouchableOpacity key={day} style={styles.calendarDay}>
              <Text style={styles.dayNumber}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>Upcoming Events</Text>
          <View style={styles.eventCard}>
            <Text style={styles.eventDate}>Today</Text>
            <Text style={styles.eventText}>Check soil moisture in all zones</Text>
          </View>
          <View style={styles.eventCard}>
            <Text style={styles.eventDate}>In 3 days</Text>
            <Text style={styles.eventText}>Fertilizer application due</Text>
          </View>
          <View style={styles.eventCard}>
            <Text style={styles.eventDate}>In 10 days</Text>
            <Text style={styles.eventText}>Estimated harvest for Zone 1</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  monthName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  weekLabels: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyDay: {
    width: '14.28%',
    height: 50,
  },
  calendarDay: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginVertical: 2,
    marginHorizontal: 1,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  eventsSection: {
    marginBottom: 24,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  eventDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  eventText: {
    fontSize: 13,
    color: '#6b7280',
  },
});

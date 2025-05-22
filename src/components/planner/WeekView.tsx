import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { 
  getWeekDates, 
  formatShortDate, 
  formatDateRange,
  getStartOfWeek,
  getEndOfWeek,
} from '../../utils/plannerUtils';

interface WeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onWeekChange: (startDate: Date, endDate: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ 
  selectedDate, 
  onDateChange,
  onWeekChange,
}) => {
  const theme = useTheme();
  
  // Get dates for the current week
  const weekDates = getWeekDates(selectedDate);
  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = getEndOfWeek(selectedDate);
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newStartDate = new Date(startOfWeek);
    newStartDate.setDate(newStartDate.getDate() - 7);
    const newEndDate = new Date(endOfWeek);
    newEndDate.setDate(newEndDate.getDate() - 7);
    
    onWeekChange(newStartDate, newEndDate);
    onDateChange(newStartDate);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    const newStartDate = new Date(startOfWeek);
    newStartDate.setDate(newStartDate.getDate() + 7);
    const newEndDate = new Date(endOfWeek);
    newEndDate.setDate(newEndDate.getDate() + 7);
    
    onWeekChange(newStartDate, newEndDate);
    onDateChange(newStartDate);
  };
  
  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Check if a date is selected
  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={goToPreviousWeek}
          style={styles.navigationButton}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={theme.colors.onSurface} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.weekTitle, { color: theme.colors.onSurface }]}>
          {formatDateRange(startOfWeek, endOfWeek)}
        </Text>
        
        <TouchableOpacity 
          onPress={goToNextWeek}
          style={styles.navigationButton}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={theme.colors.onSurface} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {weekDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayItem,
              isSelected(date) && { 
                backgroundColor: theme.colors.primaryContainer 
              },
            ]}
            onPress={() => onDateChange(date)}
          >
            <Text 
              style={[
                styles.dayName,
                isToday(date) && styles.todayText,
                isSelected(date) && { color: theme.colors.primary },
                { color: theme.colors.onSurface }
              ]}
            >
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text 
              style={[
                styles.dayNumber,
                isToday(date) && styles.todayText,
                isSelected(date) && { color: theme.colors.primary },
                { color: theme.colors.onSurface }
              ]}
            >
              {date.getDate()}
            </Text>
            {isToday(date) && (
              <View 
                style={[
                  styles.todayIndicator,
                  { backgroundColor: theme.colors.primary }
                ]} 
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButton: {
    padding: 8,
  },
  daysContainer: {
    paddingHorizontal: 8,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    minWidth: 60,
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayText: {
    fontWeight: 'bold',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
});

export default WeekView;

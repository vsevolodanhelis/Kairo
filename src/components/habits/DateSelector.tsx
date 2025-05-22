import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  onDateChange 
}) => {
  const theme = useTheme();
  
  // Generate dates for the week (3 days before, today, 3 days after)
  const dates = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      result.push(date);
    }
    return result;
  }, []);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Format day for display
  const formatDay = (date: Date): string => {
    return date.getDate().toString();
  };
  
  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={goToPreviousDay}
        style={styles.navigationButton}
      >
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={theme.colors.onSurface} 
        />
      </TouchableOpacity>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
      >
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateItem,
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
              {formatDate(date)}
            </Text>
            <Text 
              style={[
                styles.dayNumber,
                isToday(date) && styles.todayText,
                isSelected(date) && { color: theme.colors.primary },
                { color: theme.colors.onSurface }
              ]}
            >
              {formatDay(date)}
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
      
      <TouchableOpacity 
        onPress={goToNextDay}
        style={styles.navigationButton}
      >
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={theme.colors.onSurface} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navigationButton: {
    padding: 8,
  },
  datesContainer: {
    paddingHorizontal: 8,
  },
  dateItem: {
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

export default DateSelector;

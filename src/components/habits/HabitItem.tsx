import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, useTheme, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../../types/habit';
import { 
  calculateStreak, 
  calculateCompletionRate, 
  getCompletionStatus 
} from '../../utils/habitUtils';
import GlassContainer from '../common/GlassContainer';

interface HabitItemProps {
  habit: Habit;
  onPress: (habit: Habit) => void;
  onToggleCompletion: (habit: Habit, completed: boolean) => void;
  date: Date;
}

const HabitItem: React.FC<HabitItemProps> = ({ 
  habit, 
  onPress, 
  onToggleCompletion,
  date 
}) => {
  const theme = useTheme();
  
  // Get completion status for the current date
  const { completed } = getCompletionStatus(habit, date);
  
  // Calculate streak and completion rate
  const streak = calculateStreak(habit);
  const completionRate = calculateCompletionRate(habit);
  
  // Get habit color or use default
  const habitColor = habit.color || theme.colors.primary;
  
  return (
    <TouchableOpacity onPress={() => onPress(habit)}>
      <GlassContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Checkbox
              status={completed ? 'checked' : 'unchecked'}
              onPress={() => onToggleCompletion(habit, !completed)}
              color={habitColor}
            />
            <Text 
              style={[
                styles.title, 
                { color: theme.colors.onSurface }
              ]}
              numberOfLines={1}
            >
              {habit.title}
            </Text>
          </View>
          <View 
            style={[
              styles.colorIndicator, 
              { backgroundColor: habitColor }
            ]} 
          />
        </View>
        
        {habit.description && (
          <Text 
            style={[
              styles.description, 
              { color: theme.colors.onSurfaceVariant }
            ]}
            numberOfLines={2}
          >
            {habit.description}
          </Text>
        )}
        
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={completionRate / 100} 
            color={habitColor}
            style={styles.progressBar}
          />
          <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
            {completionRate.toFixed(0)}%
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.streakContainer}>
            <Ionicons 
              name="flame" 
              size={16} 
              color={streak > 0 ? '#FF9500' : theme.colors.onSurfaceVariant} 
            />
            <Text 
              style={[
                styles.streakText, 
                { 
                  color: streak > 0 
                    ? '#FF9500' 
                    : theme.colors.onSurfaceVariant 
                }
              ]}
            >
              {streak} day{streak !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.frequencyContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={14} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text 
              style={[
                styles.frequencyText, 
                { color: theme.colors.onSurfaceVariant }
              ]}
            >
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </Text>
          </View>
        </View>
      </GlassContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 36,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    marginLeft: 8,
    width: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 36,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default HabitItem;

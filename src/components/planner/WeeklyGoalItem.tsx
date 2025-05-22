import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, useTheme } from 'react-native-paper';
import { WeeklyGoal } from '../../types/planner';
import GlassContainer from '../common/GlassContainer';

interface WeeklyGoalItemProps {
  goal: WeeklyGoal;
  onPress: (goal: WeeklyGoal) => void;
  onToggleCompletion: (goal: WeeklyGoal, completed: boolean) => void;
}

const WeeklyGoalItem: React.FC<WeeklyGoalItemProps> = ({ 
  goal, 
  onPress, 
  onToggleCompletion 
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={() => onPress(goal)}>
      <GlassContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Checkbox
              status={goal.completed ? 'checked' : 'unchecked'}
              onPress={() => onToggleCompletion(goal, !goal.completed)}
              color={theme.colors.primary}
            />
            <Text 
              style={[
                styles.title, 
                goal.completed && styles.completedText,
                { color: theme.colors.onSurface }
              ]}
              numberOfLines={1}
            >
              {goal.title}
            </Text>
          </View>
        </View>
        
        {goal.description && (
          <Text 
            style={[
              styles.description, 
              goal.completed && styles.completedText,
              { color: theme.colors.onSurfaceVariant }
            ]}
            numberOfLines={2}
          >
            {goal.description}
          </Text>
        )}
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
    marginBottom: 4,
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
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    marginLeft: 36,
  },
});

export default WeeklyGoalItem;

import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Habit } from '../../types/habit';
import HabitItem from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  onHabitPress: (habit: Habit) => void;
  onToggleCompletion: (habit: Habit, completed: boolean) => void;
  date: Date;
  showArchived?: boolean;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  onHabitPress, 
  onToggleCompletion,
  date,
  showArchived = false,
}) => {
  const theme = useTheme();
  
  // Filter habits based on archived status
  const filteredHabits = habits.filter(habit => habit.archived === showArchived);

  if (filteredHabits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          {showArchived 
            ? 'No archived habits found.' 
            : 'No habits found. Add a new habit to get started!'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredHabits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitItem
          habit={item}
          onPress={onHabitPress}
          onToggleCompletion={onToggleCompletion}
          date={date}
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HabitList;

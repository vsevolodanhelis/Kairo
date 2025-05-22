import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FAB,
  Portal,
  Modal,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  addHabit,
  updateHabit,
  deleteHabit,
  archiveHabit,
  unarchiveHabit,
  toggleHabitCompletion,
} from '../../store/slices/habitsSlice';
import { Habit } from '../../types/habit';
import HabitList from '../../components/habits/HabitList';
import HabitForm from '../../components/habits/HabitForm';
import DateSelector from '../../components/habits/DateSelector';

const HabitsScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { habits } = useSelector((state: RootState) => state.habits);

  // State for selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);

  // State for view mode (active or archived)
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

  // Handle habit press
  const handleHabitPress = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  // Handle toggle habit completion
  const handleToggleCompletion = (habit: Habit, completed: boolean) => {
    dispatch(toggleHabitCompletion({
      habitId: habit.id,
      date: selectedDate.toISOString(),
      completed,
    }));
  };

  // Handle save habit
  const handleSaveHabit = (habit: Habit) => {
    if (selectedHabit) {
      dispatch(updateHabit(habit));
    } else {
      dispatch(addHabit(habit));
    }
    setModalVisible(false);
    setSelectedHabit(undefined);
  };

  // Handle cancel
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedHabit(undefined);
  };

  // Handle add new habit
  const handleAddHabit = () => {
    setSelectedHabit(undefined);
    setModalVisible(true);
  };

  // Handle delete habit
  const handleDeleteHabit = (habitId: string) => {
    dispatch(deleteHabit(habitId));
    setModalVisible(false);
    setSelectedHabit(undefined);
  };

  // Handle archive habit
  const handleArchiveHabit = (habitId: string) => {
    dispatch(archiveHabit(habitId));
    setModalVisible(false);
    setSelectedHabit(undefined);
  };

  // Handle unarchive habit
  const handleUnarchiveHabit = (habitId: string) => {
    dispatch(unarchiveHabit(habitId));
    setModalVisible(false);
    setSelectedHabit(undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'active' | 'archived')}
          buttons={[
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <HabitList
        habits={habits}
        onHabitPress={handleHabitPress}
        onToggleCompletion={handleToggleCompletion}
        date={selectedDate}
        showArchived={viewMode === 'archived'}
      />

      {viewMode === 'active' && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddHabit}
          color={theme.colors.onPrimary}
        />
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCancel}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background }
          ]}
        >
          <HabitForm
            habit={selectedHabit}
            onSave={handleSaveHabit}
            onCancel={handleCancel}
            onDelete={handleDeleteHabit}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
  },
  segmentedButtons: {
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
});

export default HabitsScreen;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit, HabitCompletion } from '../../types/habit';

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    // Add a new habit
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
    },
    
    // Update an existing habit
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.habits.findIndex(habit => habit.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    
    // Delete a habit
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
    },
    
    // Archive a habit
    archiveHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(habit => habit.id === action.payload);
      if (habit) {
        habit.archived = true;
        habit.updatedAt = new Date().toISOString();
      }
    },
    
    // Unarchive a habit
    unarchiveHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(habit => habit.id === action.payload);
      if (habit) {
        habit.archived = false;
        habit.updatedAt = new Date().toISOString();
      }
    },
    
    // Toggle habit completion for a specific date
    toggleHabitCompletion: (
      state, 
      action: PayloadAction<{ 
        habitId: string; 
        date: string; 
        completed: boolean;
        note?: string;
      }>
    ) => {
      const { habitId, date, completed, note } = action.payload;
      const habit = state.habits.find(habit => habit.id === habitId);
      
      if (habit) {
        // Check if there's already a completion for this date
        const existingIndex = habit.completions.findIndex(
          completion => completion.date.split('T')[0] === date.split('T')[0]
        );
        
        if (existingIndex !== -1) {
          // Update existing completion
          habit.completions[existingIndex] = {
            date,
            completed,
            note,
          };
        } else {
          // Add new completion
          habit.completions.push({
            date,
            completed,
            note,
          });
        }
        
        habit.updatedAt = new Date().toISOString();
      }
    },
    
    // Set all habits (used when loading from storage)
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
  },
});

export const { 
  addHabit, 
  updateHabit, 
  deleteHabit, 
  archiveHabit,
  unarchiveHabit,
  toggleHabitCompletion,
  setHabits 
} = habitsSlice.actions;

export default habitsSlice.reducer;

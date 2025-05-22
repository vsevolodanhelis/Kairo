import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, TimeBlock, WeeklyGoal, Note } from '../../types/planner';

interface PlannerState {
  events: Event[];
  timeBlocks: TimeBlock[];
  weeklyGoals: WeeklyGoal[];
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: PlannerState = {
  events: [],
  timeBlocks: [],
  weeklyGoals: [],
  notes: [],
  loading: false,
  error: null,
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    // Events
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    
    // Time Blocks
    addTimeBlock: (state, action: PayloadAction<TimeBlock>) => {
      state.timeBlocks.push(action.payload);
    },
    updateTimeBlock: (state, action: PayloadAction<TimeBlock>) => {
      const index = state.timeBlocks.findIndex(block => block.id === action.payload.id);
      if (index !== -1) {
        state.timeBlocks[index] = action.payload;
      }
    },
    deleteTimeBlock: (state, action: PayloadAction<string>) => {
      state.timeBlocks = state.timeBlocks.filter(block => block.id !== action.payload);
    },
    setTimeBlocks: (state, action: PayloadAction<TimeBlock[]>) => {
      state.timeBlocks = action.payload;
    },
    
    // Weekly Goals
    addWeeklyGoal: (state, action: PayloadAction<WeeklyGoal>) => {
      state.weeklyGoals.push(action.payload);
    },
    updateWeeklyGoal: (state, action: PayloadAction<WeeklyGoal>) => {
      const index = state.weeklyGoals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        state.weeklyGoals[index] = action.payload;
      }
    },
    deleteWeeklyGoal: (state, action: PayloadAction<string>) => {
      state.weeklyGoals = state.weeklyGoals.filter(goal => goal.id !== action.payload);
    },
    toggleWeeklyGoalCompletion: (
      state, 
      action: PayloadAction<{ id: string; completed: boolean }>
    ) => {
      const { id, completed } = action.payload;
      const goal = state.weeklyGoals.find(goal => goal.id === id);
      if (goal) {
        goal.completed = completed;
        goal.updatedAt = new Date().toISOString();
        
        if (completed) {
          goal.completedAt = new Date().toISOString();
        } else {
          goal.completedAt = undefined;
        }
      }
    },
    setWeeklyGoals: (state, action: PayloadAction<WeeklyGoal[]>) => {
      state.weeklyGoals = action.payload;
    },
    
    // Notes
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
  },
});

export const { 
  addEvent, 
  updateEvent, 
  deleteEvent, 
  setEvents,
  addTimeBlock,
  updateTimeBlock,
  deleteTimeBlock,
  setTimeBlocks,
  addWeeklyGoal,
  updateWeeklyGoal,
  deleteWeeklyGoal,
  toggleWeeklyGoalCompletion,
  setWeeklyGoals,
  addNote,
  updateNote,
  deleteNote,
  setNotes,
} = plannerSlice.actions;

export default plannerSlice.reducer;

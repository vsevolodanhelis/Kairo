import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, TaskPriority } from '../../types/task';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    
    // Update an existing task
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    
    // Delete a task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    
    // Update task status
    updateTaskStatus: (
      state, 
      action: PayloadAction<{ id: string; status: TaskStatus }>
    ) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
        
        if (status === TaskStatus.COMPLETED) {
          task.completedAt = new Date().toISOString();
        } else {
          task.completedAt = undefined;
        }
      }
    },
    
    // Set all tasks (used when loading from storage)
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus, 
  setTasks 
} = tasksSlice.actions;

export default tasksSlice.reducer;

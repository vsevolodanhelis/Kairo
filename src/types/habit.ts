export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export interface HabitCompletion {
  date: string; // ISO date string
  completed: boolean;
  note?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  // For custom frequency, specify days of week (0-6, where 0 is Sunday)
  customDays?: number[];
  // Target number of times to complete the habit
  target: number;
  // Color for the habit (hex code)
  color?: string;
  // Start date of the habit
  startDate: string; // ISO date string
  // End date of the habit (optional)
  endDate?: string; // ISO date string
  // Reminder time (optional)
  reminderTime?: string; // ISO date string (only time part is used)
  // History of completions
  completions: HabitCompletion[];
  // Creation and update timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Whether the habit is archived
  archived: boolean;
}

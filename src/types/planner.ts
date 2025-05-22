export enum EventType {
  MEETING = 'meeting',
  APPOINTMENT = 'appointment',
  TASK = 'task',
  REMINDER = 'reminder',
  OTHER = 'other',
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  type: EventType;
  location?: string;
  isAllDay: boolean;
  color?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TimeBlock {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  color?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  weekStartDate: string; // ISO date string (start of the week)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  completedAt?: string; // ISO date string
}

export interface Note {
  id: string;
  content: string;
  date: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

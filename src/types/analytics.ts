export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface HabitStats {
  total: number;
  active: number;
  archived: number;
  streaks: {
    current: number;
    longest: number;
  };
  completionRate: number;
  mostConsistent: string; // habit id
  leastConsistent: string; // habit id
}

export interface TimeStats {
  totalTimeBlocks: number;
  totalHours: number;
  averageBlockLength: number; // in minutes
  mostProductiveDay: string; // day of week
  mostProductiveTime: string; // time of day
}

export interface GoalStats {
  total: number;
  completed: number;
  completionRate: number;
}

export interface AnalyticsState {
  taskStats: TaskStats;
  habitStats: HabitStats;
  timeStats: TimeStats;
  goalStats: GoalStats;
  lastUpdated: string; // ISO date string
}

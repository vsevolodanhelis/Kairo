import { Task, TaskStatus, TaskPriority } from '../types/task';
import { Habit } from '../types/habit';
import { TimeBlock, WeeklyGoal } from '../types/planner';
import { 
  TaskStats, 
  HabitStats, 
  TimeStats, 
  GoalStats, 
  AnalyticsState 
} from '../types/analytics';
import { calculateStreak, calculateCompletionRate } from '../utils/habitUtils';

// Calculate task statistics
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const inProgress = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todo = tasks.filter(task => task.status === TaskStatus.TODO).length;
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  // Calculate average completion time
  let totalCompletionTime = 0;
  let completedWithTime = 0;
  
  tasks.forEach(task => {
    if (task.status === TaskStatus.COMPLETED && task.completedAt && task.createdAt) {
      const createdDate = new Date(task.createdAt).getTime();
      const completedDate = new Date(task.completedAt).getTime();
      const completionTime = (completedDate - createdDate) / (1000 * 60 * 60); // in hours
      
      totalCompletionTime += completionTime;
      completedWithTime++;
    }
  });
  
  const averageCompletionTime = completedWithTime > 0 
    ? totalCompletionTime / completedWithTime 
    : 0;
  
  // Count tasks by priority
  const highPriority = tasks.filter(task => task.priority === TaskPriority.HIGH).length;
  const mediumPriority = tasks.filter(task => task.priority === TaskPriority.MEDIUM).length;
  const lowPriority = tasks.filter(task => task.priority === TaskPriority.LOW).length;
  
  return {
    total,
    completed,
    inProgress,
    todo,
    completionRate,
    averageCompletionTime,
    byPriority: {
      high: highPriority,
      medium: mediumPriority,
      low: lowPriority,
    },
  };
};

// Calculate habit statistics
export const calculateHabitStats = (habits: Habit[]): HabitStats => {
  const total = habits.length;
  const active = habits.filter(habit => !habit.archived).length;
  const archived = habits.filter(habit => habit.archived).length;
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  
  habits.forEach(habit => {
    const streak = calculateStreak(habit);
    currentStreak += streak;
    
    // Find longest streak from completion history
    if (habit.completions.length > 0) {
      const sortedCompletions = [...habit.completions]
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let currentStreakCount = 1;
      let maxStreakCount = 1;
      
      for (let i = 1; i < sortedCompletions.length; i++) {
        const prevDate = new Date(sortedCompletions[i-1].date);
        const currDate = new Date(sortedCompletions[i].date);
        
        const diffDays = Math.round(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDays === 1) {
          currentStreakCount++;
          maxStreakCount = Math.max(maxStreakCount, currentStreakCount);
        } else {
          currentStreakCount = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, maxStreakCount);
    }
  });
  
  // Calculate average completion rate
  let totalCompletionRate = 0;
  habits.forEach(habit => {
    totalCompletionRate += calculateCompletionRate(habit);
  });
  
  const completionRate = total > 0 ? totalCompletionRate / total : 0;
  
  // Find most and least consistent habits
  let mostConsistentId = '';
  let leastConsistentId = '';
  let highestRate = 0;
  let lowestRate = 100;
  
  habits.forEach(habit => {
    const rate = calculateCompletionRate(habit);
    
    if (rate > highestRate) {
      highestRate = rate;
      mostConsistentId = habit.id;
    }
    
    if (rate < lowestRate && habit.completions.length > 0) {
      lowestRate = rate;
      leastConsistentId = habit.id;
    }
  });
  
  return {
    total,
    active,
    archived,
    streaks: {
      current: Math.round(currentStreak / (total || 1)), // average current streak
      longest: longestStreak,
    },
    completionRate,
    mostConsistent: mostConsistentId,
    leastConsistent: leastConsistentId,
  };
};

// Calculate time statistics
export const calculateTimeStats = (timeBlocks: TimeBlock[]): TimeStats => {
  const totalTimeBlocks = timeBlocks.length;
  
  // Calculate total hours and average block length
  let totalMinutes = 0;
  
  timeBlocks.forEach(block => {
    const startTime = new Date(block.startTime).getTime();
    const endTime = new Date(block.endTime).getTime();
    const durationMinutes = (endTime - startTime) / (1000 * 60);
    
    totalMinutes += durationMinutes;
  });
  
  const totalHours = totalMinutes / 60;
  const averageBlockLength = totalTimeBlocks > 0 ? totalMinutes / totalTimeBlocks : 0;
  
  // Find most productive day and time
  const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  const hourCount = Array(24).fill(0);
  
  timeBlocks.forEach(block => {
    const date = new Date(block.startTime);
    const day = date.getDay();
    const hour = date.getHours();
    
    dayCount[day]++;
    hourCount[hour]++;
  });
  
  // Find the day with the most time blocks
  const mostProductiveDayIndex = dayCount.indexOf(Math.max(...dayCount));
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mostProductiveDay = days[mostProductiveDayIndex];
  
  // Find the hour with the most time blocks
  const mostProductiveHourIndex = hourCount.indexOf(Math.max(...hourCount));
  const mostProductiveTime = `${mostProductiveHourIndex}:00 - ${mostProductiveHourIndex + 1}:00`;
  
  return {
    totalTimeBlocks,
    totalHours,
    averageBlockLength,
    mostProductiveDay,
    mostProductiveTime,
  };
};

// Calculate goal statistics
export const calculateGoalStats = (goals: WeeklyGoal[]): GoalStats => {
  const total = goals.length;
  const completed = goals.filter(goal => goal.completed).length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    total,
    completed,
    completionRate,
  };
};

// Calculate all analytics
export const calculateAnalytics = (
  tasks: Task[],
  habits: Habit[],
  timeBlocks: TimeBlock[],
  goals: WeeklyGoal[]
): AnalyticsState => {
  return {
    taskStats: calculateTaskStats(tasks),
    habitStats: calculateHabitStats(habits),
    timeStats: calculateTimeStats(timeBlocks),
    goalStats: calculateGoalStats(goals),
    lastUpdated: new Date().toISOString(),
  };
};

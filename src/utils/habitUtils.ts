import { Habit, HabitFrequency } from '../types/habit';

// Get the days of the week as strings
export const getDaysOfWeek = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

// Check if a habit should be completed on a specific date
export const shouldCompleteOnDate = (habit: Habit, date: Date): boolean => {
  const habitStartDate = new Date(habit.startDate);
  habitStartDate.setHours(0, 0, 0, 0);
  
  // If the habit hasn't started yet, return false
  if (date < habitStartDate) {
    return false;
  }
  
  // If the habit has ended, return false
  if (habit.endDate) {
    const habitEndDate = new Date(habit.endDate);
    habitEndDate.setHours(23, 59, 59, 999);
    if (date > habitEndDate) {
      return false;
    }
  }
  
  const dayOfWeek = date.getDay(); // 0-6, where 0 is Sunday
  const dayOfMonth = date.getDate(); // 1-31
  
  switch (habit.frequency) {
    case HabitFrequency.DAILY:
      return true;
    
    case HabitFrequency.WEEKLY:
      // Check if the current day is the same day of the week as the start date
      return dayOfWeek === habitStartDate.getDay();
    
    case HabitFrequency.MONTHLY:
      // Check if the current day is the same day of the month as the start date
      return dayOfMonth === habitStartDate.getDate();
    
    case HabitFrequency.CUSTOM:
      // Check if the current day of the week is in the custom days array
      return habit.customDays?.includes(dayOfWeek) || false;
    
    default:
      return false;
  }
};

// Get the completion status for a habit on a specific date
export const getCompletionStatus = (
  habit: Habit, 
  date: Date
): { completed: boolean; note?: string } => {
  const dateString = date.toISOString().split('T')[0];
  
  const completion = habit.completions.find(
    c => c.date.split('T')[0] === dateString
  );
  
  if (completion) {
    return {
      completed: completion.completed,
      note: completion.note,
    };
  }
  
  return {
    completed: false,
  };
};

// Calculate the streak for a habit
export const calculateStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) {
    return 0;
  }
  
  // Sort completions by date (newest first)
  const sortedCompletions = [...habit.completions]
    .filter(c => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedCompletions.length === 0) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = new Date(sortedCompletions[0].date);
  currentDate.setHours(0, 0, 0, 0);
  
  // Check if the most recent completion is today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (currentDate.getTime() !== today.getTime() && 
      currentDate.getTime() !== yesterday.getTime()) {
    // The streak is broken if the most recent completion is not today or yesterday
    return 0;
  }
  
  // Calculate streak by checking consecutive days
  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    const completionDate = new Date(sortedCompletions[i].date);
    completionDate.setHours(0, 0, 0, 0);
    
    if (completionDate.getTime() === prevDate.getTime()) {
      streak++;
      currentDate = completionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate the completion rate for a habit
export const calculateCompletionRate = (habit: Habit): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(habit.startDate);
  startDate.setHours(0, 0, 0, 0);
  
  // If the habit hasn't started yet, return 0
  if (today < startDate) {
    return 0;
  }
  
  let totalDays = 0;
  let completedDays = 0;
  
  // Calculate the number of days since the habit started
  const currentDate = new Date(startDate);
  while (currentDate <= today) {
    if (shouldCompleteOnDate(habit, currentDate)) {
      totalDays++;
      
      const dateString = currentDate.toISOString().split('T')[0];
      const completion = habit.completions.find(
        c => c.date.split('T')[0] === dateString && c.completed
      );
      
      if (completion) {
        completedDays++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
};

import { Event, TimeBlock, WeeklyGoal } from '../types/planner';

// Get the start of the week (Sunday) for a given date
export const getStartOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay(); // 0-6, where 0 is Sunday
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get the end of the week (Saturday) for a given date
export const getEndOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay(); // 0-6, where 0 is Sunday
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
};

// Get an array of dates for a week
export const getWeekDates = (date: Date): Date[] => {
  const startOfWeek = getStartOfWeek(date);
  const result = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    result.push(day);
  }
  
  return result;
};

// Format date as "Mon, Jan 1"
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Format time as "1:00 PM"
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date range as "Jan 1 - Jan 7, 2023"
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  
  const startFormat = {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  };
  
  const endFormat = {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  const start = startDate.toLocaleDateString('en-US', startFormat as any);
  const end = endDate.toLocaleDateString('en-US', endFormat as any);
  
  return `${start} - ${end}`;
};

// Get events for a specific date
export const getEventsForDate = (events: Event[], date: Date): Event[] => {
  const dateString = date.toISOString().split('T')[0];
  
  return events.filter(event => {
    const eventStartDate = new Date(event.startTime);
    const eventStartDateString = eventStartDate.toISOString().split('T')[0];
    
    if (event.endTime) {
      const eventEndDate = new Date(event.endTime);
      const eventEndDateString = eventEndDate.toISOString().split('T')[0];
      
      // Check if the date is between start and end dates
      return dateString >= eventStartDateString && dateString <= eventEndDateString;
    }
    
    // If no end time, check if the date matches the start date
    return dateString === eventStartDateString;
  });
};

// Get time blocks for a specific date
export const getTimeBlocksForDate = (timeBlocks: TimeBlock[], date: Date): TimeBlock[] => {
  const dateString = date.toISOString().split('T')[0];
  
  return timeBlocks.filter(block => {
    const blockStartDate = new Date(block.startTime);
    const blockStartDateString = blockStartDate.toISOString().split('T')[0];
    
    return dateString === blockStartDateString;
  });
};

// Get weekly goals for a specific week
export const getWeeklyGoalsForWeek = (weeklyGoals: WeeklyGoal[], date: Date): WeeklyGoal[] => {
  const startOfWeek = getStartOfWeek(date);
  const startOfWeekString = startOfWeek.toISOString().split('T')[0];
  
  return weeklyGoals.filter(goal => {
    const goalWeekStart = new Date(goal.weekStartDate);
    const goalWeekStartString = goalWeekStart.toISOString().split('T')[0];
    
    return startOfWeekString === goalWeekStartString;
  });
};

// Check if two time ranges overlap
export const doTimeRangesOverlap = (
  start1: string, 
  end1: string, 
  start2: string, 
  end2: string
): boolean => {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  
  return (s1 < e2 && e1 > s2);
};

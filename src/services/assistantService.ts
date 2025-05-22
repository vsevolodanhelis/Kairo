import { MessageRole } from '../types/assistant';

// This is a mock service for the AI assistant
// In a real app, this would connect to an AI service like OpenAI's API

// Sample responses for different user queries
const sampleResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm Kairo, your productivity assistant. How can I help you today?",
    "Hi there! I'm here to help you stay productive. What can I assist you with?",
    "Greetings! I'm your Kairo assistant. How can I make your day more productive?",
  ],
  task: [
    "I can help you manage your tasks. Would you like me to help you create a new task, prioritize existing ones, or suggest a task to work on next?",
    "Task management is one of my specialties. I can help you break down complex tasks, set deadlines, or organize your task list.",
    "For effective task management, consider using the Eisenhower Matrix to categorize tasks by urgency and importance. Would you like me to explain how it works?",
  ],
  habit: [
    "Building good habits is key to long-term productivity. What habit are you trying to develop or maintain?",
    "Habits are formed through consistent repetition. The key is to start small and build up gradually. What habit are you working on?",
    "For habit building, I recommend the 'habit stacking' technique - attaching a new habit to an existing one. Would you like some examples?",
  ],
  time: [
    "Time management is essential for productivity. Have you tried techniques like the Pomodoro method or time blocking?",
    "To manage your time effectively, consider identifying your most productive hours and scheduling important tasks during those times.",
    "One effective time management strategy is to plan your day the night before, so you can hit the ground running in the morning.",
  ],
  focus: [
    "Improving focus can significantly boost productivity. Try minimizing distractions, taking regular breaks, and practicing mindfulness.",
    "For better focus, consider the 5-minute rule: commit to just 5 minutes of work on a task, and often you'll find yourself continuing beyond that.",
    "Deep work requires eliminating distractions. Consider setting aside specific times for focused work, and communicate to others that you shouldn't be interrupted during these periods.",
  ],
  motivation: [
    "Staying motivated can be challenging. Try setting clear, achievable goals and celebrating small wins along the way.",
    "Motivation often follows action rather than preceding it. Sometimes the best approach is to just start, even if you don't feel motivated initially.",
    "Consider finding an accountability partner or joining a community with similar goals to stay motivated and committed.",
  ],
  default: [
    "I'm here to help with your productivity needs. Could you provide more details about what you're looking for?",
    "I can assist with task management, habit building, time management, and more. What specific area would you like help with?",
    "As your productivity assistant, I'm ready to help you achieve your goals. What would you like to focus on today?",
  ],
};

// Function to get a response based on the user's message
const getResponseForMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hey') ||
    lowerMessage.includes('greetings')
  ) {
    return getRandomResponse('greeting');
  }
  
  // Check for task-related queries
  if (
    lowerMessage.includes('task') ||
    lowerMessage.includes('todo') ||
    lowerMessage.includes('to-do') ||
    lowerMessage.includes('to do')
  ) {
    return getRandomResponse('task');
  }
  
  // Check for habit-related queries
  if (
    lowerMessage.includes('habit') ||
    lowerMessage.includes('routine') ||
    lowerMessage.includes('daily')
  ) {
    return getRandomResponse('habit');
  }
  
  // Check for time-related queries
  if (
    lowerMessage.includes('time') ||
    lowerMessage.includes('schedule') ||
    lowerMessage.includes('planning') ||
    lowerMessage.includes('calendar')
  ) {
    return getRandomResponse('time');
  }
  
  // Check for focus-related queries
  if (
    lowerMessage.includes('focus') ||
    lowerMessage.includes('concentrate') ||
    lowerMessage.includes('distraction') ||
    lowerMessage.includes('attention')
  ) {
    return getRandomResponse('focus');
  }
  
  // Check for motivation-related queries
  if (
    lowerMessage.includes('motivate') ||
    lowerMessage.includes('motivation') ||
    lowerMessage.includes('inspired') ||
    lowerMessage.includes('procrastinate')
  ) {
    return getRandomResponse('motivation');
  }
  
  // Default response
  return getRandomResponse('default');
};

// Helper function to get a random response from a category
const getRandomResponse = (category: string): string => {
  const responses = sampleResponses[category] || sampleResponses.default;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Simulate API call with a delay
const simulateApiCall = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getResponseForMessage(message));
    }, 1000); // Simulate a 1-second delay
  });
};

// Export the service functions
export const assistantService = {
  // Send a message to the assistant and get a response
  sendMessage: async (message: string): Promise<string> => {
    try {
      return await simulateApiCall(message);
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      return 'Sorry, I encountered an error processing your request. Please try again.';
    }
  },
  
  // Generate a title for a new conversation based on the first message
  generateTitle: (message: string): string => {
    // Use the first few words of the message as the title
    const words = message.split(' ');
    const titleWords = words.slice(0, 3);
    let title = titleWords.join(' ');
    
    // Add ellipsis if the message is longer than 3 words
    if (words.length > 3) {
      title += '...';
    }
    
    return title;
  },
};

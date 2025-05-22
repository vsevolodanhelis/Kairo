import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssistantState, Conversation, Message, MessageRole } from '../../types/assistant';
import { generateId } from '../../utils/idUtils';

const initialState: AssistantState = {
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  error: null,
};

const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    // Create a new conversation
    createConversation: (state, action: PayloadAction<{ title: string }>) => {
      const now = new Date().toISOString();
      const newConversation: Conversation = {
        id: generateId(),
        title: action.payload.title,
        messages: [
          {
            id: generateId(),
            role: MessageRole.SYSTEM,
            content: 'I am Kairo, your productivity assistant. How can I help you today?',
            timestamp: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };
      
      state.conversations.push(newConversation);
      state.activeConversationId = newConversation.id;
    },
    
    // Set active conversation
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    
    // Add message to conversation
    addMessage: (state, action: PayloadAction<{ 
      conversationId: string; 
      message: Omit<Message, 'id' | 'timestamp'>;
    }>) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const now = new Date().toISOString();
        const newMessage: Message = {
          id: generateId(),
          ...message,
          timestamp: now,
        };
        
        conversation.messages.push(newMessage);
        conversation.updatedAt = now;
      }
    },
    
    // Add assistant response
    addAssistantResponse: (state, action: PayloadAction<{
      conversationId: string;
      content: string;
    }>) => {
      const { conversationId, content } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const now = new Date().toISOString();
        const newMessage: Message = {
          id: generateId(),
          role: MessageRole.ASSISTANT,
          content,
          timestamp: now,
        };
        
        conversation.messages.push(newMessage);
        conversation.updatedAt = now;
      }
    },
    
    // Delete conversation
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = state.conversations.length > 0 
          ? state.conversations[0].id 
          : null;
      }
    },
    
    // Rename conversation
    renameConversation: (state, action: PayloadAction<{ 
      conversationId: string; 
      title: string;
    }>) => {
      const { conversationId, title } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.title = title;
        conversation.updatedAt = new Date().toISOString();
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Set conversations (used when loading from storage)
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
  },
});

export const { 
  createConversation, 
  setActiveConversation, 
  addMessage, 
  addAssistantResponse,
  deleteConversation,
  renameConversation,
  setLoading,
  setError,
  setConversations,
} = assistantSlice.actions;

export default assistantSlice.reducer;

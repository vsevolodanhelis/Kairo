import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  createConversation,
  setActiveConversation,
  addMessage,
  addAssistantResponse,
  deleteConversation,
  renameConversation,
  setLoading,
  setError,
} from '../../store/slices/assistantSlice';
import { MessageRole, Conversation, Message } from '../../types/assistant';
import { assistantService } from '../../services/assistantService';

import MessageItem from '../../components/assistant/MessageItem';
import ConversationList from '../../components/assistant/ConversationList';
import ChatInput from '../../components/assistant/ChatInput';
import RenameDialog from '../../components/assistant/RenameDialog';
import DeleteDialog from '../../components/assistant/DeleteDialog';
import GlassContainer from '../../components/common/GlassContainer';

const AssistantScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    conversations,
    activeConversationId,
    isLoading,
    error
  } = useSelector((state: RootState) => state.assistant);

  // Refs
  const flatListRef = useRef<FlatList>(null);

  // State for dialogs
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Get active conversation
  const activeConversation = activeConversationId
    ? conversations.find(c => c.id === activeConversationId)
    : null;

  // Get screen width to determine layout
  const screenWidth = Dimensions.get('window').width;
  const isWideScreen = screenWidth > 768;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (activeConversation?.messages.length && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [activeConversation?.messages.length]);

  // Handle send message
  const handleSendMessage = async (content: string) => {
    // If no active conversation, create a new one
    if (!activeConversationId) {
      const title = assistantService.generateTitle(content);
      dispatch(createConversation({ title }));

      // Wait for the conversation to be created
      setTimeout(() => {
        handleSendMessageToConversation(content);
      }, 100);
      return;
    }

    handleSendMessageToConversation(content);
  };

  // Handle send message to conversation
  const handleSendMessageToConversation = async (content: string) => {
    if (!activeConversationId) return;

    // Add user message
    dispatch(addMessage({
      conversationId: activeConversationId,
      message: {
        role: MessageRole.USER,
        content,
      },
    }));

    // Set loading state
    dispatch(setLoading(true));

    try {
      // Get response from assistant service
      const response = await assistantService.sendMessage(content);

      // Add assistant response
      dispatch(addAssistantResponse({
        conversationId: activeConversationId,
        content: response,
      }));

      // Clear error if any
      if (error) {
        dispatch(setError(null));
      }
    } catch (err) {
      // Set error
      dispatch(setError('Failed to get response from assistant'));
    } finally {
      // Clear loading state
      dispatch(setLoading(false));
    }
  };

  // Handle select conversation
  const handleSelectConversation = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
  };

  // Handle new conversation
  const handleNewConversation = () => {
    const title = 'New Conversation';
    dispatch(createConversation({ title }));
  };

  // Handle rename conversation
  const handleOpenRenameDialog = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsRenameDialogVisible(true);
  };

  const handleRenameConversation = (newTitle: string) => {
    if (selectedConversationId) {
      dispatch(renameConversation({
        conversationId: selectedConversationId,
        title: newTitle,
      }));
    }
  };

  // Handle delete conversation
  const handleOpenDeleteDialog = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsDeleteDialogVisible(true);
  };

  const handleDeleteConversation = () => {
    if (selectedConversationId) {
      dispatch(deleteConversation(selectedConversationId));
    }
  };

  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => {
    return <MessageItem message={item} />;
  };

  // Render empty conversation
  const renderEmptyConversation = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
          Welcome to Kairo Assistant
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          I'm here to help you with your productivity needs. You can ask me about:
        </Text>
        <View style={styles.topicContainer}>
          <Text style={[styles.topic, { color: theme.colors.onSurfaceVariant }]}>
            • Task management and prioritization
          </Text>
          <Text style={[styles.topic, { color: theme.colors.onSurfaceVariant }]}>
            • Habit building and tracking
          </Text>
          <Text style={[styles.topic, { color: theme.colors.onSurfaceVariant }]}>
            • Time management techniques
          </Text>
          <Text style={[styles.topic, { color: theme.colors.onSurfaceVariant }]}>
            • Focus and concentration tips
          </Text>
          <Text style={[styles.topic, { color: theme.colors.onSurfaceVariant }]}>
            • Motivation and productivity strategies
          </Text>
        </View>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          Type a message below to get started!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isWideScreen ? (
        // Wide screen layout (tablet/desktop)
        <View style={styles.wideContainer}>
          <View style={styles.sidebarContainer}>
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleOpenDeleteDialog}
              onRenameConversation={handleOpenRenameDialog}
              onNewConversation={handleNewConversation}
            />
          </View>

          <View style={styles.chatContainer}>
            <GlassContainer style={styles.messagesContainer}>
              {activeConversation ? (
                <FlatList
                  ref={flatListRef}
                  data={activeConversation.messages.filter(
                    m => m.role !== MessageRole.SYSTEM
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMessageItem}
                  contentContainerStyle={styles.messagesList}
                />
              ) : (
                renderEmptyConversation()
              )}

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </GlassContainer>

            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </View>
        </View>
      ) : (
        // Narrow screen layout (phone)
        <View style={styles.narrowContainer}>
          {!activeConversationId ? (
            // Show conversation list when no active conversation
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleOpenDeleteDialog}
              onRenameConversation={handleOpenRenameDialog}
              onNewConversation={handleNewConversation}
            />
          ) : (
            // Show chat when there's an active conversation
            <>
              <GlassContainer style={styles.messagesContainer}>
                <FlatList
                  ref={flatListRef}
                  data={activeConversation.messages.filter(
                    m => m.role !== MessageRole.SYSTEM
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMessageItem}
                  contentContainerStyle={styles.messagesList}
                />

                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primary}
                    />
                  </View>
                )}
              </GlassContainer>

              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
              />
            </>
          )}
        </View>
      )}

      {/* Dialogs */}
      <RenameDialog
        visible={isRenameDialogVisible}
        initialTitle={
          selectedConversationId
            ? conversations.find(c => c.id === selectedConversationId)?.title || ''
            : ''
        }
        onDismiss={() => setIsRenameDialogVisible(false)}
        onRename={handleRenameConversation}
      />

      <DeleteDialog
        visible={isDeleteDialogVisible}
        onDismiss={() => setIsDeleteDialogVisible(false)}
        onDelete={handleDeleteConversation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wideContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  narrowContainer: {
    flex: 1,
    padding: 16,
  },
  sidebarContainer: {
    width: 300,
  },
  chatContainer: {
    flex: 1,
    marginLeft: 16,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messagesList: {
    padding: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  topicContainer: {
    alignSelf: 'stretch',
    marginVertical: 16,
  },
  topic: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default AssistantScreen;

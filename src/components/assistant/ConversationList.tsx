import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Conversation } from '../../types/assistant';
import GlassContainer from '../common/GlassContainer';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onRenameConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onNewConversation,
}) => {
  const theme = useTheme();
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
  };
  
  // Render conversation item
  const renderItem = ({ item }: { item: Conversation }) => {
    const isActive = item.id === activeConversationId;
    
    return (
      <TouchableOpacity
        onPress={() => onSelectConversation(item.id)}
        style={[
          styles.itemContainer,
          isActive && { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <View style={styles.itemContent}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={isActive ? theme.colors.primary : theme.colors.onSurface}
            style={styles.itemIcon}
          />
          <View style={styles.itemTextContainer}>
            <Text
              style={[
                styles.itemTitle,
                { color: isActive ? theme.colors.primary : theme.colors.onSurface },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.itemDate, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {formatDate(item.updatedAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <IconButton
            icon="pencil-outline"
            size={18}
            onPress={() => onRenameConversation(item.id)}
            iconColor={theme.colors.onSurfaceVariant}
          />
          <IconButton
            icon="trash-outline"
            size={18}
            onPress={() => onDeleteConversation(item.id)}
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <GlassContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Conversations
        </Text>
        <IconButton
          icon="add-circle-outline"
          size={24}
          onPress={onNewConversation}
          iconColor={theme.colors.primary}
        />
      </View>
      
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            No conversations yet.
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
            Start a new conversation to get help from your AI assistant.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemDate: {
    fontSize: 12,
  },
  itemActions: {
    flexDirection: 'row',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ConversationList;

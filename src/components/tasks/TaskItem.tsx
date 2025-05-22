import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { formatDate, getRelativeTime, isPast } from '../../utils/dateUtils';
import GlassContainer from '../common/GlassContainer';

interface TaskItemProps {
  task: Task;
  onPress: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onToggleStatus }) => {
  const theme = useTheme();
  
  // Determine priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return theme.colors.error;
      case TaskPriority.MEDIUM:
        return theme.colors.tertiary;
      case TaskPriority.LOW:
      default:
        return theme.colors.primary;
    }
  };
  
  // Determine if task is completed
  const isCompleted = task.status === TaskStatus.COMPLETED;
  
  // Determine if task is overdue
  const isOverdue = task.dueDate ? isPast(task.dueDate) && !isCompleted : false;
  
  return (
    <TouchableOpacity onPress={() => onPress(task)}>
      <GlassContainer style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Checkbox
              status={isCompleted ? 'checked' : 'unchecked'}
              onPress={() => onToggleStatus(task)}
              color={theme.colors.primary}
            />
            <Text 
              style={[
                styles.title, 
                isCompleted && styles.completedText,
                { color: theme.colors.onSurface }
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
          </View>
          <View 
            style={[
              styles.priorityIndicator, 
              { backgroundColor: getPriorityColor() }
            ]} 
          />
        </View>
        
        {task.description && (
          <Text 
            style={[
              styles.description, 
              isCompleted && styles.completedText,
              { color: theme.colors.onSurfaceVariant }
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          {task.dueDate && (
            <View style={styles.dueDate}>
              <Ionicons 
                name="calendar-outline" 
                size={14} 
                color={isOverdue ? theme.colors.error : theme.colors.onSurfaceVariant} 
              />
              <Text 
                style={[
                  styles.dueDateText, 
                  isOverdue && styles.overdueText,
                  { color: isOverdue ? theme.colors.error : theme.colors.onSurfaceVariant }
                ]}
              >
                {getRelativeTime(task.dueDate)}
              </Text>
            </View>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <View style={styles.tags}>
              {task.tags.slice(0, 2).map((tag, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.tag, 
                    { backgroundColor: theme.colors.surfaceVariant }
                  ]}
                >
                  <Text style={[styles.tagText, { color: theme.colors.onSurfaceVariant }]}>
                    {tag}
                  </Text>
                </View>
              ))}
              {task.tags.length > 2 && (
                <Text style={[styles.moreTagsText, { color: theme.colors.onSurfaceVariant }]}>
                  +{task.tags.length - 2}
                </Text>
              )}
            </View>
          )}
        </View>
      </GlassContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 36,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 36,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  overdueText: {
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 4,
  },
  tagText: {
    fontSize: 10,
  },
  moreTagsText: {
    fontSize: 10,
    marginLeft: 4,
  },
});

export default TaskItem;

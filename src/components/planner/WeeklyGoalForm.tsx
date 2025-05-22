import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
  Checkbox,
} from 'react-native-paper';
import { WeeklyGoal } from '../../types/planner';
import { generateId } from '../../utils/idUtils';
import { getStartOfWeek, formatDateRange } from '../../utils/plannerUtils';

interface WeeklyGoalFormProps {
  goal?: WeeklyGoal;
  weekStartDate: Date;
  onSave: (goal: WeeklyGoal) => void;
  onCancel: () => void;
  onDelete?: (goalId: string) => void;
}

const WeeklyGoalForm: React.FC<WeeklyGoalFormProps> = ({ 
  goal, 
  weekStartDate,
  onSave, 
  onCancel,
  onDelete,
}) => {
  const theme = useTheme();
  const isEditing = !!goal;
  
  // Form state
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [completed, setCompleted] = useState(goal?.completed || false);
  
  // Validation
  const [titleError, setTitleError] = useState('');
  
  // Handle form submission
  const handleSave = () => {
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    
    const now = new Date().toISOString();
    const startOfWeek = getStartOfWeek(weekStartDate).toISOString();
    
    const newGoal: WeeklyGoal = {
      id: goal?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed,
      weekStartDate: startOfWeek,
      createdAt: goal?.createdAt || now,
      updatedAt: now,
      completedAt: completed ? (goal?.completedAt || now) : undefined,
    };
    
    onSave(newGoal);
  };
  
  // Get week date range for display
  const getWeekRange = (): string => {
    const startOfWeek = getStartOfWeek(weekStartDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return formatDateRange(startOfWeek, endOfWeek);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {isEditing ? 'Edit Weekly Goal' : 'New Weekly Goal'}
      </Text>
      
      <Text style={[styles.weekRange, { color: theme.colors.onSurfaceVariant }]}>
        For week of {getWeekRange()}
      </Text>
      
      <TextInput
        label="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (text.trim()) setTitleError('');
        }}
        style={styles.input}
        error={!!titleError}
      />
      {titleError ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {titleError}
        </Text>
      ) : null}
      
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={3}
      />
      
      <View style={styles.completedContainer}>
        <Checkbox
          status={completed ? 'checked' : 'unchecked'}
          onPress={() => setCompleted(!completed)}
          color={theme.colors.primary}
        />
        <Text 
          style={[styles.completedLabel, { color: theme.colors.onSurface }]}
          onPress={() => setCompleted(!completed)}
        >
          Mark as completed
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        {isEditing && onDelete && (
          <Button 
            mode="outlined" 
            onPress={() => onDelete(goal.id)}
            textColor={theme.colors.error}
            style={[styles.button, styles.deleteButton]}
          >
            Delete
          </Button>
        )}
        <Button 
          mode="outlined" 
          onPress={onCancel}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.button}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weekRange: {
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: -12,
    marginBottom: 16,
    fontSize: 12,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    borderColor: 'red',
  },
});

export default WeeklyGoalForm;

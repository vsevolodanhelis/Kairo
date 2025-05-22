import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { generateId } from '../../utils/idUtils';
import { formatDate } from '../../utils/dateUtils';

interface TaskFormProps {
  task?: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const theme = useTheme();
  const isEditing = !!task;
  
  // Form state
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || TaskPriority.MEDIUM
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  
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
    
    const newTask: Task = {
      id: task?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: task?.status || TaskStatus.TODO,
      dueDate: dueDate?.toISOString(),
      createdAt: task?.createdAt || now,
      updatedAt: now,
      completedAt: task?.completedAt,
      tags: tags.length > 0 ? tags : undefined,
    };
    
    onSave(newTask);
  };
  
  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {isEditing ? 'Edit Task' : 'New Task'}
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
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Priority
      </Text>
      <SegmentedButtons
        value={priority}
        onValueChange={(value) => setPriority(value as TaskPriority)}
        buttons={[
          { value: TaskPriority.LOW, label: 'Low' },
          { value: TaskPriority.MEDIUM, label: 'Medium' },
          { value: TaskPriority.HIGH, label: 'High' },
        ]}
        style={styles.segmentedButtons}
      />
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Due Date
      </Text>
      <View style={styles.dateContainer}>
        <Button 
          mode="outlined" 
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          {dueDate ? formatDate(dueDate.toISOString()) : 'Select Date'}
        </Button>
        {dueDate && (
          <Button 
            mode="text" 
            onPress={() => setDueDate(undefined)}
            textColor={theme.colors.error}
          >
            Clear
          </Button>
        )}
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Tags
      </Text>
      <View style={styles.tagInputContainer}>
        <TextInput
          label="Add Tag"
          value={tag}
          onChangeText={setTag}
          style={styles.tagInput}
        />
        <Button 
          mode="contained" 
          onPress={handleAddTag}
          disabled={!tag.trim()}
          style={styles.addTagButton}
        >
          Add
        </Button>
      </View>
      
      <View style={styles.tagsContainer}>
        {tags.map((t, index) => (
          <Chip
            key={index}
            onClose={() => handleRemoveTag(t)}
            style={styles.tag}
          >
            {t}
          </Chip>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    marginRight: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    margin: 4,
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
});

export default TaskForm;

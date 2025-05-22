import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
  TouchableRipple,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimeBlock } from '../../types/planner';
import { generateId } from '../../utils/idUtils';
import { formatDate } from '../../utils/dateUtils';
import { formatTime } from '../../utils/plannerUtils';

interface TimeBlockFormProps {
  timeBlock?: TimeBlock;
  date: Date;
  onSave: (timeBlock: TimeBlock) => void;
  onCancel: () => void;
  onDelete?: (timeBlockId: string) => void;
}

const TimeBlockForm: React.FC<TimeBlockFormProps> = ({ 
  timeBlock, 
  date,
  onSave, 
  onCancel,
  onDelete,
}) => {
  const theme = useTheme();
  const isEditing = !!timeBlock;
  
  // Form state
  const [title, setTitle] = useState(timeBlock?.title || '');
  const [description, setDescription] = useState(timeBlock?.description || '');
  const [startDate, setStartDate] = useState<Date>(
    timeBlock?.startTime ? new Date(timeBlock.startTime) : new Date(date)
  );
  const [endDate, setEndDate] = useState<Date>(
    timeBlock?.endTime ? new Date(timeBlock.endTime) : new Date(date.getTime() + 60 * 60 * 1000) // Default to 1 hour later
  );
  const [color, setColor] = useState<string | undefined>(timeBlock?.color);
  
  // Date picker state
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  // Validation
  const [titleError, setTitleError] = useState('');
  const [timeError, setTimeError] = useState('');
  
  // Available colors
  const colors = [
    theme.colors.primary,
    '#FF9500', // Orange
    '#5856D6', // Purple
    '#007AFF', // Blue
    '#4CD964', // Green
    '#FF3B30', // Red
  ];
  
  // Handle form submission
  const handleSave = () => {
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    
    // Validate time range
    if (endDate <= startDate) {
      setTimeError('End time must be after start time');
      return;
    }
    
    const now = new Date().toISOString();
    
    const newTimeBlock: TimeBlock = {
      id: timeBlock?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      color,
      createdAt: timeBlock?.createdAt || now,
      updatedAt: now,
    };
    
    onSave(newTimeBlock);
  };
  
  // Handle time changes
  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(startDate);
      newDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0
      );
      setStartDate(newDate);
      
      // Clear time error if end time is now after start time
      if (timeError && endDate > newDate) {
        setTimeError('');
      }
    }
  };
  
  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(endDate);
      newDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0
      );
      setEndDate(newDate);
      
      // Clear time error if end time is now after start time
      if (timeError && newDate > startDate) {
        setTimeError('');
      }
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {isEditing ? 'Edit Time Block' : 'New Time Block'}
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
        Time Range
      </Text>
      <View style={styles.timeRangeContainer}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeLabel, { color: theme.colors.onSurfaceVariant }]}>
            Start
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => setShowStartTimePicker(true)}
            style={styles.timeButton}
          >
            {formatTime(startDate)}
          </Button>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={[styles.timeLabel, { color: theme.colors.onSurfaceVariant }]}>
            End
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => setShowEndTimePicker(true)}
            style={styles.timeButton}
          >
            {formatTime(endDate)}
          </Button>
        </View>
      </View>
      
      {timeError ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {timeError}
        </Text>
      ) : null}
      
      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      
      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Color (Optional)
      </Text>
      <View style={styles.colorsContainer}>
        <TouchableRipple
          onPress={() => setColor(undefined)}
          style={[
            styles.colorOption,
            styles.noColorOption,
            !color && styles.selectedColor,
          ]}
        >
          <Text style={{ color: theme.colors.onSurface }}>None</Text>
        </TouchableRipple>
        {colors.map((c, index) => (
          <TouchableRipple
            key={index}
            onPress={() => setColor(c)}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && styles.selectedColor,
            ]}
          >
            <View />
          </TouchableRipple>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        {isEditing && onDelete && (
          <Button 
            mode="outlined" 
            onPress={() => onDelete(timeBlock.id)}
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
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeButton: {
    width: '100%',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noColorOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'transparent',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: 'white',
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

export default TimeBlockForm;

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
  SegmentedButtons,
  Switch,
  TouchableRipple,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Event, EventType } from '../../types/planner';
import { generateId } from '../../utils/idUtils';
import { formatDate } from '../../utils/dateUtils';
import { formatTime } from '../../utils/plannerUtils';

interface EventFormProps {
  event?: Event;
  date: Date;
  onSave: (event: Event) => void;
  onCancel: () => void;
  onDelete?: (eventId: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  date,
  onSave, 
  onCancel,
  onDelete,
}) => {
  const theme = useTheme();
  const isEditing = !!event;
  
  // Form state
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [type, setType] = useState<EventType>(
    event?.type || EventType.MEETING
  );
  const [location, setLocation] = useState(event?.location || '');
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay || false);
  const [startDate, setStartDate] = useState<Date>(
    event?.startTime ? new Date(event.startTime) : new Date(date)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    event?.endTime ? new Date(event.endTime) : undefined
  );
  const [hasEndDate, setHasEndDate] = useState<boolean>(!!event?.endTime);
  const [color, setColor] = useState<string | undefined>(event?.color);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  // Validation
  const [titleError, setTitleError] = useState('');
  
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
    
    const now = new Date().toISOString();
    
    // Create start time
    let startTime = new Date(startDate);
    if (isAllDay) {
      startTime.setHours(0, 0, 0, 0);
    }
    
    // Create end time
    let endTime: Date | undefined;
    if (hasEndDate && endDate) {
      endTime = new Date(endDate);
      if (isAllDay) {
        endTime.setHours(23, 59, 59, 999);
      }
    } else if (isAllDay) {
      // If all day and no end date, set end time to end of the day
      endTime = new Date(startDate);
      endTime.setHours(23, 59, 59, 999);
    }
    
    const newEvent: Event = {
      id: event?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: startTime.toISOString(),
      endTime: endTime?.toISOString(),
      type,
      location: location.trim() || undefined,
      isAllDay,
      color,
      createdAt: event?.createdAt || now,
      updatedAt: now,
    };
    
    onSave(newEvent);
  };
  
  // Handle date changes
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Preserve time from current startDate
      if (!isAllDay) {
        const currentDate = new Date(startDate);
        newDate.setHours(
          currentDate.getHours(),
          currentDate.getMinutes(),
          currentDate.getSeconds(),
          currentDate.getMilliseconds()
        );
      }
      setStartDate(newDate);
    }
  };
  
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
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Preserve time from current endDate or use end of day for all-day events
      if (!isAllDay && endDate) {
        const currentDate = new Date(endDate);
        newDate.setHours(
          currentDate.getHours(),
          currentDate.getMinutes(),
          currentDate.getSeconds(),
          currentDate.getMilliseconds()
        );
      } else if (isAllDay) {
        newDate.setHours(23, 59, 59, 999);
      } else {
        // Default end time is 1 hour after start time
        const startTime = new Date(startDate);
        newDate.setHours(
          startTime.getHours() + 1,
          startTime.getMinutes(),
          0,
          0
        );
      }
      setEndDate(newDate);
    }
  };
  
  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime && endDate) {
      const newDate = new Date(endDate);
      newDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0
      );
      setEndDate(newDate);
    }
  };
  
  // Toggle all day
  const handleToggleAllDay = (value: boolean) => {
    setIsAllDay(value);
    
    if (value) {
      // Set start time to beginning of day
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0, 0, 0, 0);
      setStartDate(newStartDate);
      
      // Set end time to end of day
      if (endDate) {
        const newEndDate = new Date(endDate);
        newEndDate.setHours(23, 59, 59, 999);
        setEndDate(newEndDate);
      }
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {isEditing ? 'Edit Event' : 'New Event'}
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
      
      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Event Type
      </Text>
      <SegmentedButtons
        value={type}
        onValueChange={(value) => setType(value as EventType)}
        buttons={[
          { value: EventType.MEETING, label: 'Meeting' },
          { value: EventType.APPOINTMENT, label: 'Appointment' },
          { value: EventType.TASK, label: 'Task' },
          { value: EventType.REMINDER, label: 'Reminder' },
          { value: EventType.OTHER, label: 'Other' },
        ]}
        style={styles.segmentedButtons}
      />
      
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
          All Day
        </Text>
        <Switch
          value={isAllDay}
          onValueChange={handleToggleAllDay}
          color={theme.colors.primary}
        />
      </View>
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Start
      </Text>
      <View style={styles.dateTimeContainer}>
        <Button 
          mode="outlined" 
          onPress={() => setShowStartDatePicker(true)}
          style={styles.dateButton}
        >
          {formatDate(startDate.toISOString())}
        </Button>
        
        {!isAllDay && (
          <Button 
            mode="outlined" 
            onPress={() => setShowStartTimePicker(true)}
            style={styles.timeButton}
          >
            {formatTime(startDate)}
          </Button>
        )}
      </View>
      
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      
      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
          Set End Time
        </Text>
        <Switch
          value={hasEndDate}
          onValueChange={setHasEndDate}
          color={theme.colors.primary}
        />
      </View>
      
      {hasEndDate && (
        <View style={styles.indentedSection}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            End
          </Text>
          <View style={styles.dateTimeContainer}>
            <Button 
              mode="outlined" 
              onPress={() => setShowEndDatePicker(true)}
              style={styles.dateButton}
            >
              {endDate ? formatDate(endDate.toISOString()) : 'Select Date'}
            </Button>
            
            {!isAllDay && (
              <Button 
                mode="outlined" 
                onPress={() => setShowEndTimePicker(true)}
                style={styles.timeButton}
              >
                {endDate ? formatTime(endDate) : 'Select Time'}
              </Button>
            )}
          </View>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || startDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate}
            />
          )}
          
          {showEndTimePicker && (
            <DateTimePicker
              value={endDate || startDate}
              mode="time"
              display="default"
              onChange={handleEndTimeChange}
            />
          )}
        </View>
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
            onPress={() => onDelete(event.id)}
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
  segmentedButtons: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateButton: {
    flex: 2,
    marginRight: 8,
  },
  timeButton: {
    flex: 1,
  },
  indentedSection: {
    marginLeft: 16,
    marginBottom: 16,
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

export default EventForm;

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
  SegmentedButtons,
  Chip,
  Switch,
  TouchableRipple,
  RadioButton,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Habit, HabitFrequency } from '../../types/habit';
import { generateId } from '../../utils/idUtils';
import { formatDate } from '../../utils/dateUtils';
import { getDaysOfWeek } from '../../utils/habitUtils';

interface HabitFormProps {
  habit?: Habit;
  onSave: (habit: Habit) => void;
  onCancel: () => void;
  onDelete?: (habitId: string) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ 
  habit, 
  onSave, 
  onCancel,
  onDelete,
}) => {
  const theme = useTheme();
  const isEditing = !!habit;
  const daysOfWeek = getDaysOfWeek();
  
  // Form state
  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState<HabitFrequency>(
    habit?.frequency || HabitFrequency.DAILY
  );
  const [customDays, setCustomDays] = useState<number[]>(
    habit?.customDays || []
  );
  const [target, setTarget] = useState<string>(
    habit?.target?.toString() || '1'
  );
  const [color, setColor] = useState<string>(
    habit?.color || theme.colors.primary
  );
  const [startDate, setStartDate] = useState<Date>(
    habit?.startDate ? new Date(habit.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    habit?.endDate ? new Date(habit.endDate) : undefined
  );
  const [hasEndDate, setHasEndDate] = useState<boolean>(!!habit?.endDate);
  const [reminderTime, setReminderTime] = useState<Date | undefined>(
    habit?.reminderTime ? new Date(habit.reminderTime) : undefined
  );
  const [hasReminder, setHasReminder] = useState<boolean>(!!habit?.reminderTime);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Validation
  const [titleError, setTitleError] = useState('');
  const [targetError, setTargetError] = useState('');
  
  // Available colors
  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.tertiary,
    '#FF9500', // Orange
    '#FF2D55', // Pink
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
    
    // Validate target
    const targetNumber = parseInt(target);
    if (isNaN(targetNumber) || targetNumber <= 0) {
      setTargetError('Target must be a positive number');
      return;
    }
    
    const now = new Date().toISOString();
    
    const newHabit: Habit = {
      id: habit?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      frequency,
      customDays: frequency === HabitFrequency.CUSTOM ? customDays : undefined,
      target: targetNumber,
      color,
      startDate: startDate.toISOString(),
      endDate: hasEndDate && endDate ? endDate.toISOString() : undefined,
      reminderTime: hasReminder && reminderTime ? reminderTime.toISOString() : undefined,
      completions: habit?.completions || [],
      createdAt: habit?.createdAt || now,
      updatedAt: now,
      archived: habit?.archived || false,
    };
    
    onSave(newHabit);
  };
  
  // Handle date changes
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };
  
  // Toggle custom day
  const toggleCustomDay = (dayIndex: number) => {
    if (customDays.includes(dayIndex)) {
      setCustomDays(customDays.filter(d => d !== dayIndex));
    } else {
      setCustomDays([...customDays, dayIndex]);
    }
  };
  
  // Format time for display
  const formatTime = (date?: Date): string => {
    if (!date) return 'Set Time';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {isEditing ? 'Edit Habit' : 'New Habit'}
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
        Frequency
      </Text>
      <SegmentedButtons
        value={frequency}
        onValueChange={(value) => setFrequency(value as HabitFrequency)}
        buttons={[
          { value: HabitFrequency.DAILY, label: 'Daily' },
          { value: HabitFrequency.WEEKLY, label: 'Weekly' },
          { value: HabitFrequency.MONTHLY, label: 'Monthly' },
          { value: HabitFrequency.CUSTOM, label: 'Custom' },
        ]}
        style={styles.segmentedButtons}
      />
      
      {frequency === HabitFrequency.CUSTOM && (
        <View style={styles.customDaysContainer}>
          <Text style={[styles.sublabel, { color: theme.colors.onSurface }]}>
            Select Days
          </Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day, index) => (
              <Chip
                key={index}
                selected={customDays.includes(index)}
                onPress={() => toggleCustomDay(index)}
                style={styles.dayChip}
                selectedColor={theme.colors.primary}
              >
                {day}
              </Chip>
            ))}
          </View>
        </View>
      )}
      
      <TextInput
        label="Target (times per day)"
        value={target}
        onChangeText={(text) => {
          setTarget(text);
          if (!isNaN(parseInt(text)) && parseInt(text) > 0) {
            setTargetError('');
          }
        }}
        keyboardType="numeric"
        style={styles.input}
        error={!!targetError}
      />
      {targetError ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {targetError}
        </Text>
      ) : null}
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Color
      </Text>
      <View style={styles.colorsContainer}>
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
      
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Start Date
      </Text>
      <Button 
        mode="outlined" 
        onPress={() => setShowStartDatePicker(true)}
        style={styles.dateButton}
      >
        {formatDate(startDate.toISOString())}
      </Button>
      
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
          Set End Date
        </Text>
        <Switch
          value={hasEndDate}
          onValueChange={setHasEndDate}
          color={theme.colors.primary}
        />
      </View>
      
      {hasEndDate && (
        <View style={styles.indentedSection}>
          <Button 
            mode="outlined" 
            onPress={() => setShowEndDatePicker(true)}
            style={styles.dateButton}
          >
            {endDate ? formatDate(endDate.toISOString()) : 'Select End Date'}
          </Button>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate}
            />
          )}
        </View>
      )}
      
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
          Set Reminder
        </Text>
        <Switch
          value={hasReminder}
          onValueChange={setHasReminder}
          color={theme.colors.primary}
        />
      </View>
      
      {hasReminder && (
        <View style={styles.indentedSection}>
          <Button 
            mode="outlined" 
            onPress={() => setShowTimePicker(true)}
            style={styles.dateButton}
          >
            {reminderTime ? formatTime(reminderTime) : 'Select Time'}
          </Button>
          
          {showTimePicker && (
            <DateTimePicker
              value={reminderTime || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        {isEditing && onDelete && (
          <Button 
            mode="outlined" 
            onPress={() => onDelete(habit.id)}
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
  sublabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  customDaysContainer: {
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayChip: {
    margin: 4,
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
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: 'white',
  },
  dateButton: {
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
  indentedSection: {
    marginLeft: 16,
    marginBottom: 16,
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

export default HabitForm;

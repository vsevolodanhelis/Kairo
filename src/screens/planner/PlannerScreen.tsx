import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  FAB,
  Portal,
  Modal,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  addEvent,
  updateEvent,
  deleteEvent,
  addTimeBlock,
  updateTimeBlock,
  deleteTimeBlock,
  addWeeklyGoal,
  updateWeeklyGoal,
  deleteWeeklyGoal,
  toggleWeeklyGoalCompletion,
  addNote,
  updateNote,
  deleteNote,
} from '../../store/slices/plannerSlice';
import {
  Event,
  TimeBlock,
  WeeklyGoal,
  Note,
  EventType,
} from '../../types/planner';
import {
  getEventsForDate,
  getTimeBlocksForDate,
  getWeeklyGoalsForWeek,
  getStartOfWeek,
  getEndOfWeek,
} from '../../utils/plannerUtils';

import WeekView from '../../components/planner/WeekView';
import EventItem from '../../components/planner/EventItem';
import TimeBlockItem from '../../components/planner/TimeBlockItem';
import WeeklyGoalItem from '../../components/planner/WeeklyGoalItem';
import NoteItem from '../../components/planner/NoteItem';
import EventForm from '../../components/planner/EventForm';
import TimeBlockForm from '../../components/planner/TimeBlockForm';
import WeeklyGoalForm from '../../components/planner/WeeklyGoalForm';
import NoteForm from '../../components/planner/NoteForm';
import GlassContainer from '../../components/common/GlassContainer';

type ModalContent = 'event' | 'timeBlock' | 'weeklyGoal' | 'note';

const PlannerScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { events, timeBlocks, weeklyGoals, notes } = useSelector(
    (state: RootState) => state.planner
  );

  // State for selected date and week
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    getStartOfWeek(selectedDate)
  );
  const [weekEndDate, setWeekEndDate] = useState<Date>(
    getEndOfWeek(selectedDate)
  );

  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>('event');
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | undefined>(undefined);
  const [selectedWeeklyGoal, setSelectedWeeklyGoal] = useState<WeeklyGoal | undefined>(undefined);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  // State for view mode
  const [viewMode, setViewMode] = useState<'schedule' | 'goals' | 'notes'>('schedule');

  // Filter data for the selected date and week
  const filteredEvents = getEventsForDate(events, selectedDate);
  const filteredTimeBlocks = getTimeBlocksForDate(timeBlocks, selectedDate);
  const filteredWeeklyGoals = getWeeklyGoalsForWeek(weeklyGoals, selectedDate);
  const filteredNotes = notes.filter(note => {
    const noteDate = new Date(note.date);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const noteDateStr = noteDate.toISOString().split('T')[0];
    return selectedDateStr === noteDateStr;
  });

  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle week change
  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setWeekStartDate(startDate);
    setWeekEndDate(endDate);
  };

  // Handle add new item
  const handleAddItem = (type: ModalContent) => {
    setModalContent(type);
    setSelectedEvent(undefined);
    setSelectedTimeBlock(undefined);
    setSelectedWeeklyGoal(undefined);
    setSelectedNote(undefined);
    setModalVisible(true);
  };

  // Handle item press
  const handleEventPress = (event: Event) => {
    setModalContent('event');
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleTimeBlockPress = (timeBlock: TimeBlock) => {
    setModalContent('timeBlock');
    setSelectedTimeBlock(timeBlock);
    setModalVisible(true);
  };

  const handleWeeklyGoalPress = (goal: WeeklyGoal) => {
    setModalContent('weeklyGoal');
    setSelectedWeeklyGoal(goal);
    setModalVisible(true);
  };

  const handleNotePress = (note: Note) => {
    setModalContent('note');
    setSelectedNote(note);
    setModalVisible(true);
  };

  // Handle toggle weekly goal completion
  const handleToggleWeeklyGoalCompletion = (goal: WeeklyGoal, completed: boolean) => {
    dispatch(toggleWeeklyGoalCompletion({ id: goal.id, completed }));
  };

  // Handle save item
  const handleSaveEvent = (event: Event) => {
    if (selectedEvent) {
      dispatch(updateEvent(event));
    } else {
      dispatch(addEvent(event));
    }
    setModalVisible(false);
  };

  const handleSaveTimeBlock = (timeBlock: TimeBlock) => {
    if (selectedTimeBlock) {
      dispatch(updateTimeBlock(timeBlock));
    } else {
      dispatch(addTimeBlock(timeBlock));
    }
    setModalVisible(false);
  };

  const handleSaveWeeklyGoal = (goal: WeeklyGoal) => {
    if (selectedWeeklyGoal) {
      dispatch(updateWeeklyGoal(goal));
    } else {
      dispatch(addWeeklyGoal(goal));
    }
    setModalVisible(false);
  };

  const handleSaveNote = (note: Note) => {
    if (selectedNote) {
      dispatch(updateNote(note));
    } else {
      dispatch(addNote(note));
    }
    setModalVisible(false);
  };

  // Handle delete item
  const handleDeleteEvent = (eventId: string) => {
    dispatch(deleteEvent(eventId));
    setModalVisible(false);
  };

  const handleDeleteTimeBlock = (timeBlockId: string) => {
    dispatch(deleteTimeBlock(timeBlockId));
    setModalVisible(false);
  };

  const handleDeleteWeeklyGoal = (goalId: string) => {
    dispatch(deleteWeeklyGoal(goalId));
    setModalVisible(false);
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch(deleteNote(noteId));
    setModalVisible(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Render content based on view mode
  const renderContent = () => {
    switch (viewMode) {
      case 'schedule':
        return (
          <ScrollView style={styles.contentContainer}>
            {filteredEvents.length === 0 && filteredTimeBlocks.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No events or time blocks for this day. Add some to get started!
              </Text>
            ) : (
              <>
                {filteredEvents.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                      Events
                    </Text>
                    {filteredEvents.map(event => (
                      <EventItem
                        key={event.id}
                        event={event}
                        onPress={handleEventPress}
                      />
                    ))}
                  </View>
                )}

                {filteredTimeBlocks.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                      Time Blocks
                    </Text>
                    {filteredTimeBlocks.map(timeBlock => (
                      <TimeBlockItem
                        key={timeBlock.id}
                        timeBlock={timeBlock}
                        onPress={handleTimeBlockPress}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        );

      case 'goals':
        return (
          <ScrollView style={styles.contentContainer}>
            {filteredWeeklyGoals.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No weekly goals for this week. Add some to get started!
              </Text>
            ) : (
              <View style={styles.sectionContainer}>
                {filteredWeeklyGoals.map(goal => (
                  <WeeklyGoalItem
                    key={goal.id}
                    goal={goal}
                    onPress={handleWeeklyGoalPress}
                    onToggleCompletion={handleToggleWeeklyGoalCompletion}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        );

      case 'notes':
        return (
          <ScrollView style={styles.contentContainer}>
            {filteredNotes.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No notes for this day. Add some to get started!
              </Text>
            ) : (
              <View style={styles.sectionContainer}>
                {filteredNotes.map(note => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onPress={handleNotePress}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  // Render FAB based on view mode
  const renderFAB = () => {
    switch (viewMode) {
      case 'schedule':
        return (
          <View style={styles.fabContainer}>
            <FAB
              icon="clock-outline"
              label="Time Block"
              style={[styles.fab, styles.timeBlockFab, { backgroundColor: theme.colors.secondary }]}
              onPress={() => handleAddItem('timeBlock')}
              color={theme.colors.onSecondary}
              small
            />
            <FAB
              icon="calendar-plus"
              label="Event"
              style={[styles.fab, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleAddItem('event')}
              color={theme.colors.onPrimary}
            />
          </View>
        );

      case 'goals':
        return (
          <FAB
            icon="flag"
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleAddItem('weeklyGoal')}
            color={theme.colors.onPrimary}
          />
        );

      case 'notes':
        return (
          <FAB
            icon="note-plus"
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleAddItem('note')}
            color={theme.colors.onPrimary}
          />
        );

      default:
        return null;
    }
  };

  // Render modal content based on modal type
  const renderModalContent = () => {
    switch (modalContent) {
      case 'event':
        return (
          <EventForm
            event={selectedEvent}
            date={selectedDate}
            onSave={handleSaveEvent}
            onCancel={handleCancel}
            onDelete={selectedEvent ? handleDeleteEvent : undefined}
          />
        );

      case 'timeBlock':
        return (
          <TimeBlockForm
            timeBlock={selectedTimeBlock}
            date={selectedDate}
            onSave={handleSaveTimeBlock}
            onCancel={handleCancel}
            onDelete={selectedTimeBlock ? handleDeleteTimeBlock : undefined}
          />
        );

      case 'weeklyGoal':
        return (
          <WeeklyGoalForm
            goal={selectedWeeklyGoal}
            weekStartDate={weekStartDate}
            onSave={handleSaveWeeklyGoal}
            onCancel={handleCancel}
            onDelete={selectedWeeklyGoal ? handleDeleteWeeklyGoal : undefined}
          />
        );

      case 'note':
        return (
          <NoteForm
            note={selectedNote}
            date={selectedDate}
            onSave={handleSaveNote}
            onCancel={handleCancel}
            onDelete={selectedNote ? handleDeleteNote : undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <WeekView
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onWeekChange={handleWeekChange}
      />

      <SegmentedButtons
        value={viewMode}
        onValueChange={(value) => setViewMode(value as 'schedule' | 'goals' | 'notes')}
        buttons={[
          { value: 'schedule', label: 'Schedule' },
          { value: 'goals', label: 'Goals' },
          { value: 'notes', label: 'Notes' },
        ]}
        style={styles.segmentedButtons}
      />

      <Divider />

      {renderContent()}

      {renderFAB()}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCancel}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background }
          ]}
        >
          {renderModalContent()}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedButtons: {
    margin: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  timeBlockFab: {
    bottom: 80,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
});

export default PlannerScreen;

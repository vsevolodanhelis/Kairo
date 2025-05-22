import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Event, EventType } from '../../types/planner';
import { formatTime } from '../../utils/plannerUtils';
import GlassContainer from '../common/GlassContainer';

interface EventItemProps {
  event: Event;
  onPress: (event: Event) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onPress }) => {
  const theme = useTheme();
  
  // Get event color or use default based on type
  const getEventColor = (): string => {
    if (event.color) return event.color;
    
    switch (event.type) {
      case EventType.MEETING:
        return '#FF9500'; // Orange
      case EventType.APPOINTMENT:
        return '#5856D6'; // Purple
      case EventType.TASK:
        return '#007AFF'; // Blue
      case EventType.REMINDER:
        return '#4CD964'; // Green
      case EventType.OTHER:
      default:
        return theme.colors.primary;
    }
  };
  
  // Get icon based on event type
  const getEventIcon = (): string => {
    switch (event.type) {
      case EventType.MEETING:
        return 'people';
      case EventType.APPOINTMENT:
        return 'calendar';
      case EventType.TASK:
        return 'checkmark-circle';
      case EventType.REMINDER:
        return 'alarm';
      case EventType.OTHER:
      default:
        return 'ellipsis-horizontal';
    }
  };
  
  // Format time range
  const getTimeRange = (): string => {
    if (event.isAllDay) {
      return 'All Day';
    }
    
    const startTime = new Date(event.startTime);
    const formattedStart = formatTime(startTime);
    
    if (event.endTime) {
      const endTime = new Date(event.endTime);
      const formattedEnd = formatTime(endTime);
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    return formattedStart;
  };
  
  const eventColor = getEventColor();
  const eventIcon = getEventIcon();
  
  return (
    <TouchableOpacity onPress={() => onPress(event)}>
      <GlassContainer style={styles.container}>
        <View 
          style={[
            styles.colorBar, 
            { backgroundColor: eventColor }
          ]} 
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons 
                name={eventIcon} 
                size={16} 
                color={eventColor} 
                style={styles.icon}
              />
              <Text 
                style={[
                  styles.title, 
                  { color: theme.colors.onSurface }
                ]}
                numberOfLines={1}
              >
                {event.title}
              </Text>
            </View>
            <Text 
              style={[
                styles.time, 
                { color: theme.colors.onSurfaceVariant }
              ]}
            >
              {getTimeRange()}
            </Text>
          </View>
          
          {event.description && (
            <Text 
              style={[
                styles.description, 
                { color: theme.colors.onSurfaceVariant }
              ]}
              numberOfLines={2}
            >
              {event.description}
            </Text>
          )}
          
          {event.location && (
            <View style={styles.locationContainer}>
              <Ionicons 
                name="location-outline" 
                size={14} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text 
                style={[
                  styles.location, 
                  { color: theme.colors.onSurfaceVariant }
                ]}
                numberOfLines={1}
              >
                {event.location}
              </Text>
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
    flexDirection: 'row',
  },
  colorBar: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default EventItem;

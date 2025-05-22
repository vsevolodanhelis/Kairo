import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { TimeBlock } from '../../types/planner';
import { formatTime } from '../../utils/plannerUtils';
import GlassContainer from '../common/GlassContainer';

interface TimeBlockItemProps {
  timeBlock: TimeBlock;
  onPress: (timeBlock: TimeBlock) => void;
}

const TimeBlockItem: React.FC<TimeBlockItemProps> = ({ timeBlock, onPress }) => {
  const theme = useTheme();
  
  // Get time block color or use default
  const blockColor = timeBlock.color || theme.colors.primary;
  
  // Format time range
  const getTimeRange = (): string => {
    const startTime = new Date(timeBlock.startTime);
    const endTime = new Date(timeBlock.endTime);
    
    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);
    
    return `${formattedStart} - ${formattedEnd}`;
  };
  
  // Calculate duration in minutes
  const getDuration = (): number => {
    const startTime = new Date(timeBlock.startTime).getTime();
    const endTime = new Date(timeBlock.endTime).getTime();
    
    return Math.round((endTime - startTime) / (1000 * 60));
  };
  
  // Format duration as "X hr Y min"
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${mins} min`;
    }
  };
  
  const duration = getDuration();
  
  return (
    <TouchableOpacity onPress={() => onPress(timeBlock)}>
      <GlassContainer style={styles.container}>
        <View 
          style={[
            styles.colorBar, 
            { backgroundColor: blockColor }
          ]} 
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons 
                name="time-outline" 
                size={16} 
                color={blockColor} 
                style={styles.icon}
              />
              <Text 
                style={[
                  styles.title, 
                  { color: theme.colors.onSurface }
                ]}
                numberOfLines={1}
              >
                {timeBlock.title}
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
          
          {timeBlock.description && (
            <Text 
              style={[
                styles.description, 
                { color: theme.colors.onSurfaceVariant }
              ]}
              numberOfLines={2}
            >
              {timeBlock.description}
            </Text>
          )}
          
          <View style={styles.durationContainer}>
            <Ionicons 
              name="hourglass-outline" 
              size={14} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text 
              style={[
                styles.duration, 
                { color: theme.colors.onSurfaceVariant }
              ]}
            >
              {formatDuration(duration)}
            </Text>
          </View>
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
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default TimeBlockItem;

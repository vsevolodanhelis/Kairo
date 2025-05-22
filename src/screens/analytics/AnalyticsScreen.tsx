import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Button, SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  calculateAnalytics,
  calculateTaskStats,
  calculateHabitStats,
  calculateTimeStats,
  calculateGoalStats,
} from '../../services/analyticsService';
import { AnalyticsState } from '../../types/analytics';

import StatCard from '../../components/analytics/StatCard';
import ProgressChart from '../../components/analytics/ProgressChart';
import StatGroup from '../../components/analytics/StatGroup';

type AnalyticsTab = 'overview' | 'tasks' | 'habits' | 'time';

const AnalyticsScreen = () => {
  const theme = useTheme();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { habits } = useSelector((state: RootState) => state.habits);
  const { timeBlocks, weeklyGoals } = useSelector((state: RootState) => state.planner);

  // State for analytics data
  const [analytics, setAnalytics] = useState<AnalyticsState | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Calculate analytics on mount and when data changes
  useEffect(() => {
    calculateData();
  }, [tasks, habits, timeBlocks, weeklyGoals]);

  // Calculate analytics data
  const calculateData = () => {
    const data = calculateAnalytics(tasks, habits, timeBlocks, weeklyGoals);
    setAnalytics(data);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    calculateData();
    setRefreshing(false);
  };

  // Format time (hours) to readable format
  const formatTime = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours} hr`;
    }

    return `${wholeHours} hr ${minutes} min`;
  };

  // Render overview tab
  const renderOverview = () => {
    if (!analytics) return null;

    const { taskStats, habitStats, timeStats, goalStats } = analytics;

    return (
      <>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <StatCard
              title="Tasks Completed"
              value={`${taskStats.completed}/${taskStats.total}`}
              icon="checkmark-circle"
              color={theme.colors.primary}
              subtitle={`${taskStats.completionRate.toFixed(0)}% completion rate`}
            />
          </View>
          <View style={styles.cardColumn}>
            <StatCard
              title="Habit Streaks"
              value={habitStats.streaks.current}
              icon="flame"
              color="#FF9500"
              subtitle={`${habitStats.completionRate.toFixed(0)}% consistency`}
            />
          </View>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <StatCard
              title="Time Tracked"
              value={formatTime(timeStats.totalHours)}
              icon="time"
              color="#5856D6"
              subtitle={`${timeStats.totalTimeBlocks} time blocks`}
            />
          </View>
          <View style={styles.cardColumn}>
            <StatCard
              title="Goals Achieved"
              value={`${goalStats.completed}/${goalStats.total}`}
              icon="flag"
              color="#4CD964"
              subtitle={`${goalStats.completionRate.toFixed(0)}% success rate`}
            />
          </View>
        </View>

        <ProgressChart
          title="Task Distribution"
          data={[
            {
              name: 'Completed',
              value: taskStats.completed,
              color: '#4CD964',
              legendFontColor: theme.colors.onSurface,
            },
            {
              name: 'In Progress',
              value: taskStats.inProgress,
              color: '#FF9500',
              legendFontColor: theme.colors.onSurface,
            },
            {
              name: 'To Do',
              value: taskStats.todo,
              color: '#007AFF',
              legendFontColor: theme.colors.onSurface,
            },
          ]}
        />
      </>
    );
  };

  // Render tasks tab
  const renderTasks = () => {
    if (!analytics) return null;

    const { taskStats } = analytics;

    return (
      <>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <StatCard
              title="Completion Rate"
              value={`${taskStats.completionRate.toFixed(0)}%`}
              icon="checkmark-circle"
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.cardColumn}>
            <StatCard
              title="Avg. Completion Time"
              value={formatTime(taskStats.averageCompletionTime)}
              icon="hourglass"
              color="#FF9500"
            />
          </View>
        </View>

        <ProgressChart
          title="Tasks by Priority"
          data={[
            {
              name: 'High',
              value: taskStats.byPriority.high,
              color: '#FF3B30',
              legendFontColor: theme.colors.onSurface,
            },
            {
              name: 'Medium',
              value: taskStats.byPriority.medium,
              color: '#FF9500',
              legendFontColor: theme.colors.onSurface,
            },
            {
              name: 'Low',
              value: taskStats.byPriority.low,
              color: '#4CD964',
              legendFontColor: theme.colors.onSurface,
            },
          ]}
        />

        <StatGroup
          title="Task Status"
          stats={[
            {
              label: 'Completed',
              value: taskStats.completed,
              progress: taskStats.total > 0 ? taskStats.completed / taskStats.total : 0,
              color: '#4CD964',
            },
            {
              label: 'In Progress',
              value: taskStats.inProgress,
              progress: taskStats.total > 0 ? taskStats.inProgress / taskStats.total : 0,
              color: '#FF9500',
            },
            {
              label: 'To Do',
              value: taskStats.todo,
              progress: taskStats.total > 0 ? taskStats.todo / taskStats.total : 0,
              color: '#007AFF',
            },
          ]}
        />
      </>
    );
  };

  // Render habits tab
  const renderHabits = () => {
    if (!analytics) return null;

    const { habitStats } = analytics;

    // Find habit names for most/least consistent
    const mostConsistentHabit = habits.find(h => h.id === habitStats.mostConsistent);
    const leastConsistentHabit = habits.find(h => h.id === habitStats.leastConsistent);

    return (
      <>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <StatCard
              title="Current Streak"
              value={habitStats.streaks.current}
              icon="flame"
              color="#FF9500"
            />
          </View>
          <View style={styles.cardColumn}>
            <StatCard
              title="Longest Streak"
              value={habitStats.streaks.longest}
              icon="trophy"
              color="#4CD964"
            />
          </View>
        </View>

        <StatGroup
          title="Habit Stats"
          stats={[
            {
              label: 'Active Habits',
              value: habitStats.active,
              progress: habitStats.total > 0 ? habitStats.active / habitStats.total : 0,
              color: theme.colors.primary,
            },
            {
              label: 'Archived Habits',
              value: habitStats.archived,
              progress: habitStats.total > 0 ? habitStats.archived / habitStats.total : 0,
              color: theme.colors.secondary,
            },
            {
              label: 'Completion Rate',
              value: `${habitStats.completionRate.toFixed(0)}%`,
              progress: habitStats.completionRate / 100,
              color: '#4CD964',
            },
          ]}
        />

        <StatGroup
          title="Habit Insights"
          stats={[
            {
              label: 'Most Consistent',
              value: mostConsistentHabit?.title || 'N/A',
            },
            {
              label: 'Least Consistent',
              value: leastConsistentHabit?.title || 'N/A',
            },
          ]}
        />
      </>
    );
  };

  // Render time tab
  const renderTime = () => {
    if (!analytics) return null;

    const { timeStats, goalStats } = analytics;

    return (
      <>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <StatCard
              title="Total Time Tracked"
              value={formatTime(timeStats.totalHours)}
              icon="time"
              color="#5856D6"
            />
          </View>
          <View style={styles.cardColumn}>
            <StatCard
              title="Avg. Block Length"
              value={formatTime(timeStats.averageBlockLength / 60)}
              icon="hourglass"
              color="#FF9500"
            />
          </View>
        </View>

        <StatGroup
          title="Time Insights"
          stats={[
            {
              label: 'Most Productive Day',
              value: timeStats.mostProductiveDay,
            },
            {
              label: 'Most Productive Time',
              value: timeStats.mostProductiveTime,
            },
            {
              label: 'Total Time Blocks',
              value: timeStats.totalTimeBlocks,
            },
          ]}
        />

        <StatGroup
          title="Weekly Goals"
          stats={[
            {
              label: 'Goals Completed',
              value: goalStats.completed,
              progress: goalStats.total > 0 ? goalStats.completed / goalStats.total : 0,
              color: '#4CD964',
            },
            {
              label: 'Completion Rate',
              value: `${goalStats.completionRate.toFixed(0)}%`,
              progress: goalStats.completionRate / 100,
              color: theme.colors.primary,
            },
          ]}
        />
      </>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'tasks':
        return renderTasks();
      case 'habits':
        return renderHabits();
      case 'time':
        return renderTime();
      default:
        return null;
    }
  };

  // If no data, show empty state
  if (!analytics) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
          No analytics data available
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
          Start adding tasks, habits, and time blocks to see your analytics.
        </Text>
        <Button
          mode="contained"
          onPress={calculateData}
          style={styles.refreshButton}
        >
          Refresh Data
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AnalyticsTab)}
        buttons={[
          { value: 'overview', label: 'Overview' },
          { value: 'tasks', label: 'Tasks' },
          { value: 'habits', label: 'Habits' },
          { value: 'time', label: 'Time' },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {renderContent()}

        <Text style={[styles.lastUpdated, { color: theme.colors.onSurfaceVariant }]}>
          Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
        </Text>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 16,
  },
});

export default AnalyticsScreen;

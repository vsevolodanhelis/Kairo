import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import GlassContainer from '../common/GlassContainer';
import StatRow from './StatRow';

interface StatItem {
  label: string;
  value: string | number;
  progress?: number;
  color?: string;
}

interface StatGroupProps {
  title: string;
  stats: StatItem[];
}

const StatGroup: React.FC<StatGroupProps> = ({ title, stats }) => {
  const theme = useTheme();
  
  return (
    <GlassContainer style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatRow
            key={index}
            label={stat.label}
            value={stat.value}
            progress={stat.progress}
            color={stat.color}
          />
        ))}
      </View>
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    marginTop: 8,
  },
});

export default StatGroup;

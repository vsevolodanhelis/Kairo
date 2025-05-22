import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';

interface StatRowProps {
  label: string;
  value: string | number;
  progress?: number; // 0 to 1
  color?: string;
}

const StatRow: React.FC<StatRowProps> = ({ 
  label, 
  value, 
  progress, 
  color 
}) => {
  const theme = useTheme();
  const barColor = color || theme.colors.primary;
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
          {value}
        </Text>
      </View>
      
      {progress !== undefined && (
        <ProgressBar 
          progress={progress} 
          color={barColor}
          style={styles.progressBar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

export default StatRow;

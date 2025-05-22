import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import GlassContainer from '../common/GlassContainer';

interface ChartData {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
}

interface ProgressChartProps {
  title: string;
  data: ChartData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ title, data }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width - 64; // Adjust for padding
  
  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);
  
  // If no data, show empty state
  if (filteredData.length === 0) {
    return (
      <GlassContainer style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            No data available
          </Text>
        </View>
      </GlassContainer>
    );
  }
  
  return (
    <GlassContainer style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={filteredData}
          width={screenWidth}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => theme.colors.onSurface,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
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
  chartContainer: {
    alignItems: 'center',
  },
  emptyContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default ProgressChart;

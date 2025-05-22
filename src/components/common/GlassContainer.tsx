import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GlassContainer: React.FC<GlassContainerProps> = ({ children, style }) => {
  const theme = useTheme();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.dark 
            ? 'rgba(30, 30, 30, 0.7)' 
            : 'rgba(255, 255, 255, 0.7)',
          borderColor: theme.dark 
            ? 'rgba(60, 60, 60, 0.5)' 
            : 'rgba(255, 255, 255, 0.8)',
          shadowColor: theme.dark 
            ? '#000' 
            : 'rgba(0, 0, 0, 0.1)',
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default GlassContainer;

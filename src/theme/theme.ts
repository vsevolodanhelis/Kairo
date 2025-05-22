import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Define custom colors
const customColors = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  error: '#B3261E',
  background: '#F6F6F6',
  surface: '#FFFFFF',
  surfaceVariant: '#E7E0EC',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
};

// Define custom dark colors
const customDarkColors = {
  primary: '#D0BCFF',
  secondary: '#CCC2DC',
  tertiary: '#EFB8C8',
  error: '#F2B8B5',
  background: '#1C1B1F',
  surface: '#121212',
  surfaceVariant: '#49454F',
  onPrimary: '#381E72',
  onSecondary: '#332D41',
  onTertiary: '#492532',
  onBackground: '#E6E1E5',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
};

// Create light theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
};

// Create dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customDarkColors,
  },
};

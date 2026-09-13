import { Appearance } from 'react-native';

const isDark = Appearance.getColorScheme() === 'dark';

export const colors = {
  secondary: '#1C8DA3',
  accent: '#F4A261',
  danger: '#E63946',
  
  primary: isDark ? '#E2E8F0' : '#0B2545',
  background: isDark ? '#121212' : '#F4F7F6',
  surface: isDark ? '#1E1E1E' : '#FFFFFF',
  text: isDark ? '#F8F9FA' : '#0B2545',
  textLight: isDark ? '#A0AEC0' : '#6C757D',
};
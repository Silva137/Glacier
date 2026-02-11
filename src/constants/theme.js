// Glacier App Theme Constants

export const COLORS = {
  // Primary palette - Glacier blues and teals
  primary: '#4a8a9a',
  primaryLight: '#7bc5a3',
  primaryDark: '#1a3a4a',
  
  // Background gradients
  backgroundDark: '#0a1a2a',
  backgroundMid: '#1a2a3a',
  backgroundLight: '#2a5a6a',
  
  // UI colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textDim: 'rgba(255, 255, 255, 0.4)',
  
  // Accent colors
  accent: '#7bc5a3',
  accentDim: 'rgba(122, 197, 163, 0.2)',
  accentBorder: 'rgba(122, 197, 163, 0.3)',
  
  // Surface colors
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceLight: 'rgba(255, 255, 255, 0.1)',
  surfaceBorder: 'rgba(255, 255, 255, 0.1)',
  
  // Player colors
  playerBackground: 'rgba(30, 50, 70, 0.98)',
  progressTrack: 'rgba(255, 255, 255, 0.15)',
  
  // Error/Warning
  error: '#e88888',
  errorBg: 'rgba(200, 100, 100, 0.2)',
  errorBorder: 'rgba(200, 100, 100, 0.3)',
};

export const GRADIENTS = {
  aurora: ['#1a3a4a', '#2d5a6b', '#4a8b7c', '#7bc5a3'],
  night: ['#0a1628', '#1a3a52', '#2d5a6b'],
  dawn: ['#2d3a52', '#5a6b8a', '#8a9bb5', '#c4d4e8'],
  ocean: ['#0f2027', '#203a43', '#2c5364'],
  mountain: ['#1a2a3a', '#3a5a6a', '#6a8a9a', '#9ab5c5'],
  twilight: ['#1a1a2e', '#2d3a52', '#4a5a7a', '#6a7a9a'],
  clouds: ['#3a4a5a', '#5a6a7a', '#8a9aaa', '#b5c5d5'],
  stars: ['#0a0a1a', '#1a2a3a', '#2a3a4a'],
  galaxy: ['#0f0c29', '#302b63', '#24243e'],
  horizon: ['#1a2a3a', '#3a5a7a', '#5a7a9a', '#8aaacc'],
  splash: ['#0a1a2a', '#1a3a4a', '#2a5a6a', '#4a8a9a'],
  player: ['#0a1a2a', '#1a3a4a', '#2a5a6a'],
  background: ['#0a1a2a', '#1a2a3a'],
  premium: ['rgba(74, 138, 154, 0.3)', 'rgba(123, 197, 163, 0.3)'],
  button: ['#4a8a9a', '#7bc5a3'],
};

export const FONTS = {
  // Using system fonts that look similar to our design fonts
  // In production, you'd add custom fonts via react-native.config.js
  heading: {
    fontFamily: 'System', // Replace with 'Cormorant-Garamond' when fonts are added
    fontWeight: '300',
  },
  headingMedium: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  body: {
    fontFamily: 'System', // Replace with 'NunitoSans-Regular' when fonts are added
    fontWeight: '400',
  },
  bodySemiBold: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  bodyBold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
};

export const SIZES = {
  // Padding
  paddingXS: 4,
  paddingSM: 8,
  paddingMD: 12,
  paddingLG: 16,
  paddingXL: 20,
  paddingXXL: 24,
  padding3XL: 32,
  
  // Border radius
  radiusSM: 8,
  radiusMD: 12,
  radiusLG: 16,
  radiusXL: 20,
  radiusXXL: 24,
  radiusFull: 9999,
  
  // Font sizes
  fontXS: 10,
  fontSM: 12,
  fontMD: 14,
  fontLG: 16,
  fontXL: 18,
  font2XL: 20,
  font3XL: 24,
  font4XL: 28,
  font5XL: 32,
  font6XL: 36,
  font7XL: 48,
  
  // Icon sizes
  iconSM: 16,
  iconMD: 20,
  iconLG: 24,
  iconXL: 28,
  iconXXL: 32,
  
  // Component heights
  buttonHeight: 48,
  inputHeight: 52,
  tabBarHeight: 80,
  miniPlayerHeight: 64,
  headerHeight: 100,
  
  // Album/Card sizes
  albumSmall: 140,
  albumMedium: 150,
  albumLarge: 280,
  trackThumbnail: 50,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  player: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 10,
  },
  album: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.4,
    shadowRadius: 80,
    elevation: 15,
  },
};

export default {
  COLORS,
  GRADIENTS,
  FONTS,
  SIZES,
  SHADOWS,
};

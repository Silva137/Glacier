import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRADIENTS } from '../constants/theme';

const GradientBackground = ({ 
  type = 'background', 
  colors, 
  style, 
  children,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  ...props 
}) => {
  const gradientColors = colors || GRADIENTS[type] || GRADIENTS.background;
  
  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;

import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const TabButton = ({ 
  label, 
  isActive = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isActive && styles.active,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.paddingXL,
    paddingVertical: SIZES.paddingSM + 2,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXXL,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginRight: SIZES.paddingSM,
  },
  active: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accentBorder,
  },
  label: {
    fontSize: SIZES.fontMD,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  activeLabel: {
    color: COLORS.accent,
  },
});

export default TabButton;

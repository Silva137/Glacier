import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CategoryButton = ({ 
  category, 
  onPress, 
  isSelected = false,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSelected && styles.selected,
        style,
      ]}
      onPress={() => onPress?.(category)}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.name, isSelected && styles.selectedText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingXL,
    paddingVertical: SIZES.paddingMD,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXXL,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    gap: SIZES.paddingSM,
    marginRight: SIZES.paddingMD,
  },
  selected: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accentBorder,
  },
  icon: {
    fontSize: 18,
  },
  name: {
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  selectedText: {
    color: COLORS.accent,
  },
});

export default CategoryButton;

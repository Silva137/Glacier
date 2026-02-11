import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';

const SessionCard = ({ 
  session, 
  onPress, 
  size = 'medium',
  showDescription = false,
}) => {
  const gradientType = session.image || 'twilight';
  
  const dimensions = {
    small: 120,
    medium: 140,
    large: 160,
  };
  
  const cardSize = dimensions[size] || dimensions.medium;

  return (
    <TouchableOpacity 
      style={[styles.container, { width: cardSize }]}
      onPress={() => onPress?.(session)}
      activeOpacity={0.8}
    >
      {/* Session Art */}
      <LinearGradient
        colors={GRADIENTS[gradientType] || GRADIENTS.twilight}
        style={[styles.artwork, { width: cardSize, height: cardSize }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{session.duration}</Text>
        </View>
      </LinearGradient>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {session.title}
        </Text>
        {showDescription && session.description && (
          <Text style={styles.description} numberOfLines={1}>
            {session.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SIZES.paddingLG,
  },
  artwork: {
    borderRadius: SIZES.radiusXL,
    marginBottom: SIZES.paddingMD,
    justifyContent: 'flex-end',
    padding: SIZES.paddingMD,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: SIZES.paddingSM + 2,
    paddingVertical: SIZES.paddingXS,
    borderRadius: SIZES.radiusMD,
  },
  durationText: {
    fontSize: SIZES.fontSM,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  info: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default SessionCard;

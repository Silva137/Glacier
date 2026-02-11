import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';

const AlbumCard = ({ 
  item, 
  onPress, 
  size = 'medium', // 'small', 'medium', 'large'
  showInfo = true,
  showBadge = false,
  badgeText = '',
}) => {
  const gradientType = item.image || 'aurora';
  
  const dimensions = {
    small: 120,
    medium: 150,
    large: 160,
  };
  
  const cardSize = dimensions[size] || dimensions.medium;

  return (
    <TouchableOpacity 
      style={[styles.container, { width: cardSize }]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
    >
      {/* Album Art */}
      <LinearGradient
        colors={GRADIENTS[gradientType] || GRADIENTS.aurora}
        style={[styles.artwork, { width: cardSize, height: cardSize }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {showBadge && badgeText && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Info */}
      {showInfo && (
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.artist || `${item.tracks} tracks`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SIZES.paddingLG,
  },
  artwork: {
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.paddingMD,
    justifyContent: 'flex-end',
    padding: SIZES.paddingMD,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: SIZES.paddingSM,
    paddingVertical: SIZES.paddingXS,
    borderRadius: SIZES.radiusSM,
  },
  badgeText: {
    fontSize: SIZES.fontXS,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  info: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
  },
});

export default AlbumCard;

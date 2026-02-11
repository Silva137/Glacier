import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { ALBUMS } from '../constants/data';

const TrackItem = ({ 
  track, 
  onPress, 
  showFavorite = true,
  showDuration = true,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  const { toggleFavorite, isFavorite, playTrack } = usePlayer();
  
  const album = ALBUMS.find(a => a.id === track.albumId);
  const gradientType = album?.image || 'aurora';
  const favorite = isFavorite(track);

  const handlePress = () => {
    if (onPress) {
      onPress(track);
    } else {
      playTrack(track);
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  const thumbnailSize = size === 'small' ? 44 : size === 'large' ? 56 : 50;
  const titleSize = size === 'small' ? SIZES.fontSM : SIZES.fontMD + 1;
  const subtitleSize = size === 'small' ? SIZES.fontXS : SIZES.fontSM;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Album Art Thumbnail */}
      <LinearGradient
        colors={GRADIENTS[gradientType] || GRADIENTS.aurora}
        style={[styles.thumbnail, { width: thumbnailSize, height: thumbnailSize }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Track Info */}
      <View style={styles.info}>
        <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={[styles.subtitle, { fontSize: subtitleSize }]} numberOfLines={1}>
          {track.album || track.artist || 'Glacier'}
        </Text>
      </View>

      {/* Duration */}
      {showDuration && track.duration && (
        <Text style={styles.duration}>{track.duration}</Text>
      )}

      {/* Favorite Button */}
      {showFavorite && (
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon 
            name={favorite ? 'heart' : 'heart-outline'} 
            size={20} 
            color={favorite ? COLORS.accent : COLORS.textDim} 
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingMD,
    gap: SIZES.paddingLG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  thumbnail: {
    borderRadius: SIZES.radiusMD,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginTop: 2,
  },
  duration: {
    fontSize: SIZES.fontSM,
    color: COLORS.textDim,
  },
  favoriteButton: {
    padding: SIZES.paddingXS,
  },
});

export default TrackItem;

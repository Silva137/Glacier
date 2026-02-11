import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 100;

const MiniPlayer = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isDismissing, setIsDismissing] = useState(false);
  
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    togglePlayPause, 
    pause,
    playNext,
    playPrevious,
    clearTrack,
  } = usePlayer();
  
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          setIsDismissing(true);
          const direction = gestureState.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
          Animated.timing(translateX, {
            toValue: direction,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            pause();
            if (clearTrack) clearTrack();
            setIsDismissing(false);
            translateX.setValue(0);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  if (!currentTrack || isDismissing) return null;

  const handlePress = () => {
    navigation.navigate('Player');
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (playPrevious) playPrevious();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (playNext) playNext();
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    togglePlayPause();
  };

  const bottomPosition = SIZES.tabBarHeight + insets.bottom + 10;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          bottom: bottomPosition,
          transform: [{ translateX }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        {/* Album Art */}
        <LinearGradient
          colors={GRADIENTS.aurora}
          style={styles.albumArt}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist || 'Glacier'}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handlePrevious}
          >
            <Icon name="play-skip-back" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play'} 
              size={20} 
              color={COLORS.white} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleNext}
          >
            <Icon name="play-skip-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: SIZES.paddingMD,
    right: SIZES.paddingMD,
  },
  container: {
    width: '100%',
    height: SIZES.miniPlayerHeight,
    backgroundColor: COLORS.playerBackground,
    borderRadius: SIZES.radiusLG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SIZES.paddingLG,
    paddingRight: SIZES.paddingSM,
    gap: SIZES.paddingMD,
    ...SHADOWS.medium,
  },
  albumArt: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusSM + 2,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  artist: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: SIZES.paddingLG,
    right: SIZES.paddingLG,
    height: 2,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 1,
  },
});

export default MiniPlayer;

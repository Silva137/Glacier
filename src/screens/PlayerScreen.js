import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS, SHADOWS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';
import SleepTimerModal from './modals/SleepTimerModal';
import PremiumModal from './modals/PremiumModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD_X = 80;
const SWIPE_THRESHOLD_Y = 120;

const PlayerScreen = ({ navigation }) => {
  const { 
    currentTrack, 
    isPlaying, 
    progress,
    currentTime,
    duration,
    togglePlayPause,
    toggleFavorite,
    isFavorite,
    isDownloaded,
    addToDownloads,
    sleepTimerActive,
    sleepTimer,
    playNext,
    playPrevious,
    startSeeking,
    seekTo,
    repeatMode,
    toggleRepeat,
    shuffleEnabled,
    toggleShuffle,
  } = usePlayer();

  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  // Sync slider with progress when not sliding
  useEffect(() => {
    if (!isSliding) {
      setSliderValue(progress);
    }
  }, [progress, isSliding]);

  // Swipe animations
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 15 || Math.abs(gestureState.dy) > 15;
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          translateX.setValue(gestureState.dx);
          const newOpacity = Math.max(0.7, 1 - Math.abs(gestureState.dx) / (SCREEN_WIDTH / 2));
          opacity.setValue(newOpacity);
        } else if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          const newOpacity = Math.max(0.5, 1 - gestureState.dy / SWIPE_THRESHOLD_Y);
          opacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > SWIPE_THRESHOLD_X) {
            Animated.timing(translateX, {
              toValue: SCREEN_WIDTH,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              if (playPrevious) playPrevious();
              translateX.setValue(-SCREEN_WIDTH);
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
              }).start();
            });
          } else if (gestureState.dx < -SWIPE_THRESHOLD_X) {
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              if (playNext) playNext();
              translateX.setValue(SCREEN_WIDTH);
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
              }).start();
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }).start();
          }
        } else if (gestureState.dy > SWIPE_THRESHOLD_Y) {
          navigation.goBack();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
          }).start();
        }
        
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Sound wave animation
  const waveAnims = useRef([...Array(5)].map(() => new Animated.Value(8))).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = waveAnims.map((anim, i) => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 24, duration: 400 + i * 100, useNativeDriver: false }),
            Animated.timing(anim, { toValue: 8, duration: 400 + i * 100, useNativeDriver: false }),
          ])
        )
      );
      animations.forEach(a => a.start());
      return () => animations.forEach(a => a.stop());
    } else {
      waveAnims.forEach(a => a.setValue(8));
    }
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <GradientBackground type="player">
        <SafeAreaView style={styles.container}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No track selected</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.browseButtonText}>Browse Music</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate display time based on slider position when sliding
  const displayTime = isSliding 
    ? Math.floor((sliderValue / 100) * duration) 
    : currentTime;

  const handleSliderStart = () => {
    setIsSliding(true);
    startSeeking(); // Pause progress updates in context
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleSliderComplete = (value) => {
    seekTo(value); // This also sets isSeeking to false
    setIsSliding(false);
  };

  const favorite = isFavorite(currentTrack);
  const downloaded = isDownloaded(currentTrack);

  const handleDownload = () => {
    if (downloaded) {
      Alert.alert('Already Downloaded', 'This track is already in your downloads.');
      return;
    }

    const result = addToDownloads(currentTrack);
    
    if (result.success) {
      Alert.alert('Downloaded!', `"${currentTrack.title}" has been added to your downloads.`);
    } else if (result.reason === 'limit_reached') {
      setShowPremium(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎵 Check out "${currentTrack.title}" by ${currentTrack.artist || 'Glacier'} on Glacier App!`,
        title: `Share ${currentTrack.title}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this moment.');
    }
  };

  return (
    <GradientBackground type="player">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Icon name="chevron-down" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>NOW PLAYING</Text>
            <Text style={styles.swipeHintHeader}>↓ Swipe down to close</Text>
          </View>
          <TouchableOpacity 
            style={[styles.headerButton, sleepTimerActive && styles.timerActive]}
            onPress={() => setShowSleepTimer(true)}
          >
            <Icon name="moon" size={24} color={sleepTimerActive ? COLORS.accent : COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Swipeable Content */}
        <Animated.View 
          style={[
            styles.swipeableContent,
            {
              transform: [{ translateX }, { translateY }],
              opacity,
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Album Art */}
          <View style={styles.artworkContainer}>
            <LinearGradient
              colors={GRADIENTS.aurora}
              style={styles.artwork}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isPlaying && (
                <View style={styles.soundWaves}>
                  {waveAnims.map((anim, i) => (
                    <Animated.View 
                      key={i} 
                      style={[styles.wave, { height: anim }]} 
                    />
                  ))}
                </View>
              )}
            </LinearGradient>
            <Text style={styles.swipeHint}>← Swipe for next/previous →</Text>
          </View>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist || 'Glacier'}</Text>
          </View>
        </Animated.View>

        {/* Progress Slider */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={sliderValue}
            onSlidingStart={handleSliderStart}
            onValueChange={handleSliderChange}
            onSlidingComplete={handleSliderComplete}
            minimumTrackTintColor={COLORS.accent}
            maximumTrackTintColor={COLORS.progressTrack}
            thumbTintColor={COLORS.accent}
          />
          <View style={styles.progressTimes}>
            <Text style={styles.progressTime}>{formatTime(displayTime)}</Text>
            <Text style={styles.progressTime}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Shuffle */}
          <TouchableOpacity 
            style={styles.secondaryControlButton} 
            onPress={toggleShuffle}
          >
            <Icon 
              name="shuffle" 
              size={22} 
              color={shuffleEnabled ? COLORS.accent : COLORS.textMuted} 
            />
          </TouchableOpacity>

          {/* Previous */}
          <TouchableOpacity style={styles.controlButton} onPress={playPrevious}>
            <Icon name="play-skip-back" size={32} color={COLORS.white} />
          </TouchableOpacity>
          
          {/* Play/Pause */}
          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePlayPause}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.button}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon 
                name={isPlaying ? 'pause' : 'play'} 
                size={32} 
                color={COLORS.white} 
                style={!isPlaying && { marginLeft: 4 }}
              />
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Next */}
          <TouchableOpacity style={styles.controlButton} onPress={playNext}>
            <Icon name="play-skip-forward" size={32} color={COLORS.white} />
          </TouchableOpacity>

          {/* Repeat */}
          <TouchableOpacity 
            style={styles.secondaryControlButton} 
            onPress={toggleRepeat}
          >
            <View>
              <Icon 
                name="repeat" 
                size={22} 
                color={repeatMode !== 'off' ? COLORS.accent : COLORS.textMuted} 
              />
              {repeatMode === 'one' && (
                <View style={styles.repeatOneBadge}>
                  <Text style={styles.repeatOneText}>1</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleFavorite(currentTrack)}
          >
            <Icon 
              name={favorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={favorite ? COLORS.accent : COLORS.textMuted} 
            />
            <Text style={[styles.actionLabel, favorite && styles.actionLabelActive]}>Favorite</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Icon 
              name={downloaded ? 'download' : 'download-outline'} 
              size={24} 
              color={downloaded ? COLORS.accent : COLORS.textMuted} 
            />
            <Text style={[styles.actionLabel, downloaded && styles.actionLabelActive]}>
              {downloaded ? 'Downloaded' : 'Download'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Icon name="share-outline" size={24} color={COLORS.textMuted} />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SleepTimerModal 
        visible={showSleepTimer} 
        onClose={() => setShowSleepTimer(false)} 
      />

      <PremiumModal 
        visible={showPremium} 
        onClose={() => setShowPremium(false)} 
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SIZES.paddingXXL },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SIZES.paddingLG,
    marginBottom: 10,
  },
  headerButton: { padding: SIZES.paddingSM, borderRadius: SIZES.radiusSM },
  timerActive: { backgroundColor: COLORS.accentDim },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted, letterSpacing: 2 },
  swipeHintHeader: { fontSize: 10, color: COLORS.textDim, marginTop: 2 },
  
  swipeableContent: { alignItems: 'center' },
  
  artworkContainer: { alignItems: 'center', marginBottom: 16 },
  artwork: {
    width: 260,
    height: 260,
    borderRadius: SIZES.radiusXXL,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    ...SHADOWS.album,
  },
  soundWaves: { flexDirection: 'row', gap: 4, alignItems: 'flex-end' },
  wave: { width: 4, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 2 },
  swipeHint: { fontSize: SIZES.fontXS, color: COLORS.textDim, marginTop: SIZES.paddingMD },
  
  trackInfo: { alignItems: 'center', marginBottom: 16 },
  trackTitle: { fontSize: SIZES.font3XL, fontWeight: '300', color: COLORS.textPrimary, textAlign: 'center' },
  trackArtist: { fontSize: SIZES.fontMD, color: COLORS.textMuted, marginTop: SIZES.paddingSM },
  
  // Progress
  progressContainer: { marginBottom: 16, paddingHorizontal: SIZES.paddingSM },
  slider: {
    width: '100%',
    height: 40,
  },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SIZES.paddingSM },
  progressTime: { fontSize: SIZES.fontSM, color: COLORS.textMuted },
  
  // Controls
  controls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 16, 
    marginBottom: 20,
  },
  secondaryControlButton: { 
    padding: SIZES.paddingSM,
    width: 44,
    alignItems: 'center',
  },
  controlButton: { padding: SIZES.paddingSM },
  playButton: { ...SHADOWS.medium },
  playButtonGradient: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  repeatOneBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accent,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  // Actions
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 48 },
  actionButton: { alignItems: 'center', gap: 4 },
  actionLabel: { fontSize: SIZES.fontXS + 1, color: COLORS.textMuted },
  actionLabelActive: { color: COLORS.accent },
  
  // Empty State
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: SIZES.fontLG, color: COLORS.textMuted, marginBottom: SIZES.paddingXL },
  browseButton: { backgroundColor: COLORS.primary, paddingHorizontal: SIZES.paddingXXL, paddingVertical: SIZES.paddingMD, borderRadius: SIZES.radiusXXL },
  browseButtonText: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.white },
});

export default PlayerScreen;

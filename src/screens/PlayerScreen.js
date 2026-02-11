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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS, SHADOWS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';
import SleepTimerModal from './modals/SleepTimerModal';
import PremiumModal from './modals/PremiumModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD_X = 80;
const SWIPE_THRESHOLD_Y = 120;

const PlayerScreen = ({ navigation }) => {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    togglePlayPause,
    toggleFavorite,
    isFavorite,
    isDownloaded,
    addToDownloads,
    sleepTimerActive,
    sleepTimer,
    playNext,
    playPrevious,
  } = usePlayer();

  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  // Swipe animations
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Pan responder for swipe gestures (left/right for tracks, down to close)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Respond to swipes
        return Math.abs(gestureState.dx) > 15 || Math.abs(gestureState.dy) > 15;
      },
      onPanResponderMove: (_, gestureState) => {
        // Horizontal swipe for track change
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          translateX.setValue(gestureState.dx);
          const newOpacity = Math.max(0.7, 1 - Math.abs(gestureState.dx) / (SCREEN_WIDTH / 2));
          opacity.setValue(newOpacity);
        } 
        // Vertical swipe down to close
        else if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          const newOpacity = Math.max(0.5, 1 - gestureState.dy / SWIPE_THRESHOLD_Y);
          opacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Horizontal swipe - change track
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > SWIPE_THRESHOLD_X) {
            // Swipe right - previous track
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
            // Swipe left - next track
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
            // Snap back
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }).start();
          }
        }
        // Vertical swipe down - close screen
        else if (gestureState.dy > SWIPE_THRESHOLD_Y) {
          navigation.goBack();
        } else {
          // Snap back
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

  const formatTime = (percent) => {
    const totalSeconds = Math.floor(percent * 0.045 * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
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
    } else if (result.reason === 'already_downloaded') {
      Alert.alert('Already Downloaded', 'This track is already in your downloads.');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `🎵 Check out "${currentTrack.title}" by ${currentTrack.artist || 'Glacier'} on Glacier App!\n\nDownload Glacier for relaxing music and meditation sounds.`,
        title: `Share ${currentTrack.title}`,
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this moment.');
    }
  };

  const handlePrevious = () => {
    if (playPrevious) playPrevious();
  };

  const handleNext = () => {
    if (playNext) playNext();
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
              {/* Sound Waves */}
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
            
            {/* Swipe hint */}
            <Text style={styles.swipeHint}>← Swipe for next/previous →</Text>
          </View>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist || 'Glacier'}</Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#4a8a9a', '#7bc5a3']}
              style={[styles.progressBar, { width: `${progress}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <View style={styles.progressTimes}>
            <Text style={styles.progressTime}>{formatTime(progress)}</Text>
            <Text style={styles.progressTime}>{currentTrack.duration || '4:32'}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
            <Icon name="play-skip-back" size={32} color={COLORS.white} />
          </TouchableOpacity>
          
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
          
          <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
            <Icon name="play-skip-forward" size={32} color={COLORS.white} />
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

      {/* Sleep Timer Modal */}
      <SleepTimerModal 
        visible={showSleepTimer} 
        onClose={() => setShowSleepTimer(false)} 
      />

      {/* Premium Modal */}
      <PremiumModal 
        visible={showPremium} 
        onClose={() => setShowPremium(false)} 
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SIZES.paddingXXL },
  
  // Header
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
  
  // Swipeable content
  swipeableContent: {
    alignItems: 'center',
  },
  
  // Artwork
  artworkContainer: { alignItems: 'center', marginBottom: 20 },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: SIZES.radiusXXL,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    ...SHADOWS.album,
  },
  soundWaves: { flexDirection: 'row', gap: 4, alignItems: 'flex-end' },
  wave: { width: 4, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 2 },
  swipeHint: {
    fontSize: SIZES.fontXS,
    color: COLORS.textDim,
    marginTop: SIZES.paddingMD,
  },
  
  // Track Info
  trackInfo: { alignItems: 'center', marginBottom: 20 },
  trackTitle: { fontSize: SIZES.font4XL, fontWeight: '300', color: COLORS.textPrimary, textAlign: 'center' },
  trackArtist: { fontSize: SIZES.fontMD + 1, color: COLORS.textMuted, marginTop: SIZES.paddingSM },
  
  // Progress
  progressContainer: { marginBottom: 20, paddingHorizontal: SIZES.paddingMD },
  progressTrack: { height: 4, backgroundColor: COLORS.progressTrack, borderRadius: 2, marginBottom: SIZES.paddingSM },
  progressBar: { height: '100%', borderRadius: 2 },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTime: { fontSize: SIZES.fontSM, color: COLORS.textMuted },
  
  // Controls
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 20 },
  controlButton: { padding: SIZES.paddingSM },
  playButton: { ...SHADOWS.medium },
  playButtonGradient: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  
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

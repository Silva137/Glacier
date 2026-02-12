import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS, SHADOWS } from '../constants/theme';
import { TRACKS } from '../constants/data';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground, TrackItem } from '../components';

const AlbumDetailScreen = ({ route, navigation }) => {
  const { album } = route.params;
  const { playTrack, currentTrack, setPlayQueue } = usePlayer();
  const insets = useSafeAreaInsets();

  // Get tracks for this album
  const albumTracks = TRACKS.filter(t => t.albumId === album.id);

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handlePlayAll = () => {
    if (albumTracks.length > 0) {
      // Set queue to album tracks
      if (setPlayQueue) setPlayQueue(albumTracks);
      playTrack(albumTracks[0]);
    }
  };

  const handleShuffle = () => {
    if (albumTracks.length > 0) {
      // Shuffle the tracks
      const shuffled = [...albumTracks].sort(() => Math.random() - 0.5);
      if (setPlayQueue) setPlayQueue(shuffled);
      playTrack(shuffled[0]);
    }
  };

  const handleTrackPress = (track) => {
    // Set queue to album tracks starting from this track
    if (setPlayQueue) setPlayQueue(albumTracks);
    playTrack(track);
  };

  return (
    <GradientBackground type="background">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Album Art */}
          <View style={styles.artContainer}>
            <LinearGradient
              colors={GRADIENTS[album.image] || GRADIENTS.aurora}
              style={styles.albumArt}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>

          {/* Album Info */}
          <View style={styles.albumInfo}>
            <Text style={styles.albumTitle}>{album.title}</Text>
            <Text style={styles.albumArtist}>{album.artist || 'Glacier'}</Text>
            <Text style={styles.albumMeta}>{album.tracks || albumTracks.length} tracks</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.shuffleButton}
              onPress={handleShuffle}
            >
              <Icon name="shuffle" size={20} color={COLORS.textPrimary} />
              <Text style={styles.shuffleText}>Shuffle</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.playAllButton}
              onPress={handlePlayAll}
            >
              <LinearGradient
                colors={GRADIENTS.button}
                style={styles.playAllGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="play" size={22} color={COLORS.white} />
                <Text style={styles.playAllText}>Play All</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Tracks List */}
          <View style={styles.tracksSection}>
            <Text style={styles.sectionTitle}>Tracks</Text>
            {albumTracks.length > 0 ? (
              albumTracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onPress={handleTrackPress}
                  index={index + 1}
                />
              ))
            ) : (
              <Text style={styles.noTracks}>No tracks available</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {},
  
  header: {
    paddingHorizontal: SIZES.paddingXXL,
    paddingTop: SIZES.paddingLG,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  artContainer: {
    alignItems: 'center',
    marginTop: SIZES.paddingXXL,
    marginBottom: SIZES.paddingXXL,
  },
  albumArt: {
    width: 220,
    height: 220,
    borderRadius: SIZES.radiusXXL,
    ...SHADOWS.album,
  },
  
  albumInfo: {
    alignItems: 'center',
    marginBottom: SIZES.paddingXXL,
  },
  albumTitle: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  albumArtist: {
    fontSize: SIZES.fontLG,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingSM,
  },
  albumMeta: {
    fontSize: SIZES.fontMD,
    color: COLORS.textDim,
    marginTop: SIZES.paddingXS,
  },
  
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.padding3XL,
    gap: SIZES.paddingMD,
  },
  shuffleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXL,
    paddingVertical: SIZES.paddingLG,
    gap: SIZES.paddingSM,
  },
  shuffleText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  playAllButton: {
    flex: 1,
    borderRadius: SIZES.radiusXL,
    overflow: 'hidden',
  },
  playAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.paddingLG,
    gap: SIZES.paddingSM,
  },
  playAllText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.white,
  },
  
  tracksSection: {
    paddingHorizontal: SIZES.paddingXXL,
  },
  sectionTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingLG,
  },
  noTracks: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SIZES.padding3XL,
  },
});

export default AlbumDetailScreen;

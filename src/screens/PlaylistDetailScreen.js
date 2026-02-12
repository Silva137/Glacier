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

const PlaylistDetailScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const { playTrack, currentTrack, setPlayQueue } = usePlayer();
  const insets = useSafeAreaInsets();

  // Get tracks - either from trackList (user playlist) or sample tracks
  const playlistTracks = playlist.trackList || TRACKS.slice(0, playlist.tracks || 5);

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      if (setPlayQueue) setPlayQueue(playlistTracks);
      playTrack(playlistTracks[0]);
    }
  };

  const handleShuffle = () => {
    if (playlistTracks.length > 0) {
      const shuffled = [...playlistTracks].sort(() => Math.random() - 0.5);
      if (setPlayQueue) setPlayQueue(shuffled);
      playTrack(shuffled[0]);
    }
  };

  const handleTrackPress = (track) => {
    if (setPlayQueue) setPlayQueue(playlistTracks);
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

          {/* Playlist Art */}
          <View style={styles.artContainer}>
            <LinearGradient
              colors={GRADIENTS[playlist.image] || GRADIENTS.night}
              style={styles.playlistArt}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="musical-notes" size={64} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
          </View>

          {/* Playlist Info */}
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistTitle}>{playlist.title}</Text>
            <Text style={styles.playlistMeta}>
              {playlist.tracks || playlistTracks.length} tracks • Playlist
            </Text>
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
            {playlistTracks.length > 0 ? (
              playlistTracks.map((track, index) => (
                <TrackItem
                  key={track.id || index}
                  track={track}
                  onPress={handleTrackPress}
                  index={index + 1}
                />
              ))
            ) : (
              <Text style={styles.noTracks}>No tracks in this playlist</Text>
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
  playlistArt: {
    width: 200,
    height: 200,
    borderRadius: SIZES.radiusXXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.album,
  },
  
  playlistInfo: {
    alignItems: 'center',
    marginBottom: SIZES.paddingXXL,
  },
  playlistTitle: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  playlistMeta: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingSM,
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

export default PlaylistDetailScreen;

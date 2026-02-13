// src/screens/AlbumDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS, SHADOWS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { useData } from '../hooks/useData';
import { GradientBackground, TrackItem } from '../components';

const AlbumDetailScreen = ({ route, navigation }) => {
  const { album } = route.params;
  const { playTrack, currentTrack, setPlayQueue } = usePlayer();
  const { getTracksByAlbum } = useData();
  const insets = useSafeAreaInsets();

  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get tracks for this album
    const albumTracks = getTracksByAlbum(album.id);
    setTracks(albumTracks);
    setIsLoading(false);
  }, [album.id, getTracksByAlbum]);

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setPlayQueue(tracks);
      playTrack(tracks[0], tracks);
    }
  };

  const handleShuffle = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      setPlayQueue(shuffled);
      playTrack(shuffled[0], shuffled);
    }
  };

  const handleTrackPress = (track) => {
    setPlayQueue(tracks);
    playTrack(track, tracks);
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
          <View style={styles.artworkContainer}>
            <LinearGradient
              colors={GRADIENTS[album.gradient] || GRADIENTS.aurora}
              style={styles.artwork}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="musical-notes" size={64} color="rgba(255,255,255,0.3)" />
            </LinearGradient>
          </View>

          {/* Album Info */}
          <View style={styles.albumInfo}>
            <Text style={styles.albumTitle}>{album.title}</Text>
            <Text style={styles.albumArtist}>{album.artist || 'Glacier'}</Text>
            <Text style={styles.albumMeta}>
              {album.trackCount || tracks.length} tracks • {album.totalDuration || 'Various lengths'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.shuffleButton}
              onPress={handleShuffle}
            >
              <Icon name="shuffle" size={20} color={COLORS.white} />
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
                <Icon name="play" size={20} color={COLORS.white} />
                <Text style={styles.playAllText}>Play All</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Tracks List */}
          <View style={styles.tracksSection}>
            <Text style={styles.sectionTitle}>Tracks</Text>
            
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.accent} style={styles.loader} />
            ) : tracks.length > 0 ? (
              tracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onPress={handleTrackPress}
                  showNumber
                  number={index + 1}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No tracks available</Text>
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
  
  // Header
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
  
  // Artwork
  artworkContainer: {
    alignItems: 'center',
    marginTop: SIZES.paddingXXL,
    marginBottom: SIZES.paddingXXL,
  },
  artwork: {
    width: 220,
    height: 220,
    borderRadius: SIZES.radiusXXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.album,
  },
  
  // Album Info
  albumInfo: {
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingXXL,
  },
  albumTitle: {
    fontSize: SIZES.font3XL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  albumArtist: {
    fontSize: SIZES.fontLG,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingSM,
  },
  albumMeta: {
    fontSize: SIZES.fontSM,
    color: COLORS.textDim,
    marginTop: SIZES.paddingXS,
  },
  
  // Actions
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
    color: COLORS.white,
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
  
  // Tracks
  tracksSection: {
    paddingHorizontal: SIZES.paddingXXL,
  },
  sectionTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingLG,
  },
  loader: {
    marginVertical: SIZES.paddingXXL,
  },
  emptyText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SIZES.paddingXXL,
  },
});

export default AlbumDetailScreen;

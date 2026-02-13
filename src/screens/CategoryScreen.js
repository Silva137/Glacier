// src/screens/CategoryScreen.js
import React, { useMemo } from 'react';
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
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { useData } from '../hooks/useData';
import { GradientBackground, TrackItem } from '../components';

const CategoryScreen = ({ route, navigation }) => {
  const { category: categoryId } = route.params;
  const { playTrack, currentTrack, setPlayQueue } = usePlayer();
  const { 
    categories, 
    sessions, 
    tracks, 
    playlists,
    isLoading,
    getSessionsByCategory,
    getTracksByCategory,
  } = useData();
  const insets = useSafeAreaInsets();

  // Get category data
  const category = useMemo(() => {
    return categories.find(c => c.id === categoryId) || {
      id: categoryId,
      title: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
      description: '',
      icon: 'musical-notes',
      gradient: ['#1a2a4a', '#0a1a2a'],
      accentColor: '#6b8cce',
    };
  }, [categories, categoryId]);

  // Get category-specific content
  const categorySessions = useMemo(() => getSessionsByCategory(categoryId), [categoryId, getSessionsByCategory]);
  const categoryTracks = useMemo(() => getTracksByCategory(categoryId), [categoryId, getTracksByCategory]);
  const categoryPlaylists = useMemo(() => playlists.filter(p => p.category === categoryId), [playlists, categoryId]);

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handleSessionPress = (session) => {
    const sessionQueue = categorySessions.map(s => ({
      ...s,
      artist: 'Glacier Session',
      type: 'session',
    }));
    setPlayQueue(sessionQueue);
    
    playTrack({
      ...session,
      artist: 'Glacier Session',
      type: 'session',
    }, sessionQueue);
  };

  const handleTrackPress = (track) => {
    setPlayQueue(categoryTracks);
    playTrack(track, categoryTracks);
  };

  const handlePlaylistPress = (playlist) => {
    if (categoryTracks.length > 0) {
      setPlayQueue(categoryTracks);
      playTrack(categoryTracks[0], categoryTracks);
    }
  };

  if (isLoading) {
    return (
      <GradientBackground type="background">
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

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

          {/* Hero Section */}
          <LinearGradient
            colors={category.gradient || ['#1a2a4a', '#0a1a2a']}
            style={styles.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.heroIcon, { backgroundColor: `${category.accentColor || '#6b8cce'}30` }]}>
              <Icon name={category.icon || 'musical-notes'} size={40} color={category.accentColor || '#6b8cce'} />
            </View>
            <Text style={styles.heroTitle}>{category.title}</Text>
            <Text style={styles.heroSubtitle}>{category.description}</Text>
          </LinearGradient>

          {/* Sessions */}
          {categorySessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sessions</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sessionsContainer}
              >
                {categorySessions.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.sessionCard}
                    onPress={() => handleSessionPress(session)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={GRADIENTS[session.gradient] || GRADIENTS.twilight}
                      style={styles.sessionArt}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.sessionDuration}>
                        <Text style={styles.sessionDurationText}>{session.duration}</Text>
                      </View>
                    </LinearGradient>
                    <Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>
                    <Text style={styles.sessionDescription} numberOfLines={1}>{session.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Playlists */}
          {categoryPlaylists.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Playlists</Text>
              {categoryPlaylists.map(playlist => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.playlistItem}
                  onPress={() => handlePlaylistPress(playlist)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={category.gradient || ['#1a2a4a', '#0a1a2a']}
                    style={styles.playlistArt}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="musical-notes" size={24} color={category.accentColor || '#6b8cce'} />
                  </LinearGradient>
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistTitle}>{playlist.title}</Text>
                    <Text style={styles.playlistSubtitle}>{playlist.trackCount} tracks</Text>
                  </View>
                  <TouchableOpacity style={styles.playButton}>
                    <Icon name="play" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tracks */}
          {categoryTracks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sounds</Text>
              {categoryTracks.map(track => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onPress={handleTrackPress}
                />
              ))}
            </View>
          )}

          {/* Empty state */}
          {categorySessions.length === 0 && categoryTracks.length === 0 && categoryPlaylists.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="musical-notes-outline" size={64} color={COLORS.textDim} />
              <Text style={styles.emptyText}>No content available for this category yet</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  
  // Hero
  hero: {
    marginHorizontal: SIZES.paddingXXL,
    marginTop: SIZES.paddingLG,
    marginBottom: SIZES.padding3XL,
    borderRadius: SIZES.radiusXXL,
    padding: SIZES.padding3XL,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.paddingLG,
  },
  heroTitle: {
    fontSize: SIZES.font4XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingSM,
  },
  heroSubtitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  
  // Section
  section: {
    marginBottom: SIZES.padding3XL,
  },
  sectionTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingLG,
  },
  
  // Sessions
  sessionsContainer: {
    paddingHorizontal: SIZES.paddingXXL,
    gap: SIZES.paddingMD,
  },
  sessionCard: {
    width: 160,
    marginRight: SIZES.paddingMD,
  },
  sessionArt: {
    width: 160,
    height: 160,
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.paddingSM,
    justifyContent: 'flex-end',
    padding: SIZES.paddingMD,
  },
  sessionDuration: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: SIZES.paddingSM,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
  },
  sessionDurationText: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
  },
  sessionTitle: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sessionDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  
  // Playlists
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingMD,
    paddingHorizontal: SIZES.paddingXXL,
    gap: SIZES.paddingMD,
  },
  playlistArt: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: SIZES.fontMD + 1,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  playlistSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: SIZES.paddingXXL,
  },
  emptyText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingLG,
    textAlign: 'center',
  },
});

export default CategoryScreen;

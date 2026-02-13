// src/screens/BrowseScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { useData } from '../hooks/useData';
import {
  GradientBackground,
  TabButton,
  AlbumCard,
  SessionCard,
  TrackItem,
} from '../components';

const TABS = ['all', 'albums', 'playlists', 'sessions', 'podcasts'];

const BrowseScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { playTrack, setPlayQueue } = usePlayer();
  const { 
    tracks, 
    albums, 
    sessions, 
    podcasts, 
    playlists,
    isLoading,
    searchContent,
  } = useData();

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchContent(searchQuery);
  }, [searchQuery, searchContent]);

  const handleAlbumPress = (album) => {
    navigation.navigate('AlbumDetail', { album });
  };

  const handlePlaylistPress = (playlist) => {
    navigation.navigate('PlaylistDetail', { playlist });
  };

  const handleSessionPress = (session) => {
    const sessionQueue = sessions.map(s => ({
      ...s,
      artist: 'Timed Session',
      type: 'session',
    }));
    setPlayQueue(sessionQueue);
    
    playTrack({
      ...session,
      artist: 'Timed Session',
      type: 'session',
    }, sessionQueue);
  };

  const handlePodcastPress = (podcast) => {
    navigation.navigate('PodcastDetail', { podcast });
  };

  const handleTrackPress = (track) => {
    setPlayQueue(tracks);
    playTrack(track, tracks);
  };

  // Loading state
  if (isLoading) {
    return (
      <GradientBackground type="background">
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const { tracks: foundTracks, albums: foundAlbums, sessions: foundSessions, podcasts: foundPodcasts } = searchResults;
    const hasResults = foundTracks.length > 0 || foundAlbums.length > 0 || foundSessions.length > 0 || foundPodcasts.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={48} color={COLORS.textDim} />
          <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
        </View>
      );
    }

    return (
      <>
        {foundAlbums.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Albums</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {foundAlbums.map(album => (
                <AlbumCard key={album.id} item={album} onPress={handleAlbumPress} />
              ))}
            </ScrollView>
          </View>
        )}

        {foundTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tracks</Text>
            <View style={styles.tracksList}>
              {foundTracks.slice(0, 5).map(track => (
                <TrackItem key={track.id} track={track} onPress={handleTrackPress} />
              ))}
            </View>
          </View>
        )}

        {foundSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sessions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {foundSessions.map(session => (
                <SessionCard key={session.id} session={session} onPress={handleSessionPress} />
              ))}
            </ScrollView>
          </View>
        )}
      </>
    );
  };

  const renderContent = () => {
    if (searchQuery.trim()) {
      return renderSearchResults();
    }

    switch (activeTab) {
      case 'albums':
        return (
          <View style={styles.gridContainer}>
            {albums.map(album => (
              <TouchableOpacity
                key={album.id}
                style={styles.gridItem}
                onPress={() => handleAlbumPress(album)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={GRADIENTS[album.gradient] || GRADIENTS.aurora}
                  style={styles.gridItemArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.gridItemTitle} numberOfLines={1}>{album.title}</Text>
                <Text style={styles.gridItemSubtitle}>{album.trackCount} tracks</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'playlists':
        return (
          <View style={styles.gridContainer}>
            {playlists.map(playlist => (
              <TouchableOpacity
                key={playlist.id}
                style={styles.gridItem}
                onPress={() => handlePlaylistPress(playlist)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={GRADIENTS[playlist.gradient] || GRADIENTS.aurora}
                  style={styles.gridItemArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="musical-notes" size={28} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
                <Text style={styles.gridItemTitle} numberOfLines={1}>{playlist.title}</Text>
                <Text style={styles.gridItemSubtitle}>{playlist.trackCount} tracks</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'sessions':
        return (
          <View style={styles.gridContainer}>
            {sessions.map(session => (
              <TouchableOpacity
                key={session.id}
                style={styles.gridItem}
                onPress={() => handleSessionPress(session)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={GRADIENTS[session.gradient] || GRADIENTS.twilight}
                  style={styles.gridItemArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{session.duration}</Text>
                  </View>
                </LinearGradient>
                <Text style={styles.gridItemTitle} numberOfLines={1}>{session.title}</Text>
                <Text style={styles.gridItemSubtitle}>{session.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'podcasts':
        return (
          <View style={styles.listContainer}>
            {podcasts.map(podcast => (
              <TouchableOpacity
                key={podcast.id}
                style={styles.podcastItem}
                onPress={() => handlePodcastPress(podcast)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={GRADIENTS[podcast.gradient] || GRADIENTS.horizon}
                  style={styles.podcastArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="mic" size={24} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
                <View style={styles.podcastInfo}>
                  <Text style={styles.podcastTitle}>{podcast.title}</Text>
                  <Text style={styles.podcastSubtitle}>{podcast.episodeCount} episodes</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        );

      default: // 'all'
        return (
          <>
            {/* Albums Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Albums</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {albums.slice(0, 6).map(album => (
                  <AlbumCard key={album.id} item={album} onPress={handleAlbumPress} />
                ))}
              </ScrollView>
            </View>

            {/* Sessions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sessions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {sessions.slice(0, 6).map(session => (
                  <SessionCard key={session.id} session={session} onPress={handleSessionPress} />
                ))}
              </ScrollView>
            </View>

            {/* Podcasts Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Podcasts</Text>
              {podcasts.slice(0, 3).map(podcast => (
                <TouchableOpacity
                  key={podcast.id}
                  style={styles.podcastItem}
                  onPress={() => handlePodcastPress(podcast)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={GRADIENTS[podcast.gradient] || GRADIENTS.horizon}
                    style={styles.podcastArt}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="mic" size={24} color="rgba(255,255,255,0.8)" />
                  </LinearGradient>
                  <View style={styles.podcastInfo}>
                    <Text style={styles.podcastTitle}>{podcast.title}</Text>
                    <Text style={styles.podcastSubtitle}>{podcast.episodeCount} episodes</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Popular Tracks */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Tracks</Text>
              <View style={styles.tracksList}>
                {tracks.slice(0, 5).map(track => (
                  <TrackItem key={track.id} track={track} onPress={handleTrackPress} />
                ))}
              </View>
            </View>
          </>
        );
    }
  };

  return (
    <GradientBackground type="background">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Browse</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tracks, albums, artists..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs */}
          {!searchQuery && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
            >
              {TABS.map(tab => (
                <TabButton
                  key={tab}
                  label={tab}
                  isActive={activeTab === tab}
                  onPress={() => setActiveTab(tab)}
                />
              ))}
            </ScrollView>
          )}

          {/* Content */}
          <View style={styles.content}>
            {renderContent()}
          </View>

          <View style={styles.bottomPadding} />
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
  loadingText: {
    marginTop: SIZES.paddingLG,
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
  scrollContent: { paddingBottom: SIZES.tabBarHeight + SIZES.miniPlayerHeight + 20 },
  header: { paddingHorizontal: SIZES.paddingXXL, paddingTop: SIZES.paddingLG, paddingBottom: SIZES.paddingLG },
  title: { fontSize: SIZES.font5XL, fontWeight: '300', color: COLORS.textPrimary },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingXXL,
    borderRadius: SIZES.radiusXL,
    paddingHorizontal: SIZES.paddingLG,
    paddingVertical: SIZES.paddingMD,
    gap: SIZES.paddingSM,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
  },
  
  tabsContainer: { paddingHorizontal: SIZES.paddingXXL, paddingBottom: SIZES.paddingXXL },
  content: { paddingHorizontal: 0 },
  
  // Sections
  section: { marginBottom: SIZES.padding3XL },
  sectionTitle: { 
    fontSize: SIZES.font2XL, 
    fontWeight: '300', 
    color: COLORS.textPrimary, 
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingLG 
  },
  horizontalList: { paddingHorizontal: SIZES.paddingXXL },
  tracksList: { paddingHorizontal: SIZES.paddingXXL },
  
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.paddingXXL,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: SIZES.paddingXXL,
  },
  gridItemArt: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.paddingSM,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: SIZES.paddingMD,
  },
  gridItemTitle: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  gridItemSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: SIZES.paddingSM,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
  },
  durationText: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
  },
  
  // List
  listContainer: {
    paddingHorizontal: SIZES.paddingXXL,
  },
  podcastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: SIZES.paddingMD,
  },
  podcastArt: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastInfo: {
    flex: 1,
  },
  podcastTitle: {
    fontSize: SIZES.fontMD + 1,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  podcastSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
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
  
  bottomPadding: { height: 20 },
});

export default BrowseScreen;

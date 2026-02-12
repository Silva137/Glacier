import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { ALBUMS, SESSIONS, PLAYLISTS, PODCASTS, TRACKS } from '../constants/data';
import { usePlayer } from '../hooks/usePlayer';
import {
  GradientBackground,
  TabButton,
  TrackItem,
} from '../components';

const TABS = ['music', 'sessions', 'playlists', 'podcasts'];

const BrowseScreen = ({ navigation, route }) => {
  const initialTab = route?.params?.initialTab || 'music';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack, userPlaylists } = usePlayer();

  // Filter data based on search query
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return {
        albums: ALBUMS,
        sessions: SESSIONS,
        playlists: PLAYLISTS,
        podcasts: PODCASTS,
        tracks: TRACKS,
        userPlaylists: userPlaylists,
      };
    }

    return {
      albums: ALBUMS.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.artist?.toLowerCase().includes(query)
      ),
      sessions: SESSIONS.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.description?.toLowerCase().includes(query)
      ),
      playlists: PLAYLISTS.filter(p => 
        p.title.toLowerCase().includes(query)
      ),
      podcasts: PODCASTS.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      ),
      tracks: TRACKS.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.artist?.toLowerCase().includes(query)
      ),
      userPlaylists: userPlaylists.filter(p => 
        p.title.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery, userPlaylists]);

  // Navigate to album detail
  const handleAlbumPress = (album) => {
    navigation.navigate('AlbumDetail', { album });
  };

  // Sessions play directly (they're single items)
  const handleSessionPress = (session) => {
    playTrack({ ...session, artist: 'Session', type: 'session' });
  };

  // Navigate to playlist detail
  const handlePlaylistPress = (playlist) => {
    navigation.navigate('PlaylistDetail', { playlist });
  };

  // Navigate to podcast detail
  const handlePodcastPress = (podcast) => {
    navigation.navigate('PodcastDetail', { podcast });
  };

  const handleCreatePlaylist = () => {
    navigation.navigate('CreatePlaylist');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Show search results across all categories if searching
  const renderSearchResults = () => {
    const hasResults = 
      filteredData.tracks.length > 0 ||
      filteredData.albums.length > 0 ||
      filteredData.sessions.length > 0 ||
      filteredData.playlists.length > 0 ||
      filteredData.podcasts.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.noResults}>
          <Icon name="search-outline" size={48} color={COLORS.textDim} />
          <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
          <Text style={styles.noResultsSubtext}>Try a different search term</Text>
        </View>
      );
    }

    return (
      <>
        {filteredData.tracks.length > 0 && (
          <>
            <Text style={styles.subsectionTitle}>Tracks ({filteredData.tracks.length})</Text>
            {filteredData.tracks.slice(0, 5).map(track => (
              <TrackItem
                key={track.id}
                track={track}
                onPress={playTrack}
                size="small"
              />
            ))}
          </>
        )}

        {filteredData.albums.length > 0 && (
          <>
            <Text style={[styles.subsectionTitle, { marginTop: SIZES.paddingXXL }]}>
              Albums ({filteredData.albums.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredData.albums.map(album => (
                <TouchableOpacity
                  key={album.id}
                  style={styles.searchAlbumItem}
                  onPress={() => handleAlbumPress(album)}
                >
                  <LinearGradient
                    colors={GRADIENTS[album.image] || GRADIENTS.aurora}
                    style={styles.searchAlbumArt}
                  />
                  <Text style={styles.searchAlbumTitle} numberOfLines={1}>{album.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {filteredData.sessions.length > 0 && (
          <>
            <Text style={[styles.subsectionTitle, { marginTop: SIZES.paddingXXL }]}>
              Sessions ({filteredData.sessions.length})
            </Text>
            {filteredData.sessions.slice(0, 3).map(session => (
              <TouchableOpacity
                key={session.id}
                style={styles.searchSessionItem}
                onPress={() => handleSessionPress(session)}
              >
                <LinearGradient
                  colors={GRADIENTS[session.image] || GRADIENTS.twilight}
                  style={styles.searchSessionArt}
                />
                <View style={styles.searchSessionInfo}>
                  <Text style={styles.searchSessionTitle}>{session.title}</Text>
                  <Text style={styles.searchSessionDuration}>{session.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </>
    );
  };

  const renderMusicTab = () => (
    <>
      <Text style={styles.subsectionTitle}>Albums</Text>
      <View style={styles.albumsGrid}>
        {filteredData.albums.map(album => (
          <TouchableOpacity
            key={album.id}
            style={styles.albumGridItem}
            onPress={() => handleAlbumPress(album)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS[album.image] || GRADIENTS.aurora}
              style={styles.albumGridArt}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.albumGridTitle} numberOfLines={1}>{album.title}</Text>
            <Text style={styles.albumGridSubtitle}>{album.tracks} tracks</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.subsectionTitle, { marginTop: SIZES.padding3XL }]}>All Tracks</Text>
      {filteredData.tracks.map(track => (
        <TrackItem
          key={track.id}
          track={track}
          onPress={playTrack}
          size="small"
        />
      ))}
    </>
  );

  const renderSessionsTab = () => (
    <>
      <Text style={styles.subsectionTitle}>All Sessions</Text>
      <View style={styles.sessionsGrid}>
        {filteredData.sessions.map(session => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionGridItem}
            onPress={() => handleSessionPress(session)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS[session.image] || GRADIENTS.twilight}
              style={styles.sessionGridArt}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{session.duration}</Text>
              </View>
            </LinearGradient>
            <Text style={styles.sessionGridTitle} numberOfLines={1}>{session.title}</Text>
            <Text style={styles.sessionGridSubtitle} numberOfLines={1}>{session.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderPlaylistsTab = () => (
    <>
      <TouchableOpacity 
        style={styles.createPlaylistButton}
        onPress={handleCreatePlaylist}
        activeOpacity={0.8}
      >
        <Icon name="add" size={24} color={COLORS.accent} />
        <Text style={styles.createPlaylistText}>Create New Playlist</Text>
      </TouchableOpacity>

      {filteredData.userPlaylists.length > 0 && (
        <>
          <Text style={styles.subsectionTitle}>Your Playlists</Text>
          {filteredData.userPlaylists.map(playlist => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.playlistItem}
              onPress={() => handlePlaylistPress(playlist)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={GRADIENTS.aurora}
                style={styles.playlistArt}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="musical-notes" size={24} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle}>{playlist.title}</Text>
                <Text style={styles.playlistSubtitle}>{playlist.tracks} tracks</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
            </TouchableOpacity>
          ))}
        </>
      )}

      <Text style={[styles.subsectionTitle, { marginTop: filteredData.userPlaylists.length > 0 ? SIZES.paddingXXL : 0 }]}>
        Curated Playlists
      </Text>
      <View style={styles.playlistsGrid}>
        {filteredData.playlists.map(playlist => (
          <TouchableOpacity
            key={playlist.id}
            style={styles.playlistGridItem}
            onPress={() => handlePlaylistPress(playlist)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS[playlist.image] || GRADIENTS.night}
              style={styles.playlistGridArt}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.playlistGridTitle} numberOfLines={1}>{playlist.title}</Text>
            <Text style={styles.playlistGridSubtitle}>{playlist.tracks} tracks</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderPodcastsTab = () => (
    <>
      <Text style={styles.subsectionTitle}>Music Podcasts</Text>
      {filteredData.podcasts.map(podcast => (
        <TouchableOpacity
          key={podcast.id}
          style={styles.podcastItem}
          onPress={() => handlePodcastPress(podcast)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={GRADIENTS[podcast.image] || GRADIENTS.horizon}
            style={styles.podcastArt}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.podcastInfo}>
            <Text style={styles.podcastTitle}>{podcast.title}</Text>
            <Text style={styles.podcastEpisodes}>{podcast.episodes} episodes</Text>
            <Text style={styles.podcastDescription}>{podcast.description}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
        </TouchableOpacity>
      ))}
    </>
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <GradientBackground type="background">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Browse</Text>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search sounds, playlists..."
              placeholderTextColor={COLORS.textDim}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Icon name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {!isSearching && (
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

          <View style={styles.content}>
            {isSearching ? (
              renderSearchResults()
            ) : (
              <>
                {activeTab === 'music' && renderMusicTab()}
                {activeTab === 'sessions' && renderSessionsTab()}
                {activeTab === 'playlists' && renderPlaylistsTab()}
                {activeTab === 'podcasts' && renderPodcastsTab()}
              </>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: SIZES.tabBarHeight + SIZES.miniPlayerHeight + 20 },
  header: { paddingHorizontal: SIZES.paddingXXL, paddingTop: SIZES.paddingLG, paddingBottom: SIZES.paddingLG },
  title: { fontSize: SIZES.font5XL, fontWeight: '300', color: COLORS.textPrimary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginHorizontal: SIZES.paddingXXL,
    paddingHorizontal: SIZES.paddingLG,
    paddingVertical: SIZES.paddingMD,
    marginBottom: SIZES.paddingXL,
    gap: SIZES.paddingMD,
  },
  searchInput: { flex: 1, fontSize: SIZES.fontMD + 1, color: COLORS.textPrimary },
  tabsContainer: { paddingHorizontal: SIZES.paddingXXL, paddingBottom: SIZES.paddingXXL },
  content: { paddingHorizontal: SIZES.paddingXXL },
  subsectionTitle: { fontSize: SIZES.font2XL, fontWeight: '300', color: COLORS.textPrimary, marginBottom: SIZES.paddingLG },
  
  noResults: { alignItems: 'center', paddingVertical: 60 },
  noResultsText: { fontSize: SIZES.fontLG, color: COLORS.textMuted, marginTop: SIZES.paddingLG },
  noResultsSubtext: { fontSize: SIZES.fontMD, color: COLORS.textDim, marginTop: SIZES.paddingSM },
  
  searchAlbumItem: { width: 120, marginRight: SIZES.paddingMD },
  searchAlbumArt: { width: 120, height: 120, borderRadius: SIZES.radiusMD, marginBottom: SIZES.paddingSM },
  searchAlbumTitle: { fontSize: SIZES.fontMD, color: COLORS.textPrimary },
  searchSessionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.paddingMD, gap: SIZES.paddingMD },
  searchSessionArt: { width: 50, height: 50, borderRadius: SIZES.radiusSM },
  searchSessionInfo: { flex: 1 },
  searchSessionTitle: { fontSize: SIZES.fontMD, color: COLORS.textPrimary, fontWeight: '600' },
  searchSessionDuration: { fontSize: SIZES.fontSM, color: COLORS.textMuted },
  
  albumsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  albumGridItem: { width: '48%', marginBottom: SIZES.paddingLG },
  albumGridArt: { width: '100%', aspectRatio: 1, borderRadius: SIZES.radiusLG, marginBottom: SIZES.paddingSM + 2 },
  albumGridTitle: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  albumGridSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted },
  
  sessionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sessionGridItem: { width: '48%', marginBottom: SIZES.paddingLG },
  sessionGridArt: { width: '100%', aspectRatio: 1, borderRadius: SIZES.radiusLG, marginBottom: SIZES.paddingSM + 2, justifyContent: 'flex-end', padding: SIZES.paddingMD },
  durationBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingHorizontal: SIZES.paddingSM + 2, paddingVertical: SIZES.paddingXS, borderRadius: SIZES.radiusSM + 2 },
  durationText: { fontSize: SIZES.fontXS + 1, color: 'rgba(255, 255, 255, 0.9)' },
  sessionGridTitle: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  sessionGridSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted },
  
  createPlaylistButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accentDim, borderRadius: SIZES.radiusLG, borderWidth: 1, borderColor: COLORS.accentBorder, borderStyle: 'dashed', paddingVertical: SIZES.paddingLG, marginBottom: SIZES.paddingXXL, gap: SIZES.paddingSM + 2 },
  createPlaylistText: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.accent },
  playlistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.paddingMD, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)', gap: SIZES.paddingMD },
  playlistArt: { width: 56, height: 56, borderRadius: SIZES.radiusMD, alignItems: 'center', justifyContent: 'center' },
  playlistInfo: { flex: 1 },
  playlistTitle: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.textPrimary },
  playlistSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: 2 },
  playlistsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  playlistGridItem: { width: '48%', marginBottom: SIZES.paddingLG },
  playlistGridArt: { width: '100%', aspectRatio: 1, borderRadius: SIZES.radiusLG, marginBottom: SIZES.paddingSM + 2 },
  playlistGridTitle: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  playlistGridSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted },
  
  podcastItem: { flexDirection: 'row', paddingVertical: SIZES.paddingMD, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)', gap: SIZES.paddingLG, alignItems: 'center' },
  podcastArt: { width: 70, height: 70, borderRadius: SIZES.radiusMD },
  podcastInfo: { flex: 1, justifyContent: 'center' },
  podcastTitle: { fontSize: SIZES.fontLG, fontWeight: '600', color: COLORS.textPrimary },
  podcastEpisodes: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: SIZES.paddingXS },
  podcastDescription: { fontSize: SIZES.fontSM, color: COLORS.textDim, marginTop: SIZES.paddingXS },
  bottomPadding: { height: 20 },
});

export default BrowseScreen;

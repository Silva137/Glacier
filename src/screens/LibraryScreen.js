import React, { useState, useMemo } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground, TabButton, TrackItem } from '../components';

const TABS = ['favorites', 'downloads', 'playlists', 'history'];

const LibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [historyView, setHistoryView] = useState('byWeek'); // 'byWeek' or 'byDay'
  const [collapsedSections, setCollapsedSections] = useState({});
  
  const { 
    favorites, 
    history, 
    downloads,
    userPlaylists, 
    playTrack, 
    setPlayQueue,
    isPremium,
    removeFromDownloads,
  } = usePlayer();

  const handleCreatePlaylist = () => {
    navigation.navigate('CreatePlaylist');
  };

  // Navigate to playlist detail instead of playing directly
  const handlePlaylistPress = (playlist) => {
    navigation.navigate('PlaylistDetail', { playlist });
  };

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Organize history by time
  const organizedHistory = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    if (historyView === 'byWeek') {
      const groups = {
        today: [],
        yesterday: [],
        thisWeek: [],
        thisMonth: [],
        older: [],
      };

      history.forEach(item => {
        const playedAt = item.playedAt || now;
        const diff = now - playedAt;

        if (diff < oneDay) {
          groups.today.push(item);
        } else if (diff < 2 * oneDay) {
          groups.yesterday.push(item);
        } else if (diff < oneWeek) {
          groups.thisWeek.push(item);
        } else if (diff < oneMonth) {
          groups.thisMonth.push(item);
        } else {
          groups.older.push(item);
        }
      });

      return [
        { key: 'today', label: 'Today', items: groups.today },
        { key: 'yesterday', label: 'Yesterday', items: groups.yesterday },
        { key: 'thisWeek', label: 'This Week', items: groups.thisWeek },
        { key: 'thisMonth', label: 'This Month', items: groups.thisMonth },
        { key: 'older', label: 'Older', items: groups.older },
      ].filter(g => g.items.length > 0);
    } else {
      // Group by specific date
      const dateGroups = {};
      
      history.forEach(item => {
        const playedAt = new Date(item.playedAt || now);
        const dateKey = playedAt.toDateString();
        
        if (!dateGroups[dateKey]) {
          dateGroups[dateKey] = [];
        }
        dateGroups[dateKey].push(item);
      });

      return Object.entries(dateGroups).map(([date, items]) => ({
        key: date,
        label: date,
        items,
      }));
    }
  }, [history, historyView]);

  const renderEmptyState = (icon, title, subtitle) => (
    <View style={styles.emptyState}>
      <Icon name={icon} size={64} color="rgba(255, 255, 255, 0.2)" />
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderFavoritesTab = () => (
    <>
      {favorites.length === 0 ? (
        renderEmptyState('heart-outline', 'No favorites yet', 'Tap the heart icon on any track to save it here')
      ) : (
        favorites.map((item, index) => (
          <TrackItem
            key={`${item.id}-${index}`}
            track={item}
            onPress={(track) => {
              setPlayQueue(favorites);
              playTrack(track, favorites);
            }}
          />
        ))
      )}
    </>
  );

  const renderDownloadsTab = () => (
    <>
      {downloads.length === 0 ? (
        <>
          {renderEmptyState('download-outline', 'No downloads yet', 'Download tracks to listen offline')}
          
          {!isPremium && (
            <View style={styles.premiumNotice}>
              <Text style={styles.premiumNoticeTitle}>
                <Text style={styles.accentText}>Free tier:</Text> Download up to 3 tracks
              </Text>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade for unlimited</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={styles.downloadCount}>
            {downloads.length} {downloads.length === 1 ? 'track' : 'tracks'} downloaded
            {!isPremium && ` (${3 - downloads.length} remaining)`}
          </Text>
          {downloads.map((item, index) => (
            <TrackItem
              key={`${item.id}-${index}`}
              track={item}
              onPress={(track) => {
                setPlayQueue(downloads);
                playTrack(track, downloads);
              }}
              showDelete
              onDelete={() => removeFromDownloads(item.id)}
            />
          ))}
        </>
      )}
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
        <Text style={styles.createPlaylistText}>Create Playlist</Text>
      </TouchableOpacity>

      {userPlaylists.length === 0 ? (
        <Text style={styles.emptySubtitle}>Your playlists will appear here</Text>
      ) : (
        userPlaylists.map(playlist => (
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
        ))
      )}
    </>
  );

  const renderHistoryTab = () => (
    <>
      {history.length === 0 ? (
        renderEmptyState('time-outline', 'No history yet', 'Your recently played tracks will appear here')
      ) : (
        <>
          {/* View Toggle */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewToggleButton, historyView === 'byWeek' && styles.viewToggleActive]}
              onPress={() => setHistoryView('byWeek')}
            >
              <Text style={[styles.viewToggleText, historyView === 'byWeek' && styles.viewToggleTextActive]}>
                By Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleButton, historyView === 'byDay' && styles.viewToggleActive]}
              onPress={() => setHistoryView('byDay')}
            >
              <Text style={[styles.viewToggleText, historyView === 'byDay' && styles.viewToggleTextActive]}>
                By Day
              </Text>
            </TouchableOpacity>
          </View>

          {/* Organized History */}
          {organizedHistory.map(group => (
            <View key={group.key} style={styles.historySection}>
              <TouchableOpacity
                style={styles.historySectionHeader}
                onPress={() => toggleSection(group.key)}
              >
                <Text style={styles.historySectionTitle}>{group.label}</Text>
                <View style={styles.historySectionRight}>
                  <Text style={styles.historySectionCount}>{group.items.length}</Text>
                  <Icon 
                    name={collapsedSections[group.key] ? 'chevron-down' : 'chevron-up'} 
                    size={18} 
                    color={COLORS.textDim} 
                  />
                </View>
              </TouchableOpacity>
              
              {!collapsedSections[group.key] && group.items.map((item, index) => (
                <TrackItem
                  key={`${item.id}-${index}`}
                  track={item}
                  onPress={(track) => {
                    setPlayQueue(history);
                    playTrack(track, history);
                  }}
                  showFavorite={false}
                />
              ))}
            </View>
          ))}
        </>
      )}
    </>
  );

  return (
    <GradientBackground type="background">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Your Library</Text>
          </View>

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

          <View style={styles.content}>
            {activeTab === 'favorites' && renderFavoritesTab()}
            {activeTab === 'downloads' && renderDownloadsTab()}
            {activeTab === 'playlists' && renderPlaylistsTab()}
            {activeTab === 'history' && renderHistoryTab()}
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
  tabsContainer: { paddingHorizontal: SIZES.paddingXXL, paddingBottom: SIZES.paddingXXL },
  content: { paddingHorizontal: SIZES.paddingXXL },
  
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: SIZES.fontLG, color: COLORS.textMuted, marginTop: SIZES.paddingLG },
  emptySubtitle: { fontSize: SIZES.fontMD, color: COLORS.textDim, marginTop: SIZES.paddingSM, textAlign: 'center' },
  
  // Downloads
  downloadCount: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    marginBottom: SIZES.paddingLG,
  },
  
  premiumNotice: { backgroundColor: COLORS.accentDim, borderRadius: SIZES.radiusLG, borderWidth: 1, borderColor: COLORS.accentBorder, padding: SIZES.paddingXL, marginTop: SIZES.paddingXXL },
  premiumNoticeTitle: { fontSize: SIZES.fontMD, color: COLORS.textSecondary },
  accentText: { color: COLORS.accent, fontWeight: '600' },
  upgradeButton: { backgroundColor: COLORS.primary, borderRadius: SIZES.radiusXL, paddingVertical: SIZES.paddingSM + 2, paddingHorizontal: SIZES.paddingXL, alignSelf: 'flex-start', marginTop: SIZES.paddingMD },
  upgradeButtonText: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.white },
  
  // Playlists
  createPlaylistButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accentDim, borderRadius: SIZES.radiusLG, borderWidth: 1, borderColor: COLORS.accentBorder, borderStyle: 'dashed', paddingVertical: SIZES.paddingLG, marginBottom: SIZES.paddingXXL, gap: SIZES.paddingSM + 2 },
  createPlaylistText: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.accent },
  playlistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.paddingMD, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)', gap: SIZES.paddingMD },
  playlistArt: { width: 56, height: 56, borderRadius: SIZES.radiusMD, alignItems: 'center', justifyContent: 'center' },
  playlistInfo: { flex: 1 },
  playlistTitle: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.textPrimary },
  playlistSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: 2 },
  
  // History
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    padding: 4,
    marginBottom: SIZES.paddingXXL,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: SIZES.paddingSM,
    alignItems: 'center',
    borderRadius: SIZES.radiusMD,
  },
  viewToggleActive: {
    backgroundColor: COLORS.primary,
  },
  viewToggleText: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
  },
  viewToggleTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  historySection: {
    marginBottom: SIZES.paddingLG,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historySectionTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  historySectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.paddingSM,
  },
  historySectionCount: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
  },
  
  bottomPadding: { height: 20 },
});

export default LibraryScreen;

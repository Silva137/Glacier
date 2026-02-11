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
import PremiumModal from './modals/PremiumModal';

const TABS = ['favorites', 'downloads', 'playlists', 'history'];
const FREE_DOWNLOAD_LIMIT = 3;

const LibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [showPremium, setShowPremium] = useState(false);
  const [historyView, setHistoryView] = useState('week'); // 'day' or 'week'
  const [collapsedSections, setCollapsedSections] = useState({});
  
  const { 
    favorites, 
    history, 
    userPlaylists, 
    downloads,
    playTrack, 
    isPremium,
    removeFromDownloads,
  } = usePlayer();

  // Organize history by time periods
  const organizedHistory = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    if (historyView === 'day') {
      // Group by specific days
      const days = {};
      
      history.forEach(item => {
        const playedAt = item.playedAt || now;
        const date = new Date(playedAt);
        const dateKey = date.toDateString();
        
        const diff = now - playedAt;
        let label;
        
        if (diff < oneDay) {
          label = 'Today';
        } else if (diff < 2 * oneDay) {
          label = 'Yesterday';
        } else {
          label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        }
        
        if (!days[dateKey]) {
          days[dateKey] = { label, items: [], timestamp: playedAt };
        }
        days[dateKey].items.push(item);
      });

      // Sort by timestamp (most recent first)
      return Object.values(days).sort((a, b) => b.timestamp - a.timestamp);
    } else {
      // Group by week periods
      const today = [];
      const yesterday = [];
      const thisWeek = [];
      const thisMonth = [];
      const older = [];

      history.forEach(item => {
        const playedAt = item.playedAt || now;
        const diff = now - playedAt;

        if (diff < oneDay) {
          today.push(item);
        } else if (diff < 2 * oneDay) {
          yesterday.push(item);
        } else if (diff < oneWeek) {
          thisWeek.push(item);
        } else if (diff < oneMonth) {
          thisMonth.push(item);
        } else {
          older.push(item);
        }
      });

      const sections = [];
      if (today.length > 0) sections.push({ label: 'Today', items: today, key: 'today' });
      if (yesterday.length > 0) sections.push({ label: 'Yesterday', items: yesterday, key: 'yesterday' });
      if (thisWeek.length > 0) sections.push({ label: 'This Week', items: thisWeek, key: 'thisWeek' });
      if (thisMonth.length > 0) sections.push({ label: 'This Month', items: thisMonth, key: 'thisMonth' });
      if (older.length > 0) sections.push({ label: 'Older', items: older, key: 'older' });
      
      return sections;
    }
  }, [history, historyView]);

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCreatePlaylist = () => {
    navigation.navigate('CreatePlaylist');
  };

  const handlePlaylistPress = (playlist) => {
    if (playlist.trackList && playlist.trackList.length > 0) {
      playTrack(playlist.trackList[0]);
    }
  };

  const handleLockedTrackPress = () => {
    setShowPremium(true);
  };

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
            onPress={playTrack}
          />
        ))
      )}
    </>
  );

  const renderDownloadsTab = () => {
    const accessibleDownloads = isPremium ? downloads : downloads.slice(0, FREE_DOWNLOAD_LIMIT);
    const lockedDownloads = isPremium ? [] : downloads.slice(FREE_DOWNLOAD_LIMIT);

    return (
      <>
        {!isPremium && (
          <View style={styles.downloadCounter}>
            <Text style={styles.downloadCountText}>
              {Math.min(downloads.length, FREE_DOWNLOAD_LIMIT)} / {FREE_DOWNLOAD_LIMIT} downloads available
              {downloads.length > FREE_DOWNLOAD_LIMIT && (
                <Text style={styles.lockedCountText}> ({downloads.length - FREE_DOWNLOAD_LIMIT} locked)</Text>
              )}
            </Text>
            <View style={styles.downloadProgressBar}>
              <View 
                style={[
                  styles.downloadProgressFill, 
                  { width: `${(Math.min(downloads.length, FREE_DOWNLOAD_LIMIT) / FREE_DOWNLOAD_LIMIT) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}

        {downloads.length === 0 ? (
          renderEmptyState('download-outline', 'No downloads yet', 'Download tracks to listen offline')
        ) : (
          <>
            {accessibleDownloads.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.downloadItem}>
                <View style={styles.downloadTrackContainer}>
                  <TrackItem
                    track={item}
                    onPress={playTrack}
                    showFavorite={false}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromDownloads(item.id)}
                >
                  <Icon name="trash-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}

            {lockedDownloads.length > 0 && (
              <>
                <View style={styles.lockedSection}>
                  <Icon name="lock-closed" size={16} color={COLORS.textMuted} />
                  <Text style={styles.lockedSectionTitle}>
                    Locked Downloads ({lockedDownloads.length})
                  </Text>
                </View>
                
                {lockedDownloads.map((item, index) => (
                  <TouchableOpacity 
                    key={`locked-${item.id}-${index}`} 
                    style={styles.lockedDownloadItem}
                    onPress={handleLockedTrackPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.lockedTrackInfo}>
                      <View style={styles.lockedArtwork}>
                        <Icon name="musical-note" size={20} color={COLORS.textDim} />
                        <View style={styles.lockBadge}>
                          <Icon name="lock-closed" size={10} color={COLORS.white} />
                        </View>
                      </View>
                      <View style={styles.lockedTextContainer}>
                        <Text style={styles.lockedTrackTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.lockedTrackArtist} numberOfLines={1}>
                          {item.artist || 'Glacier'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.unlockButton}>
                      <Icon name="star" size={14} color={COLORS.accent} />
                      <Text style={styles.unlockText}>Unlock</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
        
        {!isPremium && (
          <View style={styles.premiumNotice}>
            <Text style={styles.premiumNoticeTitle}>
              <Text style={styles.accentText}>Free tier:</Text> Download up to {FREE_DOWNLOAD_LIMIT} tracks
            </Text>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowPremium(true)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade for unlimited</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

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
          </TouchableOpacity>
        ))
      )}
    </>
  );

  const renderHistoryTab = () => {
    const hasHistory = history.length > 0;

    return (
      <>
        {/* View Toggle */}
        <View style={styles.historyViewToggle}>
          <TouchableOpacity
            style={[styles.viewToggleButton, historyView === 'week' && styles.viewToggleButtonActive]}
            onPress={() => setHistoryView('week')}
          >
            <Text style={[styles.viewToggleText, historyView === 'week' && styles.viewToggleTextActive]}>
              By Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, historyView === 'day' && styles.viewToggleButtonActive]}
            onPress={() => setHistoryView('day')}
          >
            <Text style={[styles.viewToggleText, historyView === 'day' && styles.viewToggleTextActive]}>
              By Day
            </Text>
          </TouchableOpacity>
        </View>

        {!hasHistory ? (
          renderEmptyState('time-outline', 'No history yet', 'Your recently played tracks will appear here')
        ) : (
          organizedHistory.map((section, sectionIndex) => {
            const sectionKey = section.key || section.label;
            const isCollapsed = collapsedSections[sectionKey];
            
            return (
              <View key={sectionKey} style={styles.historySection}>
                <TouchableOpacity 
                  style={styles.historySectionHeader}
                  onPress={() => toggleSection(sectionKey)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.historySectionTitle}>{section.label}</Text>
                  <View style={styles.historySectionRight}>
                    <Text style={styles.historySectionCount}>{section.items.length} tracks</Text>
                    <Icon 
                      name={isCollapsed ? 'chevron-down' : 'chevron-up'} 
                      size={18} 
                      color={COLORS.textMuted} 
                    />
                  </View>
                </TouchableOpacity>
                
                {!isCollapsed && section.items.map((item, index) => (
                  <TrackItem
                    key={`${item.id}-${sectionIndex}-${index}`}
                    track={item}
                    onPress={playTrack}
                    showFavorite={false}
                  />
                ))}
              </View>
            );
          })
        )}
      </>
    );
  };

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

      <PremiumModal 
        visible={showPremium} 
        onClose={() => setShowPremium(false)} 
      />
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
  
  // History view toggle
  historyViewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMD,
    padding: 4,
    marginBottom: SIZES.paddingLG,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: SIZES.paddingSM,
    alignItems: 'center',
    borderRadius: SIZES.radiusSM,
  },
  viewToggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewToggleText: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  viewToggleTextActive: {
    color: COLORS.white,
  },
  
  // History sections (collapsible)
  historySection: {
    marginBottom: SIZES.paddingMD,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingMD,
    paddingHorizontal: SIZES.paddingSM,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMD,
    marginBottom: SIZES.paddingSM,
  },
  historySectionTitle: {
    fontSize: SIZES.fontMD,
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
  
  // Download counter
  downloadCounter: { 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radiusMD, 
    padding: SIZES.paddingMD, 
    marginBottom: SIZES.paddingLG 
  },
  downloadCountText: { 
    fontSize: SIZES.fontSM, 
    color: COLORS.textMuted, 
    marginBottom: SIZES.paddingSM 
  },
  lockedCountText: {
    color: COLORS.error,
  },
  downloadProgressBar: { 
    height: 4, 
    backgroundColor: COLORS.surfaceLight, 
    borderRadius: 2 
  },
  downloadProgressFill: { 
    height: '100%', 
    backgroundColor: COLORS.accent, 
    borderRadius: 2 
  },
  
  // Download item
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadTrackContainer: {
    flex: 1,
  },
  removeButton: {
    padding: SIZES.paddingSM,
    marginLeft: SIZES.paddingSM,
  },
  
  // Locked section
  lockedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.paddingSM,
    marginTop: SIZES.paddingXXL,
    marginBottom: SIZES.paddingMD,
    paddingTop: SIZES.paddingLG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedSectionTitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  lockedDownloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingMD,
    opacity: 0.6,
  },
  lockedTrackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SIZES.paddingMD,
  },
  lockedArtwork: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusSM,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedTextContainer: {
    flex: 1,
  },
  lockedTrackTitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
  lockedTrackArtist: {
    fontSize: SIZES.fontSM,
    color: COLORS.textDim,
    marginTop: 2,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SIZES.paddingMD,
    paddingVertical: SIZES.paddingSM,
    borderRadius: SIZES.radiusMD,
  },
  unlockText: {
    fontSize: SIZES.fontXS,
    color: COLORS.accent,
    fontWeight: '600',
  },
  
  premiumNotice: { backgroundColor: COLORS.accentDim, borderRadius: SIZES.radiusLG, borderWidth: 1, borderColor: COLORS.accentBorder, padding: SIZES.paddingXL, marginTop: SIZES.paddingXXL },
  premiumNoticeTitle: { fontSize: SIZES.fontMD, color: COLORS.textSecondary },
  accentText: { color: COLORS.accent, fontWeight: '600' },
  upgradeButton: { backgroundColor: COLORS.primary, borderRadius: SIZES.radiusXL, paddingVertical: SIZES.paddingSM + 2, paddingHorizontal: SIZES.paddingXL, alignSelf: 'flex-start', marginTop: SIZES.paddingMD },
  upgradeButtonText: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.white },
  createPlaylistButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accentDim, borderRadius: SIZES.radiusLG, borderWidth: 1, borderColor: COLORS.accentBorder, borderStyle: 'dashed', paddingVertical: SIZES.paddingLG, marginBottom: SIZES.paddingXXL, gap: SIZES.paddingSM + 2 },
  createPlaylistText: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.accent },
  playlistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.paddingMD, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)', gap: SIZES.paddingMD },
  playlistArt: { width: 56, height: 56, borderRadius: SIZES.radiusMD, alignItems: 'center', justifyContent: 'center' },
  playlistInfo: { flex: 1 },
  playlistTitle: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.textPrimary },
  playlistSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: 2 },
  bottomPadding: { height: 20 },
});

export default LibraryScreen;

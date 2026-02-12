import React, { useState } from 'react';
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
import { ALBUMS, SESSIONS, TRACKS, CATEGORIES, FEATURED_CONTENT } from '../constants/data';
import { usePlayer } from '../hooks/usePlayer';
import {
  GradientBackground,
  AlbumCard,
  SessionCard,
  CategoryButton,
  TrackItem,
} from '../components';
import PremiumModal from './modals/PremiumModal';

const HomeScreen = ({ navigation }) => {
  const { playTrack, sleepTimerActive, sleepTimer, isPremium, setPlayQueue } = usePlayer();
  const [showPremium, setShowPremium] = useState(false);

  const handlePlayFeatured = () => {
    playTrack({
      ...FEATURED_CONTENT,
      artist: 'Featured Session',
    });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Category', { category: category.id });
  };

  const handleAlbumPress = (album) => {
    navigation.navigate('AlbumDetail', { album });
  };

  const handleSessionPress = (session) => {
    // Set queue to all sessions
    const sessionQueue = SESSIONS.map(s => ({
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

  // Navigate to dedicated See All pages
  const handleSeeAllAlbums = () => {
    navigation.navigate('NewReleases');
  };

  const handleSeeAllSessions = () => {
    navigation.navigate('Sessions');
  };

  const handleStartTrial = () => {
    setShowPremium(true);
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
            <View>
              <Text style={styles.greeting}>Good evening</Text>
              <Text style={styles.title}>Find your peace</Text>
            </View>
            {sleepTimerActive && (
              <View style={styles.timerBadge}>
                <Icon name="moon" size={14} color={COLORS.accent} />
                <Text style={styles.timerText}>{sleepTimer} min</Text>
              </View>
            )}
          </View>

          {/* Featured Card */}
          <TouchableOpacity 
            style={styles.featuredContainer}
            onPress={handlePlayFeatured}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={GRADIENTS.aurora}
              style={styles.featuredCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featuredSubtitle}>{FEATURED_CONTENT.subtitle}</Text>
              <Text style={styles.featuredTitle}>{FEATURED_CONTENT.title}</Text>
              <View style={styles.featuredFooter}>
                <Text style={styles.featuredDuration}>{FEATURED_CONTENT.duration}</Text>
                <View style={styles.playButton}>
                  <Icon name="play" size={20} color={COLORS.white} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map(category => (
              <CategoryButton
                key={category.id}
                category={category}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>

          {/* New Releases */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Releases</Text>
              <TouchableOpacity onPress={handleSeeAllAlbums}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {ALBUMS.slice(0, 4).map(album => (
                <AlbumCard
                  key={album.id}
                  item={album}
                  onPress={handleAlbumPress}
                  showBadge
                  badgeText={`${album.tracks} tracks`}
                />
              ))}
            </ScrollView>
          </View>

          {/* Quick Sessions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Sessions</Text>
              <TouchableOpacity onPress={handleSeeAllSessions}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {SESSIONS.slice(0, 4).map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onPress={handleSessionPress}
                />
              ))}
            </ScrollView>
          </View>

          {/* Premium Banner (if not premium) */}
          {!isPremium && (
            <TouchableOpacity 
              style={styles.premiumBanner}
              onPress={handleStartTrial}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={GRADIENTS.premium}
                style={styles.premiumGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.premiumContent}>
                  <Icon name="star" size={24} color={COLORS.accent} />
                  <View style={styles.premiumTextContainer}>
                    <Text style={styles.premiumTitle}>Glacier Premium</Text>
                    <Text style={styles.premiumSubtitle}>Unlimited downloads & ad-free</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.premiumButton}
                  onPress={handleStartTrial}
                >
                  <LinearGradient
                    colors={GRADIENTS.button}
                    style={styles.premiumButtonGradient}
                  >
                    <Text style={styles.premiumButtonText}>Try Free</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Popular Tracks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Tracks</Text>
            <View style={styles.tracksList}>
              {TRACKS.slice(0, 5).map(track => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onPress={playTrack}
                />
              ))}
            </View>
          </View>

          {/* Bottom padding for mini player */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>

      {/* Premium Modal */}
      <PremiumModal 
        visible={showPremium} 
        onClose={() => setShowPremium(false)} 
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.tabBarHeight + SIZES.miniPlayerHeight + 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingXXL,
    paddingTop: SIZES.paddingLG,
    paddingBottom: SIZES.paddingXXL,
  },
  greeting: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    marginBottom: SIZES.paddingXS,
  },
  title: {
    fontSize: SIZES.font4XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: SIZES.paddingMD,
    paddingVertical: SIZES.paddingSM,
    borderRadius: SIZES.radiusXL,
    gap: 6,
  },
  timerText: {
    fontSize: SIZES.fontSM,
    color: COLORS.accent,
    fontWeight: '500',
  },
  featuredContainer: {
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.padding3XL,
  },
  featuredCard: {
    borderRadius: SIZES.radiusXXL,
    padding: SIZES.paddingXXL,
    minHeight: 180,
  },
  featuredSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  featuredTitle: {
    fontSize: SIZES.font6XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginVertical: SIZES.paddingMD,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.paddingMD,
  },
  featuredDuration: {
    fontSize: SIZES.fontSM,
    color: COLORS.textSecondary,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: SIZES.paddingXXL,
    paddingBottom: SIZES.padding3XL,
  },
  section: {
    marginBottom: SIZES.padding3XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingLG,
  },
  sectionTitle: {
    fontSize: SIZES.font2XL + 2,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
  },
  horizontalList: {
    paddingHorizontal: SIZES.paddingXXL,
  },
  tracksList: {
    paddingHorizontal: SIZES.paddingXXL,
  },
  
  // Premium Banner
  premiumBanner: {
    marginHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.padding3XL,
    borderRadius: SIZES.radiusXL,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.paddingLG,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: SIZES.radiusXL,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.paddingMD,
    flex: 1,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.accent,
  },
  premiumSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  premiumButton: {
    borderRadius: SIZES.radiusLG,
    overflow: 'hidden',
  },
  premiumButtonGradient: {
    paddingVertical: SIZES.paddingSM + 2,
    paddingHorizontal: SIZES.paddingLG,
  },
  premiumButtonText: {
    fontSize: SIZES.fontSM,
    fontWeight: '600',
    color: COLORS.white,
  },
  
  bottomPadding: {
    height: 20,
  },
});

export default HomeScreen;

import React, { useMemo } from 'react';
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
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';

// Generate sample episodes for a podcast
const generateEpisodes = (podcast) => {
  const episodeCount = podcast.episodes || 10;
  const episodes = [];
  
  const titles = [
    'Introduction to Ambient Sounds',
    'The Art of Relaxation',
    'Deep Sleep Techniques',
    'Finding Inner Peace',
    'Mindful Listening',
    'Nature\'s Symphony',
    'Ocean Waves & Calm',
    'Forest Meditation',
    'Evening Wind Down',
    'Morning Awakening',
    'Stress Relief Methods',
    'The Power of Silence',
  ];

  const descriptions = [
    'Discover the calming power of ambient soundscapes.',
    'Learn techniques for deep relaxation and stress relief.',
    'Explore methods to improve your sleep quality.',
    'A guided journey to finding inner peace.',
    'Understanding the benefits of mindful listening.',
  ];

  for (let i = 1; i <= episodeCount; i++) {
    const daysAgo = (i - 1) * 7;
    let dateStr = 'Today';
    if (daysAgo === 7) dateStr = '1 week ago';
    else if (daysAgo > 0 && daysAgo < 30) dateStr = `${Math.floor(daysAgo / 7)} weeks ago`;
    else if (daysAgo >= 30) dateStr = `${Math.floor(daysAgo / 30)} months ago`;

    episodes.push({
      id: `${podcast.id}_ep_${i}`,
      title: `Episode ${i}: ${titles[(i - 1) % titles.length]}`,
      description: descriptions[(i - 1) % descriptions.length],
      duration: `${20 + Math.floor(Math.random() * 40)} min`,
      date: dateStr,
      artist: podcast.title,
      type: 'podcast',
    });
  }
  
  return episodes;
};

const PodcastDetailScreen = ({ route, navigation }) => {
  const { podcast } = route.params;
  const { playTrack, currentTrack, setPlayQueue } = usePlayer();
  const insets = useSafeAreaInsets();

  const episodes = useMemo(() => generateEpisodes(podcast), [podcast]);

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handlePlayEpisode = (episode) => {
    // Set queue to all episodes
    if (setPlayQueue) setPlayQueue(episodes);
    playTrack(episode);
  };

  const handlePlayLatest = () => {
    if (episodes.length > 0) {
      if (setPlayQueue) setPlayQueue(episodes);
      playTrack(episodes[0]);
    }
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

          {/* Podcast Art */}
          <View style={styles.artContainer}>
            <LinearGradient
              colors={GRADIENTS[podcast.image] || GRADIENTS.horizon}
              style={styles.podcastArt}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="mic" size={64} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
          </View>

          {/* Podcast Info */}
          <View style={styles.podcastInfo}>
            <Text style={styles.podcastTitle}>{podcast.title}</Text>
            <Text style={styles.podcastDescription}>{podcast.description}</Text>
            <Text style={styles.podcastMeta}>{podcast.episodes} episodes • Podcast</Text>
          </View>

          {/* Play Latest Button */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.playLatestButton}
              onPress={handlePlayLatest}
            >
              <LinearGradient
                colors={GRADIENTS.button}
                style={styles.playLatestGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="play" size={22} color={COLORS.white} />
                <Text style={styles.playLatestText}>Play Latest Episode</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Episodes List */}
          <View style={styles.episodesSection}>
            <Text style={styles.sectionTitle}>All Episodes</Text>
            {episodes.map((episode, index) => (
              <TouchableOpacity
                key={episode.id}
                style={styles.episodeItem}
                onPress={() => handlePlayEpisode(episode)}
                activeOpacity={0.7}
              >
                <View style={styles.episodeNumber}>
                  <Text style={styles.episodeNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle} numberOfLines={2}>{episode.title}</Text>
                  <Text style={styles.episodeDescription} numberOfLines={1}>{episode.description}</Text>
                  <View style={styles.episodeMeta}>
                    <Text style={styles.episodeDate}>{episode.date}</Text>
                    <Text style={styles.episodeDot}>•</Text>
                    <Text style={styles.episodeDuration}>{episode.duration}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.episodePlayButton}
                  onPress={() => handlePlayEpisode(episode)}
                >
                  <Icon name="play-circle" size={40} color={COLORS.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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
  podcastArt: {
    width: 180,
    height: 180,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.album,
  },
  
  podcastInfo: {
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingXXL,
  },
  podcastTitle: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  podcastDescription: {
    fontSize: SIZES.fontMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.paddingSM,
  },
  podcastMeta: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingSM,
  },
  
  actions: {
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.padding3XL,
  },
  playLatestButton: {
    borderRadius: SIZES.radiusXL,
    overflow: 'hidden',
  },
  playLatestGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.paddingLG,
    gap: SIZES.paddingSM,
  },
  playLatestText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.white,
  },
  
  episodesSection: {
    paddingHorizontal: SIZES.paddingXXL,
  },
  sectionTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingLG,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingLG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: SIZES.paddingMD,
  },
  episodeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeNumberText: {
    fontSize: SIZES.fontSM,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  episodeDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  episodeDate: {
    fontSize: SIZES.fontXS,
    color: COLORS.textDim,
  },
  episodeDot: {
    fontSize: SIZES.fontXS,
    color: COLORS.textDim,
  },
  episodeDuration: {
    fontSize: SIZES.fontXS,
    color: COLORS.textDim,
  },
  episodePlayButton: {
    padding: SIZES.paddingXS,
  },
});

export default PodcastDetailScreen;

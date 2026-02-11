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
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground, TrackItem } from '../components';

// Category-specific data
const CATEGORY_DATA = {
  sleep: {
    title: 'Sleep',
    subtitle: 'Wind down and rest peacefully',
    icon: 'moon',
    gradient: ['#1a2a4a', '#0a1a2a'],
    accentColor: '#6b8cce',
    sessions: [
      { id: 'sleep_1', title: 'Deep Sleep', duration: '45 min', description: 'Drift into restful slumber', image: 'twilight' },
      { id: 'sleep_2', title: 'Sleep Stories', duration: '30 min', description: 'Calming bedtime tales', image: 'night' },
      { id: 'sleep_3', title: 'Rain Sounds', duration: '60 min', description: 'Gentle rainfall for sleep', image: 'ocean' },
    ],
    tracks: [
      { id: 'sleep_t1', title: 'Midnight Calm', artist: 'Glacier', duration: '8:32', albumId: 'sleep' },
      { id: 'sleep_t2', title: 'Starlight Dreams', artist: 'Glacier', duration: '6:45', albumId: 'sleep' },
      { id: 'sleep_t3', title: 'Quiet Night', artist: 'Glacier', duration: '7:20', albumId: 'sleep' },
      { id: 'sleep_t4', title: 'Peaceful Slumber', artist: 'Glacier', duration: '9:15', albumId: 'sleep' },
      { id: 'sleep_t5', title: 'Dream Waves', artist: 'Glacier', duration: '5:50', albumId: 'sleep' },
    ],
    playlists: [
      { id: 'sleep_p1', title: 'Bedtime Essentials', tracks: 12 },
      { id: 'sleep_p2', title: 'Deep Rest', tracks: 8 },
    ],
  },
  focus: {
    title: 'Focus',
    subtitle: 'Enhance concentration and productivity',
    icon: 'bulb',
    gradient: ['#2a3a2a', '#1a2a1a'],
    accentColor: '#7bc5a3',
    sessions: [
      { id: 'focus_1', title: 'Deep Work', duration: '25 min', description: 'Pomodoro focus session', image: 'aurora' },
      { id: 'focus_2', title: 'Flow State', duration: '45 min', description: 'Enter the zone', image: 'forest' },
      { id: 'focus_3', title: 'Study Session', duration: '60 min', description: 'Concentration music', image: 'aurora' },
    ],
    tracks: [
      { id: 'focus_t1', title: 'Clear Mind', artist: 'Glacier', duration: '5:20', albumId: 'focus' },
      { id: 'focus_t2', title: 'Productivity Boost', artist: 'Glacier', duration: '6:30', albumId: 'focus' },
      { id: 'focus_t3', title: 'Mental Clarity', artist: 'Glacier', duration: '4:45', albumId: 'focus' },
      { id: 'focus_t4', title: 'Concentration', artist: 'Glacier', duration: '7:10', albumId: 'focus' },
      { id: 'focus_t5', title: 'Deep Thought', artist: 'Glacier', duration: '5:55', albumId: 'focus' },
    ],
    playlists: [
      { id: 'focus_p1', title: 'Work From Home', tracks: 15 },
      { id: 'focus_p2', title: 'Study Beats', tracks: 10 },
    ],
  },
  relax: {
    title: 'Relax',
    subtitle: 'Unwind and release tension',
    icon: 'leaf',
    gradient: ['#2a4a4a', '#1a3a3a'],
    accentColor: '#4a9a9a',
    sessions: [
      { id: 'relax_1', title: 'Stress Relief', duration: '20 min', description: 'Let go of tension', image: 'ocean' },
      { id: 'relax_2', title: 'Nature Escape', duration: '30 min', description: 'Forest and stream sounds', image: 'forest' },
      { id: 'relax_3', title: 'Spa Session', duration: '45 min', description: 'Peaceful relaxation', image: 'horizon' },
    ],
    tracks: [
      { id: 'relax_t1', title: 'Ocean Breeze', artist: 'Glacier', duration: '6:40', albumId: 'relax' },
      { id: 'relax_t2', title: 'Gentle Stream', artist: 'Glacier', duration: '5:30', albumId: 'relax' },
      { id: 'relax_t3', title: 'Soft Winds', artist: 'Glacier', duration: '7:15', albumId: 'relax' },
      { id: 'relax_t4', title: 'Tranquil Garden', artist: 'Glacier', duration: '6:00', albumId: 'relax' },
      { id: 'relax_t5', title: 'Evening Calm', artist: 'Glacier', duration: '8:20', albumId: 'relax' },
    ],
    playlists: [
      { id: 'relax_p1', title: 'After Work Chill', tracks: 14 },
      { id: 'relax_p2', title: 'Weekend Vibes', tracks: 18 },
    ],
  },
  meditate: {
    title: 'Meditate',
    subtitle: 'Find inner peace and mindfulness',
    icon: 'flower',
    gradient: ['#3a2a4a', '#2a1a3a'],
    accentColor: '#a17bc5',
    sessions: [
      { id: 'meditate_1', title: 'Morning Meditation', duration: '10 min', description: 'Start your day mindfully', image: 'horizon' },
      { id: 'meditate_2', title: 'Breathing Exercise', duration: '15 min', description: 'Guided breathwork', image: 'twilight' },
      { id: 'meditate_3', title: 'Body Scan', duration: '20 min', description: 'Full body relaxation', image: 'night' },
    ],
    tracks: [
      { id: 'meditate_t1', title: 'Inner Peace', artist: 'Glacier', duration: '10:00', albumId: 'meditate' },
      { id: 'meditate_t2', title: 'Mindful Moment', artist: 'Glacier', duration: '8:30', albumId: 'meditate' },
      { id: 'meditate_t3', title: 'Sacred Space', artist: 'Glacier', duration: '12:15', albumId: 'meditate' },
      { id: 'meditate_t4', title: 'Zen Garden', artist: 'Glacier', duration: '9:45', albumId: 'meditate' },
      { id: 'meditate_t5', title: 'Stillness', artist: 'Glacier', duration: '7:30', albumId: 'meditate' },
    ],
    playlists: [
      { id: 'meditate_p1', title: 'Daily Meditation', tracks: 7 },
      { id: 'meditate_p2', title: 'Mindfulness Journey', tracks: 10 },
    ],
  },
};

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { playTrack, currentTrack } = usePlayer();
  const insets = useSafeAreaInsets();
  
  const data = CATEGORY_DATA[category] || CATEGORY_DATA.sleep;

  // Calculate bottom padding based on whether mini player is showing
  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handleSessionPress = (session) => {
    playTrack({
      ...session,
      artist: 'Glacier Session',
      type: 'session',
    });
  };

  const handlePlaylistPress = (playlist) => {
    if (data.tracks.length > 0) {
      playTrack(data.tracks[0]);
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

          {/* Hero Section */}
          <LinearGradient
            colors={data.gradient}
            style={styles.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.heroIcon, { backgroundColor: `${data.accentColor}30` }]}>
              <Icon name={data.icon} size={40} color={data.accentColor} />
            </View>
            <Text style={styles.heroTitle}>{data.title}</Text>
            <Text style={styles.heroSubtitle}>{data.subtitle}</Text>
          </LinearGradient>

          {/* Sessions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sessions</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionsContainer}
            >
              {data.sessions.map(session => (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionCard}
                  onPress={() => handleSessionPress(session)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={GRADIENTS[session.image] || GRADIENTS.twilight}
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

          {/* Playlists */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Playlists</Text>
            {data.playlists.map(playlist => (
              <TouchableOpacity
                key={playlist.id}
                style={styles.playlistItem}
                onPress={() => handlePlaylistPress(playlist)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={data.gradient}
                  style={styles.playlistArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="musical-notes" size={24} color={data.accentColor} />
                </LinearGradient>
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistTitle}>{playlist.title}</Text>
                  <Text style={styles.playlistSubtitle}>{playlist.tracks} tracks</Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Icon name="play" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tracks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sounds</Text>
            {data.tracks.map(track => (
              <TrackItem
                key={track.id}
                track={track}
                onPress={playTrack}
              />
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
});

export default CategoryScreen;

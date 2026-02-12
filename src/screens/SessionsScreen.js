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
import { SESSIONS } from '../constants/data';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';

const SessionsScreen = ({ navigation }) => {
  const { currentTrack, playTrack, setPlayQueue } = usePlayer();
  const insets = useSafeAreaInsets();

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handleSessionPress = (session) => {
    // Set queue to all sessions
    setPlayQueue(SESSIONS.map(s => ({
      ...s,
      artist: 'Glacier Session',
      type: 'session',
    })));
    
    playTrack({
      ...session,
      artist: 'Glacier Session',
      type: 'session',
    });
  };

  // Group sessions by duration
  const shortSessions = SESSIONS.filter(s => {
    const mins = parseInt(s.duration);
    return mins <= 15;
  });
  
  const mediumSessions = SESSIONS.filter(s => {
    const mins = parseInt(s.duration);
    return mins > 15 && mins <= 30;
  });
  
  const longSessions = SESSIONS.filter(s => {
    const mins = parseInt(s.duration);
    return mins > 30;
  });

  const renderSessionCard = (session) => (
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
        <View style={styles.playOverlay}>
          <Icon name="play" size={24} color={COLORS.white} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{session.duration}</Text>
        </View>
      </LinearGradient>
      <Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>
      <Text style={styles.sessionDescription} numberOfLines={1}>{session.description}</Text>
    </TouchableOpacity>
  );

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
            <Text style={styles.title}>Quick Sessions</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {SESSIONS.length} sessions • Timed audio experiences
          </Text>

          {/* Quick Sessions (≤15 min) */}
          {shortSessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Start (≤15 min)</Text>
              <View style={styles.sessionsGrid}>
                {shortSessions.map(renderSessionCard)}
              </View>
            </View>
          )}

          {/* Medium Sessions (15-30 min) */}
          {mediumSessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medium (15-30 min)</Text>
              <View style={styles.sessionsGrid}>
                {mediumSessions.map(renderSessionCard)}
              </View>
            </View>
          )}

          {/* Long Sessions (>30 min) */}
          {longSessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extended (30+ min)</Text>
              <View style={styles.sessionsGrid}>
                {longSessions.map(renderSessionCard)}
              </View>
            </View>
          )}

          {/* If no grouping possible, show all */}
          {shortSessions.length === 0 && mediumSessions.length === 0 && longSessions.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Sessions</Text>
              <View style={styles.sessionsGrid}>
                {SESSIONS.map(renderSessionCard)}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {},
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingXXL,
    paddingTop: SIZES.paddingLG,
    paddingBottom: SIZES.paddingMD,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  
  subtitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    paddingHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.paddingXXL,
  },
  
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
  
  sessionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.paddingXXL,
    justifyContent: 'space-between',
  },
  sessionCard: {
    width: '48%',
    marginBottom: SIZES.paddingXXL,
  },
  sessionArt: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.paddingSM,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.paddingMD,
    ...SHADOWS.small,
  },
  playOverlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: SIZES.paddingSM,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
    position: 'absolute',
    bottom: SIZES.paddingMD,
    left: SIZES.paddingMD,
  },
  durationText: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
    fontWeight: '600',
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
});

export default SessionsScreen;

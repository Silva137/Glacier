// src/screens/SessionsScreen.js
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
import { COLORS, SIZES, GRADIENTS, SHADOWS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { useData } from '../hooks/useData';
import { GradientBackground } from '../components';

const SessionsScreen = ({ navigation }) => {
  const { currentTrack, playTrack, setPlayQueue } = usePlayer();
  const { sessions, isLoading } = useData();
  const insets = useSafeAreaInsets();

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handleSessionPress = (session) => {
    const sessionQueue = sessions.map(s => ({
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

  // Group sessions by duration
  const groupedSessions = useMemo(() => {
    const shortSessions = sessions.filter(s => {
      const mins = parseInt(s.duration);
      return mins <= 15;
    });
    
    const mediumSessions = sessions.filter(s => {
      const mins = parseInt(s.duration);
      return mins > 15 && mins <= 30;
    });
    
    const longSessions = sessions.filter(s => {
      const mins = parseInt(s.duration);
      return mins > 30;
    });

    return { shortSessions, mediumSessions, longSessions };
  }, [sessions]);

  const renderSessionCard = (session) => (
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

  if (isLoading) {
    return (
      <GradientBackground type="background">
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const { shortSessions, mediumSessions, longSessions } = groupedSessions;

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
            {sessions.length} sessions • Timed audio experiences
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

          {/* If no sessions */}
          {sessions.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="time-outline" size={64} color={COLORS.textDim} />
              <Text style={styles.emptyText}>No sessions available</Text>
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

export default SessionsScreen;

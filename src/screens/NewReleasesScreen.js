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
import { ALBUMS } from '../constants/data';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';

const NewReleasesScreen = ({ navigation }) => {
  const { currentTrack } = usePlayer();
  const insets = useSafeAreaInsets();

  const bottomPadding = currentTrack 
    ? SIZES.tabBarHeight + SIZES.miniPlayerHeight + insets.bottom + 30
    : SIZES.tabBarHeight + insets.bottom + 20;

  const handleAlbumPress = (album) => {
    navigation.navigate('AlbumDetail', { album });
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
            <Text style={styles.title}>New Releases</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {ALBUMS.length} albums • Fresh sounds for you
          </Text>

          {/* Albums Grid */}
          <View style={styles.albumsGrid}>
            {ALBUMS.map(album => (
              <TouchableOpacity
                key={album.id}
                style={styles.albumCard}
                onPress={() => handleAlbumPress(album)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={GRADIENTS[album.image] || GRADIENTS.aurora}
                  style={styles.albumArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.tracksBadge}>
                    <Text style={styles.tracksBadgeText}>{album.tracks} tracks</Text>
                  </View>
                </LinearGradient>
                <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                <Text style={styles.albumArtist}>{album.artist || 'Glacier'}</Text>
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
  
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.paddingXXL,
    justifyContent: 'space-between',
  },
  albumCard: {
    width: '48%',
    marginBottom: SIZES.paddingXXL,
  },
  albumArt: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.paddingSM,
    justifyContent: 'flex-end',
    padding: SIZES.paddingMD,
    ...SHADOWS.small,
  },
  tracksBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: SIZES.paddingSM,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
  },
  tracksBadgeText: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
  },
  albumTitle: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  albumArtist: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default NewReleasesScreen;

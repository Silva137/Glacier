import React, { useState } from 'react';
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
import { TRACKS, ALBUMS } from '../constants/data';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';

const CreatePlaylistScreen = ({ navigation }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const { createPlaylist } = usePlayer();

  const toggleTrack = (track) => {
    const exists = selectedTracks.find(t => t.id === track.id);
    if (exists) {
      setSelectedTracks(selectedTracks.filter(t => t.id !== track.id));
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const isSelected = (track) => selectedTracks.some(t => t.id === track.id);

  const handleCreate = () => {
    if (playlistName.trim() && selectedTracks.length > 0) {
      createPlaylist(playlistName.trim(), selectedTracks);
      navigation.goBack();
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const canCreate = playlistName.trim() && selectedTracks.length > 0;

  return (
    <GradientBackground colors={['rgba(0,0,0,0.95)', 'rgba(10,26,42,0.98)']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Playlist</Text>
          <TouchableOpacity 
            onPress={handleCreate}
            disabled={!canCreate}
            style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
          >
            <Text style={[styles.createButtonText, !canCreate && styles.createButtonTextDisabled]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>

        {/* Playlist Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Playlist name..."
            placeholderTextColor={COLORS.textDim}
            value={playlistName}
            onChangeText={setPlaylistName}
            autoFocus
          />
          <Text style={styles.trackCount}>
            {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected
          </Text>
        </View>

        {/* Track Selection */}
        <ScrollView 
          style={styles.trackList}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>SELECT TRACKS</Text>
          
          {TRACKS.map(track => {
            const album = ALBUMS.find(a => a.id === track.albumId);
            const selected = isSelected(track);
            
            return (
              <TouchableOpacity
                key={track.id}
                style={styles.trackItem}
                onPress={() => toggleTrack(track)}
                activeOpacity={0.7}
              >
                {/* Checkbox */}
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <Icon name="checkmark" size={14} color={COLORS.white} />}
                </View>

                {/* Album Art */}
                <LinearGradient
                  colors={GRADIENTS[album?.image] || GRADIENTS.aurora}
                  style={styles.trackArt}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />

                {/* Track Info */}
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.trackAlbum} numberOfLines={1}>{track.album}</Text>
                </View>

                {/* Duration */}
                <Text style={styles.trackDuration}>{track.duration}</Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingXXL,
    paddingTop: SIZES.paddingLG,
    paddingBottom: SIZES.paddingXL,
  },
  closeButton: { padding: SIZES.paddingSM },
  headerTitle: { fontSize: SIZES.font2XL, fontWeight: '300', color: COLORS.textPrimary },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.paddingLG,
    paddingVertical: SIZES.paddingSM,
    borderRadius: SIZES.radiusLG,
  },
  createButtonDisabled: { backgroundColor: COLORS.surface },
  createButtonText: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.white },
  createButtonTextDisabled: { color: COLORS.textDim },
  
  // Input
  inputContainer: { paddingHorizontal: SIZES.paddingXXL, marginBottom: SIZES.paddingXL },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: SIZES.radiusLG,
    paddingHorizontal: SIZES.paddingXL,
    paddingVertical: SIZES.paddingLG,
    fontSize: SIZES.fontLG,
    color: COLORS.textPrimary,
  },
  trackCount: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingMD,
  },
  
  // Track List
  trackList: { flex: 1, paddingHorizontal: SIZES.paddingXXL },
  sectionTitle: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SIZES.paddingLG,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: SIZES.paddingMD,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  trackArt: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusSM + 2,
  },
  trackInfo: { flex: 1, justifyContent: 'center' },
  trackTitle: { fontSize: SIZES.fontMD, fontWeight: '600', color: COLORS.textPrimary },
  trackAlbum: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: 2 },
  trackDuration: { fontSize: SIZES.fontSM, color: COLORS.textDim },
  
  bottomPadding: { height: 40 },
});

export default CreatePlaylistScreen;

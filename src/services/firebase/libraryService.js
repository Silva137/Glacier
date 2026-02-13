// src/services/firebase/libraryService.js
import { firestore, collections } from './config';
import { getCurrentUser } from './authService';

/**
 * Library Service
 * Handles user's personal library: favorites, history, downloads, playlists
 */

// ==================== FAVORITES ====================

// Get user favorites
export const getFavorites = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated', data: [] };

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('favorites')
      .orderBy('addedAt', 'desc')
      .get();

    const favorites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: favorites };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// Add to favorites
export const addToFavorites = async (track) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('favorites')
      .doc(track.id)
      .set({
        ...track,
        addedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove from favorites
export const removeFromFavorites = async (trackId) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('favorites')
      .doc(trackId)
      .delete();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if track is favorited
export const isFavorite = async (trackId) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return false;

    const doc = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('favorites')
      .doc(trackId)
      .get();

    return doc.exists;
  } catch (error) {
    return false;
  }
};

// ==================== HISTORY ====================

// Get listening history
export const getHistory = async (limit = 50) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated', data: [] };

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('history')
      .orderBy('playedAt', 'desc')
      .limit(limit)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: history };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// Add to history
export const addToHistory = async (track) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    // Use track ID as document ID to avoid duplicates
    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('history')
      .doc(track.id)
      .set({
        ...track,
        playedAt: new Date().toISOString(),
        playCount: firestore.FieldValue.increment(1),
      }, { merge: true });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clear history
export const clearHistory = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('history')
      .get();

    const batch = firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== DOWNLOADS ====================

// Get downloads
export const getDownloads = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated', data: [] };

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('downloads')
      .orderBy('downloadedAt', 'desc')
      .get();

    const downloads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: downloads };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// Add to downloads (record in Firestore, actual file is stored locally)
export const addToDownloads = async (track, localPath) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('downloads')
      .doc(track.id)
      .set({
        ...track,
        localPath,
        downloadedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove from downloads
export const removeFromDownloads = async (trackId) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('downloads')
      .doc(trackId)
      .delete();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get downloads count (for free tier limit)
export const getDownloadsCount = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return 0;

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('downloads')
      .count()
      .get();

    return snapshot.data().count;
  } catch (error) {
    return 0;
  }
};

// ==================== USER PLAYLISTS ====================

// Get user playlists
export const getUserPlaylists = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated', data: [] };

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .orderBy('createdAt', 'desc')
      .get();

    const playlists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: playlists };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// Create playlist
export const createPlaylist = async (name, description = '') => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    const docRef = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .add({
        title: name,
        description,
        trackIds: [],
        trackCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    return { success: true, playlistId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update playlist
export const updatePlaylist = async (playlistId, updates) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .doc(playlistId)
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .doc(playlistId)
      .delete();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add track to playlist
export const addTrackToPlaylist = async (playlistId, track) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    const playlistRef = firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .doc(playlistId);

    await playlistRef.update({
      trackIds: firestore.FieldValue.arrayUnion(track.id),
      trackCount: firestore.FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    });

    // Also store track data in subcollection for quick access
    await playlistRef
      .collection('tracks')
      .doc(track.id)
      .set({
        ...track,
        addedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove track from playlist
export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    const playlistRef = firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .doc(playlistId);

    await playlistRef.update({
      trackIds: firestore.FieldValue.arrayRemove(trackId),
      trackCount: firestore.FieldValue.increment(-1),
      updatedAt: new Date().toISOString(),
    });

    await playlistRef
      .collection('tracks')
      .doc(trackId)
      .delete();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get playlist tracks
export const getPlaylistTracks = async (playlistId) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated', data: [] };

    const snapshot = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .collection('playlists')
      .doc(playlistId)
      .collection('tracks')
      .orderBy('addedAt', 'asc')
      .get();

    const tracks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: tracks };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

export default {
  // Favorites
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  // History
  getHistory,
  addToHistory,
  clearHistory,
  // Downloads
  getDownloads,
  addToDownloads,
  removeFromDownloads,
  getDownloadsCount,
  // Playlists
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getPlaylistTracks,
};

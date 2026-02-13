// src/services/firebase/musicService.js
import { firestore, storage, collections, storagePaths } from './config';

/**
 * Music Service
 * Handles all music-related data operations (tracks, albums, sessions, podcasts)
 */

// ==================== TRACKS ====================

// Get all tracks
export const getAllTracks = async () => {
  try {
    const snapshot = await firestore()
      .collection(collections.TRACKS)
      .orderBy('createdAt', 'desc')
      .get();

    const tracks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: tracks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get tracks by album
export const getTracksByAlbum = async (albumId) => {
  try {
    const snapshot = await firestore()
      .collection(collections.TRACKS)
      .where('albumId', '==', albumId)
      .orderBy('trackNumber', 'asc')
      .get();

    const tracks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: tracks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get track by ID
export const getTrackById = async (trackId) => {
  try {
    const doc = await firestore()
      .collection(collections.TRACKS)
      .doc(trackId)
      .get();

    if (doc.exists) {
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    return { success: false, error: 'Track not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get track audio URL from Storage
export const getTrackAudioUrl = async (audioPath) => {
  try {
    const url = await storage().ref(audioPath).getDownloadURL();
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== ALBUMS ====================

// Get all albums
export const getAllAlbums = async () => {
  try {
    const snapshot = await firestore()
      .collection(collections.ALBUMS)
      .orderBy('createdAt', 'desc')
      .get();

    const albums = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: albums };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get album by ID
export const getAlbumById = async (albumId) => {
  try {
    const doc = await firestore()
      .collection(collections.ALBUMS)
      .doc(albumId)
      .get();

    if (doc.exists) {
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    return { success: false, error: 'Album not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get new releases (albums from last 30 days)
export const getNewReleases = async (limit = 10) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshot = await firestore()
      .collection(collections.ALBUMS)
      .where('createdAt', '>=', thirtyDaysAgo.toISOString())
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const albums = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: albums };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== SESSIONS ====================

// Get all sessions
export const getAllSessions = async () => {
  try {
    const snapshot = await firestore()
      .collection(collections.SESSIONS)
      .orderBy('duration', 'asc')
      .get();

    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: sessions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get sessions by category
export const getSessionsByCategory = async (category) => {
  try {
    const snapshot = await firestore()
      .collection(collections.SESSIONS)
      .where('category', '==', category)
      .orderBy('duration', 'asc')
      .get();

    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: sessions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== PODCASTS ====================

// Get all podcasts
export const getAllPodcasts = async () => {
  try {
    const snapshot = await firestore()
      .collection(collections.PODCASTS)
      .orderBy('title', 'asc')
      .get();

    const podcasts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: podcasts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get podcast episodes
export const getPodcastEpisodes = async (podcastId) => {
  try {
    const snapshot = await firestore()
      .collection(collections.PODCASTS)
      .doc(podcastId)
      .collection('episodes')
      .orderBy('episodeNumber', 'desc')
      .get();

    const episodes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: episodes };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== CATEGORIES ====================

// Get all categories
export const getAllCategories = async () => {
  try {
    const snapshot = await firestore()
      .collection(collections.CATEGORIES)
      .orderBy('order', 'asc')
      .get();

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get content by category (tracks, sessions, playlists for a category)
export const getContentByCategory = async (categoryId) => {
  try {
    const [tracksSnap, sessionsSnap] = await Promise.all([
      firestore()
        .collection(collections.TRACKS)
        .where('category', '==', categoryId)
        .limit(20)
        .get(),
      firestore()
        .collection(collections.SESSIONS)
        .where('category', '==', categoryId)
        .get(),
    ]);

    return {
      success: true,
      data: {
        tracks: tracksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        sessions: sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== SEARCH ====================

// Search tracks, albums, sessions
export const searchContent = async (query) => {
  try {
    const searchQuery = query.toLowerCase();
    
    // Note: Firestore doesn't support full-text search natively
    // For production, consider Algolia or Elasticsearch
    // This is a simple prefix search
    
    const [tracksSnap, albumsSnap, sessionsSnap] = await Promise.all([
      firestore()
        .collection(collections.TRACKS)
        .orderBy('titleLower')
        .startAt(searchQuery)
        .endAt(searchQuery + '\uf8ff')
        .limit(10)
        .get(),
      firestore()
        .collection(collections.ALBUMS)
        .orderBy('titleLower')
        .startAt(searchQuery)
        .endAt(searchQuery + '\uf8ff')
        .limit(5)
        .get(),
      firestore()
        .collection(collections.SESSIONS)
        .orderBy('titleLower')
        .startAt(searchQuery)
        .endAt(searchQuery + '\uf8ff')
        .limit(5)
        .get(),
    ]);

    return {
      success: true,
      data: {
        tracks: tracksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        albums: albumsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        sessions: sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== PLAYLISTS (Curated) ====================

// Get all curated playlists
export const getCuratedPlaylists = async () => {
  try {
    const snapshot = await firestore()
      .collection(collections.PLAYLISTS)
      .where('isCurated', '==', true)
      .orderBy('order', 'asc')
      .get();

    const playlists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: playlists };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== FEATURED ====================

// Get featured content
export const getFeaturedContent = async () => {
  try {
    const snapshot = await firestore()
      .collection('featured')
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    
    // Return default featured if none in database
    return { 
      success: true, 
      data: {
        id: 'default',
        title: 'Northern Lights',
        subtitle: "TONIGHT'S FEATURED",
        description: 'A magical journey under the aurora',
        duration: '45 min',
        gradient: 'aurora',
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  // Tracks
  getAllTracks,
  getTracksByAlbum,
  getTrackById,
  getTrackAudioUrl,
  // Albums
  getAllAlbums,
  getAlbumById,
  getNewReleases,
  // Sessions
  getAllSessions,
  getSessionsByCategory,
  // Podcasts
  getAllPodcasts,
  getPodcastEpisodes,
  // Categories
  getAllCategories,
  getContentByCategory,
  // Search
  searchContent,
  // Playlists
  getCuratedPlaylists,
  // Featured
  getFeaturedContent,
};

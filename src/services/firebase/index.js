// src/services/firebase/index.js

// Firebase configuration
export * from './config';

// Services
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as musicService } from './musicService';
export { default as libraryService } from './libraryService';

// Individual auth functions for convenience
export {
  signUpWithEmail,
  signInWithEmail,
  signOut,
  sendPasswordReset,
  getCurrentUser,
  onAuthStateChanged,
} from './authService';

// Individual user functions
export {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  upgradeToPremium,
  cancelPremium,
  checkPremiumStatus,
} from './userService';

// Individual music functions
export {
  getAllTracks,
  getTracksByAlbum,
  getTrackById,
  getTrackAudioUrl,
  getAllAlbums,
  getAlbumById,
  getNewReleases,
  getAllSessions,
  getSessionsByCategory,
  getAllPodcasts,
  getPodcastEpisodes,
  getAllCategories,
  getContentByCategory,
  searchContent,
  getCuratedPlaylists,
} from './musicService';

// Individual library functions
export {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getHistory,
  addToHistory,
  clearHistory,
  getDownloads,
  addToDownloads,
  removeFromDownloads,
  getDownloadsCount,
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getPlaylistTracks,
} from './libraryService';

// src/services/firebase/config.js
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase is auto-initialized with google-services.json (Android) 
// and GoogleService-Info.plist (iOS)

// Export Firebase services
export { auth, firestore, storage };

// Collection references
export const collections = {
  USERS: 'users',
  TRACKS: 'tracks',
  ALBUMS: 'albums',
  PLAYLISTS: 'playlists',
  SESSIONS: 'sessions',
  PODCASTS: 'podcasts',
  CATEGORIES: 'categories',
  USER_PLAYLISTS: 'userPlaylists',
  USER_FAVORITES: 'userFavorites',
  USER_HISTORY: 'userHistory',
  USER_DOWNLOADS: 'userDownloads',
};

// Storage paths
export const storagePaths = {
  AUDIO: 'audio',
  COVERS: 'covers',
  AVATARS: 'avatars',
};

export default firebase;

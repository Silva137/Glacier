import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -------------------- */
/* Context */
/* -------------------- */
export const PlayerContext = createContext(null);

/* -------------------- */
/* Storage keys */
/* -------------------- */
const STORAGE_KEYS = {
  FAVORITES: '@glacier_favorites',
  HISTORY: '@glacier_history',
  PLAYLISTS: '@glacier_playlists',
  NOTIFICATIONS: '@glacier_notifications',
  USER_PLAYLISTS: '@glacier_user_playlists',
  DOWNLOAD_QUALITY: '@glacier_download_quality',
  DOWNLOADS: '@glacier_downloads',
  IS_PREMIUM: '@glacier_is_premium',
  PRIVACY_SETTINGS: '@glacier_privacy_settings',
};

/* -------------------- */
/* Constants */
/* -------------------- */
const FREE_DOWNLOAD_LIMIT = 3;
const MAX_HISTORY_ITEMS = 100;

/* -------------------- */
/* Provider */
/* -------------------- */
export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  
  // User created playlists
  const [userPlaylists, setUserPlaylists] = useState([]);
  
  // Downloads
  const [downloads, setDownloads] = useState([]);
  
  // Premium status
  const [isPremium, setIsPremium] = useState(false);
  
  // Notifications state with default values
  const [notifications, setNotifications] = useState({
    newReleases: true,
    recommendations: true,
    reminders: false,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    analytics: true,
    saveHistory: true,
  });
  
  // Download quality setting
  const [downloadQuality, setDownloadQuality] = useState('medium');
  
  // Sleep timer
  const [sleepTimer, setSleepTimer] = useState(null);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);

  /* ---------- Load persisted data ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fav, hist, pls, notif, userPls, dlQuality, dls, premium, privacy] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
          AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS),
          AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
          AsyncStorage.getItem(STORAGE_KEYS.USER_PLAYLISTS),
          AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_QUALITY),
          AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADS),
          AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM),
          AsyncStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS),
        ]);

        if (fav) setFavorites(JSON.parse(fav));
        if (hist) setHistory(JSON.parse(hist));
        if (pls) setPlaylists(JSON.parse(pls));
        if (notif) setNotifications(JSON.parse(notif));
        if (userPls) setUserPlaylists(JSON.parse(userPls));
        if (dlQuality) setDownloadQuality(dlQuality);
        if (dls) setDownloads(JSON.parse(dls));
        if (premium) setIsPremium(JSON.parse(premium));
        if (privacy) setPrivacySettings(JSON.parse(privacy));
      } catch (e) {
        console.log('Storage load error', e);
      }
    };

    loadData();
  }, []);

  /* ---------- Persist ---------- */
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify(history)
    );
  }, [history]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.PLAYLISTS,
      JSON.stringify(playlists)
    );
  }, [playlists]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.USER_PLAYLISTS,
      JSON.stringify(userPlaylists)
    );
  }, [userPlaylists]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.DOWNLOAD_QUALITY,
      downloadQuality
    );
  }, [downloadQuality]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.DOWNLOADS,
      JSON.stringify(downloads)
    );
  }, [downloads]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.IS_PREMIUM,
      JSON.stringify(isPremium)
    );
  }, [isPremium]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.PRIVACY_SETTINGS,
      JSON.stringify(privacySettings)
    );
  }, [privacySettings]);

  /* ---------- Player logic ---------- */
  const playTrack = useCallback((track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);

    // Only save to history if privacy setting allows
    if (privacySettings.saveHistory) {
      setHistory((prev) => {
        // Remove duplicate if exists
        const filtered = prev.filter(t => t.id !== track.id);
        return [
          { ...track, playedAt: Date.now() },
          ...filtered.slice(0, MAX_HISTORY_ITEMS - 1),
        ];
      });
    }
  }, [privacySettings.saveHistory]);

  const pause = () => setIsPlaying(false);
  const resume = () => currentTrack && setIsPlaying(true);
  const togglePlayPause = () =>
    isPlaying ? pause() : resume();

  /* ---------- Favorites ---------- */
  const toggleFavorite = (track) => {
    setFavorites((prev) =>
      prev.find((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track]
    );
  };

  const isFavorite = (track) => {
    return favorites.some(f => f.id === track.id);
  };

  /* ---------- History ---------- */
  const clearHistory = () => {
    setHistory([]);
  };

  /* ---------- Downloads ---------- */
  const isDownloaded = (track) => {
    return downloads.some(d => d.id === track.id);
  };

  const canDownload = () => {
    return isPremium || downloads.length < FREE_DOWNLOAD_LIMIT;
  };

  const addToDownloads = (track) => {
    // Check if already downloaded
    if (isDownloaded(track)) {
      return { success: false, reason: 'already_downloaded' };
    }
    
    // Check download limit for free users
    if (!isPremium && downloads.length >= FREE_DOWNLOAD_LIMIT) {
      return { success: false, reason: 'limit_reached' };
    }
    
    // Add to downloads
    setDownloads(prev => [...prev, { ...track, downloadedAt: Date.now() }]);
    return { success: true };
  };

  const removeFromDownloads = (trackId) => {
    setDownloads(prev => prev.filter(d => d.id !== trackId));
  };

  /* ---------- Premium ---------- */
  const activatePremium = () => {
    setIsPremium(true);
  };

  const deactivatePremium = () => {
    setIsPremium(false);
  };

  /* ---------- User Playlists ---------- */
  const createPlaylist = (name, tracks = []) => {
    const newPlaylist = {
      id: `user_playlist_${Date.now()}`,
      title: name,
      tracks: tracks.length,
      trackList: tracks,
      createdAt: Date.now(),
    };
    setUserPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setUserPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const addToPlaylist = (playlistId, track) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const newTrackList = [...(p.trackList || []), track];
        return { ...p, trackList: newTrackList, tracks: newTrackList.length };
      }
      return p;
    }));
  };

  /* ---------- Sleep Timer ---------- */
  const setSleepTimerValue = (minutes) => {
    setSleepTimer(minutes);
    setSleepTimerActive(true);
  };

  const cancelSleepTimer = () => {
    setSleepTimer(null);
    setSleepTimerActive(false);
  };

  /* ---------- Track Navigation ---------- */
  const clearTrack = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
  };

  const playNext = () => {
    // Find current track in history and play the previous one (newer)
    // Or just play a random track from history for now
    if (history.length > 1) {
      const currentIndex = history.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex > 0) {
        // Play the previous item in history (which was played more recently)
        playTrack(history[currentIndex - 1]);
      } else if (history.length > 0) {
        // Play the next item
        playTrack(history[Math.min(1, history.length - 1)]);
      }
    }
  };

  const playPrevious = () => {
    // Find current track in history and play the next one (older)
    if (history.length > 1) {
      const currentIndex = history.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex >= 0 && currentIndex < history.length - 1) {
        playTrack(history[currentIndex + 1]);
      }
    }
  };

  /* ---------- Context value ---------- */
  const value = {
    currentTrack,
    isPlaying,
    progress,

    playTrack,
    pause,
    resume,
    togglePlayPause,
    clearTrack,
    playNext,
    playPrevious,

    favorites,
    toggleFavorite,
    isFavorite,

    history,
    clearHistory,
    
    playlists,
    
    // User playlists
    userPlaylists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    
    // Downloads
    downloads,
    isDownloaded,
    canDownload,
    addToDownloads,
    removeFromDownloads,
    
    // Premium
    isPremium,
    activatePremium,
    deactivatePremium,
    
    // Notifications
    notifications,
    setNotifications,
    
    // Privacy
    privacySettings,
    setPrivacySettings,
    
    // Download quality
    downloadQuality,
    setDownloadQuality,
    
    // Sleep timer
    sleepTimer,
    sleepTimerActive,
    setSleepTimerValue,
    cancelSleepTimer,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

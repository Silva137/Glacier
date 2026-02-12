import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRACKS, SESSIONS } from '../constants/data';

export const PlayerContext = createContext(null);

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

const FREE_DOWNLOAD_LIMIT = 3;
const MAX_HISTORY_ITEMS = 100;

// Parse duration string to seconds
const parseDuration = (durationStr) => {
  if (!durationStr) return 270;
  
  if (durationStr.includes('min')) {
    const mins = parseInt(durationStr.replace(' min', ''));
    return mins * 60;
  }
  
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  
  return 270;
};

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [isSeeking, setIsSeeking] = useState(false); // Track if user is seeking
  
  const [repeatMode, setRepeatMode] = useState('off');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  
  const [notifications, setNotifications] = useState({
    newReleases: true,
    recommendations: true,
    reminders: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    analytics: true,
    saveHistory: true,
  });
  
  const [downloadQuality, setDownloadQuality] = useState('medium');
  const [sleepTimer, setSleepTimer] = useState(null);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);

  const progressInterval = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
    setQueue(TRACKS);
  }, []);

  /* ---------- Progress simulation - only when NOT seeking ---------- */
  useEffect(() => {
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    // Only run interval if playing, has track, has duration, and NOT seeking
    if (isPlaying && currentTrack && duration > 0 && !isSeeking) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleTrackEnd();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isPlaying, currentTrack, duration, isSeeking, repeatMode, shuffleEnabled]);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      playNextInternal();
    }
  };

  /* ---------- Persist ---------- */
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.USER_PLAYLISTS, JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.DOWNLOAD_QUALITY, downloadQuality);
  }, [downloadQuality]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, JSON.stringify(isPremium));
  }, [isPremium]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(privacySettings));
  }, [privacySettings]);

  /* ---------- Player logic ---------- */
  const playTrack = useCallback((track, trackQueue = null) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setIsSeeking(false);
    
    const trackDuration = parseDuration(track.duration);
    setDuration(trackDuration);

    if (trackQueue) {
      setQueue(trackQueue);
    } else if (track.type === 'session') {
      setQueue(SESSIONS);
    }

    if (privacySettings.saveHistory) {
      setHistory((prev) => {
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
  const togglePlayPause = () => isPlaying ? pause() : resume();

  // Start seeking - pauses the progress interval
  const startSeeking = () => {
    setIsSeeking(true);
  };

  // Seek to position (0-100 percentage) and resume
  const seekTo = (percentage) => {
    const newTime = Math.floor((percentage / 100) * duration);
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
    setIsSeeking(false); // Resume progress updates
  };

  // Seek to specific time in seconds
  const seekToTime = (seconds) => {
    setCurrentTime(Math.max(0, Math.min(duration, Math.floor(seconds))));
    setIsSeeking(false);
  };

  /* ---------- Repeat & Shuffle ---------- */
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setShuffleEnabled(prev => !prev);
  };

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
    if (isDownloaded(track)) {
      return { success: false, reason: 'already_downloaded' };
    }
    
    if (!isPremium && downloads.length >= FREE_DOWNLOAD_LIMIT) {
      return { success: false, reason: 'limit_reached' };
    }
    
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
    setCurrentTime(0);
    setDuration(0);
    setIsSeeking(false);
  };

  const setPlayQueue = (tracks) => {
    setQueue(tracks);
  };

  const playNextInternal = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    
    if (shuffleEnabled) {
      const availableTracks = queue.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        playTrack(availableTracks[randomIndex], queue);
      }
    } else if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1], queue);
    } else if (repeatMode === 'all' && queue.length > 0) {
      playTrack(queue[0], queue);
    }
  };

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    
    if (shuffleEnabled) {
      const availableTracks = queue.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        playTrack(availableTracks[randomIndex], queue);
      }
    } else if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1], queue);
    } else if (queue.length > 0) {
      playTrack(queue[0], queue);
    }
  };

  const playPrevious = () => {
    if (!currentTrack || queue.length === 0) return;
    
    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1], queue);
    } else if (queue.length > 0) {
      playTrack(queue[queue.length - 1], queue);
    }
  };

  /* ---------- Context value ---------- */
  const value = {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    isSeeking,

    playTrack,
    pause,
    resume,
    togglePlayPause,
    clearTrack,
    playNext,
    playPrevious,
    setPlayQueue,
    startSeeking,
    seekTo,
    seekToTime,
    queue,

    repeatMode,
    toggleRepeat,
    shuffleEnabled,
    toggleShuffle,

    favorites,
    toggleFavorite,
    isFavorite,

    history,
    clearHistory,
    
    playlists,
    
    userPlaylists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    
    downloads,
    isDownloaded,
    canDownload,
    addToDownloads,
    removeFromDownloads,
    
    isPremium,
    activatePremium,
    deactivatePremium,
    
    notifications,
    setNotifications,
    
    privacySettings,
    setPrivacySettings,
    
    downloadQuality,
    setDownloadQuality,
    
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

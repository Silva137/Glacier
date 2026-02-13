// src/context/DataContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { musicService } from '../services/firebase';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Data states
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [featured, setFeatured] = useState(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        tracksResult,
        albumsResult,
        sessionsResult,
        podcastsResult,
        categoriesResult,
        playlistsResult,
        featuredResult,
      ] = await Promise.all([
        musicService.getAllTracks(),
        musicService.getAllAlbums(),
        musicService.getAllSessions(),
        musicService.getAllPodcasts(),
        musicService.getAllCategories(),
        musicService.getCuratedPlaylists(),
        musicService.getFeaturedContent(),
      ]);

      if (tracksResult.success) setTracks(tracksResult.data);
      if (albumsResult.success) setAlbums(albumsResult.data);
      if (sessionsResult.success) setSessions(sessionsResult.data);
      if (podcastsResult.success) setPodcasts(podcastsResult.data);
      if (categoriesResult.success) setCategories(categoriesResult.data);
      if (playlistsResult.success) setPlaylists(playlistsResult.data);
      if (featuredResult.success) setFeatured(featuredResult.data);

      console.log('✅ Data loaded from Firebase');
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get tracks by album
  const getTracksByAlbum = useCallback((albumId) => {
    return tracks.filter(t => t.albumId === albumId).sort((a, b) => a.trackNumber - b.trackNumber);
  }, [tracks]);

  // Get sessions by category
  const getSessionsByCategory = useCallback((categoryId) => {
    return sessions.filter(s => s.category === categoryId);
  }, [sessions]);

  // Get tracks by category
  const getTracksByCategory = useCallback((categoryId) => {
    return tracks.filter(t => t.category === categoryId);
  }, [tracks]);

  // Get albums by category
  const getAlbumsByCategory = useCallback((categoryId) => {
    return albums.filter(a => a.category === categoryId);
  }, [albums]);

  // Search content
  const searchContent = useCallback((query) => {
    const q = query.toLowerCase();
    return {
      tracks: tracks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q)
      ),
      albums: albums.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.artist.toLowerCase().includes(q)
      ),
      sessions: sessions.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q)
      ),
      podcasts: podcasts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      ),
    };
  }, [tracks, albums, sessions, podcasts]);

  // Get new releases (most recent albums)
  const getNewReleases = useCallback((limit = 10) => {
    return [...albums]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }, [albums]);

  // Get popular tracks
  const getPopularTracks = useCallback((limit = 10) => {
    return [...tracks]
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, limit);
  }, [tracks]);

  // Refresh data
  const refreshData = useCallback(() => {
    loadAllData();
  }, []);

  const value = {
    // Data
    tracks,
    albums,
    sessions,
    podcasts,
    categories,
    playlists,
    featured,

    // States
    isLoading,
    error,

    // Methods
    getTracksByAlbum,
    getSessionsByCategory,
    getTracksByCategory,
    getAlbumsByCategory,
    searchContent,
    getNewReleases,
    getPopularTracks,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

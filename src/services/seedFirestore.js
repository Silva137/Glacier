// src/scripts/seedFirestore.js
// Run this ONCE to populate your Firestore database with initial data
// You can run it from a button in your app or from a separate Node.js script

import firestore from '@react-native-firebase/firestore';

// ==================== CATEGORIES ====================
const CATEGORIES = [
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Wind down and rest peacefully',
    icon: 'moon',
    gradient: ['#1a2a4a', '#0a1a2a'],
    accentColor: '#6b8cce',
    order: 1,
    isActive: true,
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Enhance concentration and productivity',
    icon: 'bulb',
    gradient: ['#2a3a2a', '#1a2a1a'],
    accentColor: '#7bc5a3',
    order: 2,
    isActive: true,
  },
  {
    id: 'relax',
    title: 'Relax',
    description: 'Unwind and release tension',
    icon: 'leaf',
    gradient: ['#2a4a4a', '#1a3a3a'],
    accentColor: '#4a9a9a',
    order: 3,
    isActive: true,
  },
  {
    id: 'meditate',
    title: 'Meditate',
    description: 'Find inner peace and mindfulness',
    icon: 'flower',
    gradient: ['#3a2a4a', '#2a1a3a'],
    accentColor: '#a17bc5',
    order: 4,
    isActive: true,
  },
];

// ==================== ALBUMS ====================
const ALBUMS = [
  {
    id: 'arctic_dreams',
    title: 'Arctic Dreams',
    titleLower: 'arctic dreams',
    artist: 'Glacier',
    description: 'A journey through frozen landscapes',
    trackCount: 12,
    totalDuration: '52:30',
    category: 'sleep',
    tags: ['ambient', 'nature', 'sleep'],
    coverPath: 'covers/albums/arctic_dreams.jpg',
    gradient: 'aurora',
    isPremium: false,
    releaseDate: '2024-01-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'polar_nights',
    title: 'Polar Nights',
    titleLower: 'polar nights',
    artist: 'Glacier',
    description: 'Sounds of the endless night',
    trackCount: 10,
    totalDuration: '45:20',
    category: 'sleep',
    tags: ['ambient', 'night', 'calm'],
    coverPath: 'covers/albums/polar_nights.jpg',
    gradient: 'twilight',
    isPremium: false,
    releaseDate: '2024-01-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'forest_whispers',
    title: 'Forest Whispers',
    titleLower: 'forest whispers',
    artist: 'Glacier',
    description: 'Peaceful sounds from the woodland',
    trackCount: 8,
    totalDuration: '38:15',
    category: 'relax',
    tags: ['nature', 'forest', 'peaceful'],
    coverPath: 'covers/albums/forest_whispers.jpg',
    gradient: 'forest',
    isPremium: false,
    releaseDate: '2024-02-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ocean_depths',
    title: 'Ocean Depths',
    titleLower: 'ocean depths',
    artist: 'Glacier',
    description: 'Dive into tranquil waters',
    trackCount: 9,
    totalDuration: '42:00',
    category: 'relax',
    tags: ['ocean', 'water', 'calm'],
    coverPath: 'covers/albums/ocean_depths.jpg',
    gradient: 'ocean',
    isPremium: false,
    releaseDate: '2024-02-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mountain_peace',
    title: 'Mountain Peace',
    titleLower: 'mountain peace',
    artist: 'Glacier',
    description: 'Serenity from the peaks',
    trackCount: 7,
    totalDuration: '35:45',
    category: 'meditate',
    tags: ['mountain', 'peaceful', 'meditation'],
    coverPath: 'covers/albums/mountain_peace.jpg',
    gradient: 'horizon',
    isPremium: true,
    releaseDate: '2024-03-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'focus_flow',
    title: 'Focus Flow',
    titleLower: 'focus flow',
    artist: 'Glacier',
    description: 'Music for deep concentration',
    trackCount: 10,
    totalDuration: '48:30',
    category: 'focus',
    tags: ['focus', 'work', 'productivity'],
    coverPath: 'covers/albums/focus_flow.jpg',
    gradient: 'aurora',
    isPremium: false,
    releaseDate: '2024-03-15',
    createdAt: new Date().toISOString(),
  },
];

// ==================== TRACKS ====================
const TRACKS = [
  // Arctic Dreams tracks
  { id: 'track_001', title: 'Frozen Lake', artist: 'Glacier', duration: '4:32', durationSeconds: 272, albumId: 'arctic_dreams', albumTitle: 'Arctic Dreams', trackNumber: 1, category: 'sleep', audioPath: 'audio/tracks/frozen_lake.mp3', gradient: 'aurora', isPremium: false },
  { id: 'track_002', title: 'Snowfall at Dusk', artist: 'Glacier', duration: '5:18', durationSeconds: 318, albumId: 'arctic_dreams', albumTitle: 'Arctic Dreams', trackNumber: 2, category: 'sleep', audioPath: 'audio/tracks/snowfall_at_dusk.mp3', gradient: 'aurora', isPremium: false },
  { id: 'track_003', title: 'Ice Crystals', artist: 'Glacier', duration: '3:45', durationSeconds: 225, albumId: 'arctic_dreams', albumTitle: 'Arctic Dreams', trackNumber: 3, category: 'sleep', audioPath: 'audio/tracks/ice_crystals.mp3', gradient: 'aurora', isPremium: false },
  { id: 'track_004', title: 'Northern Lights', artist: 'Glacier', duration: '6:12', durationSeconds: 372, albumId: 'arctic_dreams', albumTitle: 'Arctic Dreams', trackNumber: 4, category: 'sleep', audioPath: 'audio/tracks/northern_lights.mp3', gradient: 'aurora', isPremium: false },
  { id: 'track_005', title: 'Winter Solstice', artist: 'Glacier', duration: '4:55', durationSeconds: 295, albumId: 'arctic_dreams', albumTitle: 'Arctic Dreams', trackNumber: 5, category: 'sleep', audioPath: 'audio/tracks/winter_solstice.mp3', gradient: 'aurora', isPremium: false },
  
  // Polar Nights tracks
  { id: 'track_006', title: 'Midnight Aurora', artist: 'Glacier', duration: '5:30', durationSeconds: 330, albumId: 'polar_nights', albumTitle: 'Polar Nights', trackNumber: 1, category: 'sleep', audioPath: 'audio/tracks/midnight_aurora.mp3', gradient: 'twilight', isPremium: false },
  { id: 'track_007', title: 'Glacier Valley', artist: 'Glacier', duration: '4:48', durationSeconds: 288, albumId: 'polar_nights', albumTitle: 'Polar Nights', trackNumber: 2, category: 'sleep', audioPath: 'audio/tracks/glacier_valley.mp3', gradient: 'twilight', isPremium: false },
  { id: 'track_008', title: 'Silent Snow', artist: 'Glacier', duration: '3:55', durationSeconds: 235, albumId: 'polar_nights', albumTitle: 'Polar Nights', trackNumber: 3, category: 'sleep', audioPath: 'audio/tracks/silent_snow.mp3', gradient: 'twilight', isPremium: false },
  
  // Forest Whispers tracks
  { id: 'track_009', title: 'Morning Dew', artist: 'Glacier', duration: '4:20', durationSeconds: 260, albumId: 'forest_whispers', albumTitle: 'Forest Whispers', trackNumber: 1, category: 'relax', audioPath: 'audio/tracks/morning_dew.mp3', gradient: 'forest', isPremium: false },
  { id: 'track_010', title: 'Gentle Stream', artist: 'Glacier', duration: '5:10', durationSeconds: 310, albumId: 'forest_whispers', albumTitle: 'Forest Whispers', trackNumber: 2, category: 'relax', audioPath: 'audio/tracks/gentle_stream.mp3', gradient: 'forest', isPremium: false },
  { id: 'track_011', title: 'Birdsong', artist: 'Glacier', duration: '3:40', durationSeconds: 220, albumId: 'forest_whispers', albumTitle: 'Forest Whispers', trackNumber: 3, category: 'relax', audioPath: 'audio/tracks/birdsong.mp3', gradient: 'forest', isPremium: false },
  
  // Ocean Depths tracks
  { id: 'track_012', title: 'Deep Blue', artist: 'Glacier', duration: '6:00', durationSeconds: 360, albumId: 'ocean_depths', albumTitle: 'Ocean Depths', trackNumber: 1, category: 'relax', audioPath: 'audio/tracks/deep_blue.mp3', gradient: 'ocean', isPremium: false },
  { id: 'track_013', title: 'Coral Dreams', artist: 'Glacier', duration: '4:45', durationSeconds: 285, albumId: 'ocean_depths', albumTitle: 'Ocean Depths', trackNumber: 2, category: 'relax', audioPath: 'audio/tracks/coral_dreams.mp3', gradient: 'ocean', isPremium: false },
  { id: 'track_014', title: 'Tidal Waves', artist: 'Glacier', duration: '5:25', durationSeconds: 325, albumId: 'ocean_depths', albumTitle: 'Ocean Depths', trackNumber: 3, category: 'relax', audioPath: 'audio/tracks/tidal_waves.mp3', gradient: 'ocean', isPremium: false },
  
  // Focus Flow tracks
  { id: 'track_015', title: 'Clear Mind', artist: 'Glacier', duration: '5:00', durationSeconds: 300, albumId: 'focus_flow', albumTitle: 'Focus Flow', trackNumber: 1, category: 'focus', audioPath: 'audio/tracks/clear_mind.mp3', gradient: 'aurora', isPremium: false },
  { id: 'track_016', title: 'Deep Work', artist: 'Glacier', duration: '6:30', durationSeconds: 390, albumId: 'focus_flow', albumTitle: 'Focus Flow', trackNumber: 2, category: 'focus', audioPath: 'audio/tracks/deep_work.mp3', gradient: 'aurora', isPremium: false },
  { id: 'track_017', title: 'Flow State', artist: 'Glacier', duration: '5:45', durationSeconds: 345, albumId: 'focus_flow', albumTitle: 'Focus Flow', trackNumber: 3, category: 'focus', audioPath: 'audio/tracks/flow_state.mp3', gradient: 'aurora', isPremium: false },
  
  // Mountain Peace tracks
  { id: 'track_018', title: 'Summit Silence', artist: 'Glacier', duration: '7:00', durationSeconds: 420, albumId: 'mountain_peace', albumTitle: 'Mountain Peace', trackNumber: 1, category: 'meditate', audioPath: 'audio/tracks/summit_silence.mp3', gradient: 'horizon', isPremium: true },
  { id: 'track_019', title: 'Valley Mist', artist: 'Glacier', duration: '5:30', durationSeconds: 330, albumId: 'mountain_peace', albumTitle: 'Mountain Peace', trackNumber: 2, category: 'meditate', audioPath: 'audio/tracks/valley_mist.mp3', gradient: 'horizon', isPremium: true },
  { id: 'track_020', title: 'Eagle Flight', artist: 'Glacier', duration: '4:15', durationSeconds: 255, albumId: 'mountain_peace', albumTitle: 'Mountain Peace', trackNumber: 3, category: 'meditate', audioPath: 'audio/tracks/eagle_flight.mp3', gradient: 'horizon', isPremium: true },
];

// ==================== SESSIONS ====================
const SESSIONS = [
  // Sleep sessions
  { id: 'session_001', title: 'Deep Sleep', description: 'Drift into restful slumber', duration: '45 min', durationSeconds: 2700, category: 'sleep', type: 'guided', audioPath: 'audio/sessions/deep_sleep.mp3', gradient: 'twilight', isPremium: false, playCount: 5234 },
  { id: 'session_002', title: 'Sleep Stories', description: 'Calming bedtime tales', duration: '30 min', durationSeconds: 1800, category: 'sleep', type: 'story', audioPath: 'audio/sessions/sleep_stories.mp3', gradient: 'night', isPremium: false, playCount: 3421 },
  { id: 'session_003', title: 'Rain Sounds', description: 'Gentle rainfall for sleep', duration: '60 min', durationSeconds: 3600, category: 'sleep', type: 'soundscape', audioPath: 'audio/sessions/rain_sounds.mp3', gradient: 'ocean', isPremium: false, playCount: 8932 },
  
  // Focus sessions
  { id: 'session_004', title: 'Deep Work', description: 'Pomodoro focus session', duration: '25 min', durationSeconds: 1500, category: 'focus', type: 'timed', audioPath: 'audio/sessions/deep_work.mp3', gradient: 'aurora', isPremium: false, playCount: 4521 },
  { id: 'session_005', title: 'Flow State', description: 'Enter the zone', duration: '45 min', durationSeconds: 2700, category: 'focus', type: 'music', audioPath: 'audio/sessions/flow_state.mp3', gradient: 'forest', isPremium: false, playCount: 3892 },
  { id: 'session_006', title: 'Study Session', description: 'Concentration music', duration: '60 min', durationSeconds: 3600, category: 'focus', type: 'music', audioPath: 'audio/sessions/study_session.mp3', gradient: 'aurora', isPremium: true, playCount: 2341 },
  
  // Relax sessions
  { id: 'session_007', title: 'Stress Relief', description: 'Let go of tension', duration: '20 min', durationSeconds: 1200, category: 'relax', type: 'guided', audioPath: 'audio/sessions/stress_relief.mp3', gradient: 'ocean', isPremium: false, playCount: 6234 },
  { id: 'session_008', title: 'Nature Escape', description: 'Forest and stream sounds', duration: '30 min', durationSeconds: 1800, category: 'relax', type: 'soundscape', audioPath: 'audio/sessions/nature_escape.mp3', gradient: 'forest', isPremium: false, playCount: 4123 },
  { id: 'session_009', title: 'Spa Session', description: 'Peaceful relaxation', duration: '45 min', durationSeconds: 2700, category: 'relax', type: 'music', audioPath: 'audio/sessions/spa_session.mp3', gradient: 'horizon', isPremium: true, playCount: 1892 },
  
  // Meditate sessions
  { id: 'session_010', title: 'Morning Meditation', description: 'Start your day mindfully', duration: '10 min', durationSeconds: 600, category: 'meditate', type: 'guided', audioPath: 'audio/sessions/morning_meditation.mp3', gradient: 'horizon', isPremium: false, playCount: 7823 },
  { id: 'session_011', title: 'Breathing Exercise', description: 'Guided breathwork', duration: '15 min', durationSeconds: 900, category: 'meditate', type: 'guided', audioPath: 'audio/sessions/breathing_exercise.mp3', gradient: 'twilight', isPremium: false, playCount: 5234 },
  { id: 'session_012', title: 'Body Scan', description: 'Full body relaxation', duration: '20 min', durationSeconds: 1200, category: 'meditate', type: 'guided', audioPath: 'audio/sessions/body_scan.mp3', gradient: 'night', isPremium: false, playCount: 3421 },
];

// ==================== PODCASTS ====================
const PODCASTS = [
  {
    id: 'podcast_001',
    title: 'Ambient Horizons',
    titleLower: 'ambient horizons',
    description: 'Weekly ambient soundscapes and relaxation',
    author: 'Glacier',
    episodeCount: 24,
    coverPath: 'covers/podcasts/ambient_horizons.jpg',
    gradient: 'horizon',
    isPremium: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'podcast_002',
    title: 'Sleep Soundscapes',
    titleLower: 'sleep soundscapes',
    description: 'Nightly relaxation journeys',
    author: 'Glacier',
    episodeCount: 52,
    coverPath: 'covers/podcasts/sleep_soundscapes.jpg',
    gradient: 'twilight',
    isPremium: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'podcast_003',
    title: "Nature's Symphony",
    titleLower: "nature's symphony",
    description: 'Natural world in sound',
    author: 'Glacier',
    episodeCount: 18,
    coverPath: 'covers/podcasts/natures_symphony.jpg',
    gradient: 'forest',
    isPremium: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'podcast_004',
    title: 'Meditation Moments',
    titleLower: 'meditation moments',
    description: 'Daily mindfulness practices',
    author: 'Glacier',
    episodeCount: 100,
    coverPath: 'covers/podcasts/meditation_moments.jpg',
    gradient: 'aurora',
    isPremium: true,
    createdAt: new Date().toISOString(),
  },
];

// Podcast episodes generator
const generateEpisodes = (podcastId, count) => {
  const episodes = [];
  for (let i = 1; i <= Math.min(count, 10); i++) {
    episodes.push({
      id: `${podcastId}_ep_${i}`,
      title: `Episode ${i}`,
      description: `Episode ${i} description`,
      episodeNumber: i,
      seasonNumber: 1,
      duration: `${20 + Math.floor(Math.random() * 25)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      durationSeconds: 1200 + Math.floor(Math.random() * 1500),
      audioPath: `audio/podcasts/${podcastId}/ep_${String(i).padStart(3, '0')}.mp3`,
      publishedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return episodes;
};

// ==================== CURATED PLAYLISTS ====================
const PLAYLISTS = [
  {
    id: 'playlist_001',
    title: 'Deep Focus',
    titleLower: 'deep focus',
    description: 'Music for concentration and productivity',
    trackIds: ['track_015', 'track_016', 'track_017', 'track_001', 'track_006'],
    trackCount: 5,
    coverPath: 'covers/playlists/deep_focus.jpg',
    gradient: 'aurora',
    category: 'focus',
    isCurated: true,
    isFeatured: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'playlist_002',
    title: 'Bedtime Essentials',
    titleLower: 'bedtime essentials',
    description: 'Perfect tracks for sleep',
    trackIds: ['track_001', 'track_002', 'track_003', 'track_006', 'track_007', 'track_008'],
    trackCount: 6,
    coverPath: 'covers/playlists/bedtime_essentials.jpg',
    gradient: 'twilight',
    category: 'sleep',
    isCurated: true,
    isFeatured: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'playlist_003',
    title: 'Nature Sounds',
    titleLower: 'nature sounds',
    description: 'Relaxing sounds from nature',
    trackIds: ['track_009', 'track_010', 'track_011', 'track_012', 'track_013'],
    trackCount: 5,
    coverPath: 'covers/playlists/nature_sounds.jpg',
    gradient: 'forest',
    category: 'relax',
    isCurated: true,
    isFeatured: false,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'playlist_004',
    title: 'Meditation Journey',
    titleLower: 'meditation journey',
    description: 'Tracks for mindful meditation',
    trackIds: ['track_018', 'track_019', 'track_020', 'track_004', 'track_005'],
    trackCount: 5,
    coverPath: 'covers/playlists/meditation_journey.jpg',
    gradient: 'horizon',
    category: 'meditate',
    isCurated: true,
    isFeatured: false,
    order: 4,
    createdAt: new Date().toISOString(),
  },
];

// ==================== FEATURED CONTENT ====================
const FEATURED = {
  id: 'featured_001',
  title: 'Northern Lights',
  subtitle: "TONIGHT'S FEATURED SESSION",
  description: 'A magical journey under the aurora',
  duration: '45 min',
  durationSeconds: 2700,
  type: 'session',
  audioPath: 'audio/featured/northern_lights.mp3',
  gradient: 'aurora',
  isActive: true,
  createdAt: new Date().toISOString(),
};

// ==================== SEED FUNCTION ====================
export const seedFirestore = async () => {
  const db = firestore();
  const batch = db.batch();

  console.log('🌱 Starting Firestore seed...');

  try {
    // Seed Categories
    console.log('📁 Seeding categories...');
    for (const category of CATEGORIES) {
      const ref = db.collection('categories').doc(category.id);
      batch.set(ref, { ...category, createdAt: new Date().toISOString() });
    }

    // Seed Albums
    console.log('💿 Seeding albums...');
    for (const album of ALBUMS) {
      const ref = db.collection('albums').doc(album.id);
      batch.set(ref, album);
    }

    // Seed Tracks
    console.log('🎵 Seeding tracks...');
    for (const track of TRACKS) {
      const ref = db.collection('tracks').doc(track.id);
      batch.set(ref, {
        ...track,
        titleLower: track.title.toLowerCase(),
        playCount: Math.floor(Math.random() * 5000),
        favoriteCount: Math.floor(Math.random() * 500),
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Sessions
    console.log('🧘 Seeding sessions...');
    for (const session of SESSIONS) {
      const ref = db.collection('sessions').doc(session.id);
      batch.set(ref, {
        ...session,
        titleLower: session.title.toLowerCase(),
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Playlists
    console.log('📋 Seeding playlists...');
    for (const playlist of PLAYLISTS) {
      const ref = db.collection('playlists').doc(playlist.id);
      batch.set(ref, playlist);
    }

    // Seed Featured
    console.log('⭐ Seeding featured content...');
    const featuredRef = db.collection('featured').doc(FEATURED.id);
    batch.set(featuredRef, FEATURED);

    // Commit batch
    await batch.commit();
    console.log('✅ Batch committed successfully!');

    // Seed Podcasts (with subcollections - can't use batch)
    console.log('🎙️ Seeding podcasts...');
    for (const podcast of PODCASTS) {
      await db.collection('podcasts').doc(podcast.id).set(podcast);
      
      // Add episodes subcollection
      const episodes = generateEpisodes(podcast.id, podcast.episodeCount);
      for (const episode of episodes) {
        await db.collection('podcasts').doc(podcast.id)
          .collection('episodes').doc(episode.id).set(episode);
      }
    }

    console.log('🎉 Firestore seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Function to clear all data (use with caution!)
export const clearFirestore = async () => {
  const db = firestore();
  const collections = ['categories', 'albums', 'tracks', 'sessions', 'playlists', 'podcasts', 'featured'];

  console.log('🗑️ Clearing Firestore...');

  try {
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      console.log(`  Cleared ${collectionName}`);
    }

    console.log('✅ Firestore cleared!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing Firestore:', error);
    return { success: false, error: error.message };
  }
};

export default seedFirestore;

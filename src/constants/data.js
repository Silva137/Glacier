// Glacier App Sample Data

export const ALBUMS = [
  { id: 1, title: "Arctic Dreams", artist: "Glacier", tracks: 12, image: "aurora", duration: "52 min" },
  { id: 2, title: "Polar Nights", artist: "Glacier", tracks: 10, image: "night", duration: "48 min" },
  { id: 3, title: "Frozen Horizons", artist: "Glacier", tracks: 14, image: "horizon", duration: "1h 05m" },
  { id: 4, title: "Ice & Silence", artist: "Glacier", tracks: 8, image: "mountain", duration: "38 min" },
  { id: 5, title: "Snowbound", artist: "Glacier", tracks: 11, image: "clouds", duration: "50 min" },
  { id: 6, title: "Tundra Whispers", artist: "Glacier", tracks: 9, image: "twilight", duration: "42 min" },
];

export const PLAYLISTS = [
  { id: 1, title: "Deep Sleep", tracks: 12, duration: "2h 15m", image: "night", category: "sleep" },
  { id: 2, title: "Morning Calm", tracks: 8, duration: "1h 30m", image: "dawn", category: "focus" },
  { id: 3, title: "Ocean Dreams", tracks: 10, duration: "1h 45m", image: "ocean", category: "relax" },
  { id: 4, title: "Mountain Serenity", tracks: 15, duration: "2h 30m", image: "mountain", category: "meditation" },
  { id: 5, title: "Starlit Journey", tracks: 9, duration: "1h 20m", image: "stars", category: "sleep" },
  { id: 6, title: "Gentle Waves", tracks: 11, duration: "1h 55m", image: "ocean", category: "relax" },
];

export const SESSIONS = [
  { id: 1, title: "10-Minute Wind Down", duration: "10 min", image: "twilight", description: "Quick relaxation before bed" },
  { id: 2, title: "Power Nap", duration: "20 min", image: "clouds", description: "Recharge your energy" },
  { id: 3, title: "Deep Rest", duration: "45 min", image: "stars", description: "Complete mental reset" },
  { id: 4, title: "Full Night Journey", duration: "8 hr", image: "galaxy", description: "All-night ambient soundscape" },
  { id: 5, title: "Focus Flow", duration: "30 min", image: "dawn", description: "Enhanced concentration" },
  { id: 6, title: "Stress Relief", duration: "25 min", image: "ocean", description: "Melt away tension" },
  { id: 7, title: "Morning Awakening", duration: "15 min", image: "horizon", description: "Gentle start to your day" },
  { id: 8, title: "Meditation Guide", duration: "20 min", image: "mountain", description: "Mindfulness journey" },
];

export const TRACKS = [
  { id: 1, title: "Frozen Lake", artist: "Glacier", duration: "4:32", album: "Arctic Dreams", albumId: 1 },
  { id: 2, title: "Snowfall at Dusk", artist: "Glacier", duration: "5:18", album: "Arctic Dreams", albumId: 1 },
  { id: 3, title: "Ice Crystals", artist: "Glacier", duration: "6:45", album: "Arctic Dreams", albumId: 1 },
  { id: 4, title: "Northern Wind", artist: "Glacier", duration: "4:56", album: "Arctic Dreams", albumId: 1 },
  { id: 5, title: "Midnight Aurora", artist: "Glacier", duration: "7:23", album: "Polar Nights", albumId: 2 },
  { id: 6, title: "Glacier Valley", artist: "Glacier", duration: "5:41", album: "Polar Nights", albumId: 2 },
  { id: 7, title: "Silent Snow", artist: "Glacier", duration: "4:15", album: "Polar Nights", albumId: 2 },
  { id: 8, title: "Ethereal Peaks", artist: "Glacier", duration: "6:02", album: "Frozen Horizons", albumId: 3 },
  { id: 9, title: "Winter Solstice", artist: "Glacier", duration: "5:33", album: "Frozen Horizons", albumId: 3 },
  { id: 10, title: "Permafrost Dreams", artist: "Glacier", duration: "7:18", album: "Frozen Horizons", albumId: 3 },
  { id: 11, title: "Crystal Caverns", artist: "Glacier", duration: "4:47", album: "Ice & Silence", albumId: 4 },
  { id: 12, title: "Breath of Cold", artist: "Glacier", duration: "5:29", album: "Ice & Silence", albumId: 4 },
  { id: 13, title: "Subzero Serenity", artist: "Glacier", duration: "6:11", album: "Ice & Silence", albumId: 4 },
  { id: 14, title: "Blizzard's End", artist: "Glacier", duration: "4:58", album: "Snowbound", albumId: 5 },
  { id: 15, title: "White Silence", artist: "Glacier", duration: "5:44", album: "Snowbound", albumId: 5 },
  { id: 16, title: "Frozen Waterfall", artist: "Glacier", duration: "6:33", album: "Snowbound", albumId: 5 },
  { id: 17, title: "Arctic Lullaby", artist: "Glacier", duration: "4:22", album: "Tundra Whispers", albumId: 6 },
  { id: 18, title: "Polar Drift", artist: "Glacier", duration: "5:56", album: "Tundra Whispers", albumId: 6 },
  { id: 19, title: "Ice Flow", artist: "Glacier", duration: "7:08", album: "Tundra Whispers", albumId: 6 },
  { id: 20, title: "Snowbound Heart", artist: "Glacier", duration: "4:39", album: "Arctic Dreams", albumId: 1 },
  { id: 21, title: "Frostbitten Memories", artist: "Glacier", duration: "5:12", album: "Arctic Dreams", albumId: 1 },
  { id: 22, title: "The Long Night", artist: "Glacier", duration: "8:45", album: "Polar Nights", albumId: 2 },
  { id: 23, title: "Celestial Ice", artist: "Glacier", duration: "6:27", album: "Polar Nights", albumId: 2 },
  { id: 24, title: "Mountain Echo", artist: "Glacier", duration: "4:51", album: "Frozen Horizons", albumId: 3 },
  { id: 25, title: "Glacier's Song", artist: "Glacier", duration: "5:38", album: "Frozen Horizons", albumId: 3 },
];

export const PODCASTS = [
  { id: 1, title: "Ambient Horizons", episodes: 24, image: "horizon", description: "Weekly ambient soundscapes" },
  { id: 2, title: "Sleep Soundscapes", episodes: 52, image: "night", description: "Nightly relaxation journeys" },
  { id: 3, title: "Nature's Symphony", episodes: 18, image: "ocean", description: "Natural world in sound" },
  { id: 4, title: "Meditation Moments", episodes: 36, image: "mountain", description: "Daily mindfulness audio" },
];

export const CATEGORIES = [
  { id: 'sleep', name: 'Sleep', icon: '🌙' },
  { id: 'focus', name: 'Focus', icon: '✨' },
  { id: 'relax', name: 'Relax', icon: '🌊' },
  { id: 'meditation', name: 'Meditate', icon: '🏔️' },
];

export const SLEEP_TIMER_OPTIONS = [
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: 'End of track', value: 'track' },
];

export const DOWNLOAD_QUALITY_OPTIONS = [
  { id: 'low', label: 'Low', description: 'Uses less storage', size: '~1 MB per track' },
  { id: 'medium', label: 'Medium', description: 'Balanced quality', size: '~3 MB per track' },
  { id: 'high', label: 'High', description: 'Best quality', size: '~8 MB per track' },
];

export const FEATURED_CONTENT = {
  title: "Northern Lights",
  subtitle: "Tonight's Featured Session",
  duration: "45 min",
  image: "aurora",
  type: "session",
};

export default {
  ALBUMS,
  PLAYLISTS,
  SESSIONS,
  TRACKS,
  PODCASTS,
  CATEGORIES,
  SLEEP_TIMER_OPTIONS,
  DOWNLOAD_QUALITY_OPTIONS,
  FEATURED_CONTENT,
};

# Glacier App - Firestore Database Schema

## Collections Overview

```
firestore/
├── users/
│   └── {userId}/
│       ├── favorites/
│       │   └── {trackId}
│       ├── history/
│       │   └── {trackId}
│       ├── downloads/
│       │   └── {trackId}
│       └── playlists/
│           └── {playlistId}/
│               └── tracks/
│                   └── {trackId}
├── tracks/
│   └── {trackId}
├── albums/
│   └── {albumId}
├── sessions/
│   └── {sessionId}
├── podcasts/
│   └── {podcastId}/
│       └── episodes/
│           └── {episodeId}
├── playlists/  (curated playlists)
│   └── {playlistId}
└── categories/
    └── {categoryId}
```

---

## Collection Schemas

### 1. users/{userId}
```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",  // optional
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-20T15:45:00.000Z",
  
  // Premium status
  isPremium: false,
  premiumStartedAt: null,
  premiumExpiresAt: null,
  premiumCancelledAt: null,
  
  // Settings
  settings: {
    notifications: {
      newReleases: true,
      recommendations: true,
      reminders: false
    },
    privacy: {
      analytics: true,
      saveHistory: true
    },
    downloadQuality: "medium"  // "low", "medium", "high"
  }
}
```

### 2. users/{userId}/favorites/{trackId}
```javascript
{
  id: "track_001",
  title: "Frozen Lake",
  artist: "Glacier",
  duration: "4:32",
  albumId: "album_001",
  audioPath: "audio/tracks/frozen_lake.mp3",
  coverPath: "covers/albums/arctic_dreams.jpg",
  addedAt: "2024-01-15T10:30:00.000Z"
}
```

### 3. users/{userId}/history/{trackId}
```javascript
{
  id: "track_001",
  title: "Frozen Lake",
  artist: "Glacier",
  duration: "4:32",
  albumId: "album_001",
  playedAt: "2024-01-20T15:45:00.000Z",
  playCount: 5
}
```

### 4. users/{userId}/downloads/{trackId}
```javascript
{
  id: "track_001",
  title: "Frozen Lake",
  artist: "Glacier",
  duration: "4:32",
  albumId: "album_001",
  audioPath: "audio/tracks/frozen_lake.mp3",
  localPath: "/data/user/0/com.glacier/files/downloads/track_001.mp3",
  downloadedAt: "2024-01-18T12:00:00.000Z"
}
```

### 5. users/{userId}/playlists/{playlistId}
```javascript
{
  title: "My Chill Mix",
  description: "Relaxing tracks for work",
  trackIds: ["track_001", "track_002", "track_003"],
  trackCount: 3,
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-20T15:45:00.000Z"
}
```

### 6. tracks/{trackId}
```javascript
{
  title: "Frozen Lake",
  titleLower: "frozen lake",  // for search
  artist: "Glacier",
  duration: "4:32",
  durationSeconds: 272,
  
  albumId: "album_001",
  albumTitle: "Arctic Dreams",
  trackNumber: 1,
  
  category: "sleep",  // sleep, focus, relax, meditate
  tags: ["calm", "ambient", "nature"],
  
  audioPath: "audio/tracks/frozen_lake.mp3",
  coverPath: "covers/albums/arctic_dreams.jpg",
  
  playCount: 1523,
  favoriteCount: 234,
  
  isPremium: false,  // premium-only track?
  isExplicit: false,
  
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### 7. albums/{albumId}
```javascript
{
  title: "Arctic Dreams",
  titleLower: "arctic dreams",
  artist: "Glacier",
  description: "A journey through frozen landscapes",
  
  trackCount: 12,
  totalDuration: "52:30",
  
  category: "sleep",
  tags: ["ambient", "nature", "sleep"],
  
  coverPath: "covers/albums/arctic_dreams.jpg",
  gradient: "aurora",  // gradient style for UI
  
  isPremium: false,
  
  releaseDate: "2024-01-01",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### 8. sessions/{sessionId}
```javascript
{
  title: "Deep Sleep",
  titleLower: "deep sleep",
  description: "Drift into restful slumber",
  
  duration: "45 min",
  durationSeconds: 2700,
  
  category: "sleep",
  type: "guided",  // guided, soundscape, music
  
  audioPath: "audio/sessions/deep_sleep.mp3",
  coverPath: "covers/sessions/deep_sleep.jpg",
  gradient: "twilight",
  
  isPremium: false,
  
  playCount: 5234,
  
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### 9. podcasts/{podcastId}
```javascript
{
  title: "Ambient Horizons",
  titleLower: "ambient horizons",
  description: "Weekly ambient soundscapes",
  author: "Glacier",
  
  episodeCount: 24,
  
  coverPath: "covers/podcasts/ambient_horizons.jpg",
  gradient: "horizon",
  
  isPremium: false,
  
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-20T00:00:00.000Z"
}
```

### 10. podcasts/{podcastId}/episodes/{episodeId}
```javascript
{
  title: "Episode 1: Ocean Depths",
  description: "Exploring the sounds of the deep ocean",
  
  episodeNumber: 1,
  seasonNumber: 1,
  
  duration: "32:15",
  durationSeconds: 1935,
  
  audioPath: "audio/podcasts/ambient_horizons/ep_001.mp3",
  
  publishedAt: "2024-01-01T00:00:00.000Z"
}
```

### 11. playlists/{playlistId} (Curated)
```javascript
{
  title: "Deep Focus",
  titleLower: "deep focus",
  description: "Music for concentration and productivity",
  
  trackIds: ["track_001", "track_002", "track_003"],
  trackCount: 15,
  
  coverPath: "covers/playlists/deep_focus.jpg",
  gradient: "aurora",
  
  category: "focus",
  isCurated: true,
  isFeatured: true,
  
  order: 1,  // display order
  
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-15T00:00:00.000Z"
}
```

### 12. categories/{categoryId}
```javascript
{
  id: "sleep",
  title: "Sleep",
  description: "Wind down and rest peacefully",
  icon: "moon",
  
  gradient: ["#1a2a4a", "#0a1a2a"],
  accentColor: "#6b8cce",
  
  order: 1,  // display order
  isActive: true
}
```

---

## Firebase Storage Structure

```
storage/
├── audio/
│   ├── tracks/
│   │   └── {filename}.mp3
│   ├── sessions/
│   │   └── {filename}.mp3
│   └── podcasts/
│       └── {podcast_id}/
│           └── {filename}.mp3
├── covers/
│   ├── albums/
│   │   └── {filename}.jpg
│   ├── sessions/
│   │   └── {filename}.jpg
│   ├── podcasts/
│   │   └── {filename}.jpg
│   └── playlists/
│       └── {filename}.jpg
└── avatars/
    └── {userId}.jpg
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollections (favorites, history, downloads, playlists)
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /playlists/{playlistId}/tracks/{trackId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public content - anyone can read
    match /tracks/{trackId} {
      allow read: if true;
      allow write: if false;  // Admin only (use Firebase Admin SDK)
    }
    
    match /albums/{albumId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /sessions/{sessionId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /podcasts/{podcastId} {
      allow read: if true;
      allow write: if false;
      
      match /episodes/{episodeId} {
        allow read: if true;
        allow write: if false;
      }
    }
    
    match /playlists/{playlistId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Indexes Required

Create these composite indexes in Firebase Console:

1. **tracks** - category (asc) + createdAt (desc)
2. **tracks** - titleLower (asc) - for search
3. **albums** - createdAt (desc) - for new releases
4. **albums** - titleLower (asc) - for search
5. **sessions** - category (asc) + duration (asc)
6. **playlists** - isCurated (asc) + order (asc)

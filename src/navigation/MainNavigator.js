import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, SIZES } from '../constants/theme';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../hooks/usePlayer';

import {
  HomeScreen,
  BrowseScreen,
  LibraryScreen,
  ProfileScreen,
  PlayerScreen,
  CreatePlaylistScreen,
} from '../screens';
import CategoryScreen from '../screens/CategoryScreen';
import AlbumDetailScreen from '../screens/AlbumDetailScreen';
import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';
import PodcastDetailScreen from '../screens/PodcastDetailScreen';
import NewReleasesScreen from '../screens/NewReleasesScreen';
import SessionsScreen from '../screens/SessionsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* -------------------- */
/* Home Stack */
/* -------------------- */
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="AlbumDetail" 
        component={AlbumDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="PlaylistDetail" 
        component={PlaylistDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="PodcastDetail" 
        component={PodcastDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="NewReleases" 
        component={NewReleasesScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Sessions" 
        component={SessionsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

/* -------------------- */
/* Browse Stack */
/* -------------------- */
function BrowseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrowseMain" component={BrowseScreen} />
      <Stack.Screen 
        name="AlbumDetail" 
        component={AlbumDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="PlaylistDetail" 
        component={PlaylistDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="PodcastDetail" 
        component={PodcastDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="CreatePlaylist" 
        component={CreatePlaylistScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
}

/* -------------------- */
/* Library Stack */
/* -------------------- */
function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
      <Stack.Screen 
        name="AlbumDetail" 
        component={AlbumDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="PlaylistDetail" 
        component={PlaylistDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

/* -------------------- */
/* Bottom Tabs */
/* -------------------- */
function TabNavigator() {
  const { currentTrack } = usePlayer();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: SIZES.tabBarHeight + insets.bottom,
              paddingBottom: insets.bottom + 10,
            }
          ],
          tabBarActiveTintColor: COLORS.white,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Browse':
                iconName = focused ? 'search' : 'search-outline';
                break;
              case 'Library':
                iconName = focused
                  ? 'musical-notes'
                  : 'musical-notes-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'ellipse';
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Browse" component={BrowseStack} />
        <Tab.Screen name="Library" component={LibraryStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* Mini Player overlay */}
      {currentTrack && <MiniPlayer />}
    </View>
  );
}

/* -------------------- */
/* Root Navigator */
/* -------------------- */
const RootStack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name="Main"
          component={TabNavigator}
        />
        
        <RootStack.Screen
          name="Player"
          component={PlayerScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

/* -------------------- */
/* Styles */
/* -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  tabBar: {
    position: 'absolute',
    backgroundColor: COLORS.backgroundDark,
    borderTopWidth: 0,
    elevation: 0,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: SIZES.fontXS,
    marginTop: 4,
  },
});

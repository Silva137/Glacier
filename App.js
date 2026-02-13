// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerProvider } from './src/context/PlayerContext';
import { DataProvider } from './src/context/DataContext';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <DataProvider>
        <PlayerProvider>
          <MainNavigator />
        </PlayerProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
};

export default App;

import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import { PlayerProvider } from './src/context/PlayerContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <MainNavigator />
      </PlayerProvider>
    </SafeAreaProvider>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import App from './src/App';

export default function Root() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <App />
    </SafeAreaProvider>
  );
}

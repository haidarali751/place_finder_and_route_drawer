import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LocationProvider } from '../contexts/LocationContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LocationProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </LocationProvider>
  );
}

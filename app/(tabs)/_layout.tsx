import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                animation: 'slide_from_right',
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#3B82F6'},
                headerTintColor: '#fff',
                headerBackTitleStyle: { fontSize: 14 }
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Plan Your Route' }} />
            <Stack.Screen name="search" options={{ title: 'Search' }}/>
            <Stack.Screen name="map" options={{ title: 'Map' }}/>
        </Stack>
    );
}

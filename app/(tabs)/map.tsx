import { Navigation } from '@/assets/icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Linking,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './map.styles';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const {
    startLocation,
    endLocation,
    routes,
    selectedRouteIndex,
  } = useLocalSearchParams();

  const parsedStart = JSON.parse(startLocation as string);
  const parsedEnd = JSON.parse(endLocation as string);
  const parsedRoutes = JSON.parse(routes as string);
  const selectedRoute = parsedRoutes[parseInt(selectedRouteIndex as string)];

  const coordinates = selectedRoute.geometry.coordinates.map((coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  }));

  useEffect(() => {
    if (mapRef.current && coordinates.length > 0) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: 200,
            left: 50,
          },
          animated: true,
        });
      }, 1000);
    }
  }, [coordinates]);

  const formatDistance = (meters: number): string => {
    return meters < 1000
        ? `${Math.round(meters)} m`
        : `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleStartNavigation = () => {
    Alert.alert('Start Navigation', 'Choose your preferred navigation app:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Google Maps',
        onPress: () => {
          const url = `https://www.google.com/maps/dir/?api=1&origin=${parsedStart.latitude},${parsedStart.longitude}&destination=${parsedEnd.latitude},${parsedEnd.longitude}&travelmode=driving`;
          Linking.openURL(url);
        },
      },
      {
        text: 'Apple Maps',
        onPress: () => {
          const url = `http://maps.apple.com/?saddr=${parsedStart.latitude},${parsedStart.longitude}&daddr=${parsedEnd.latitude},${parsedEnd.longitude}&dirflg=d`;
          Linking.openURL(url);
        },
      },
    ]);
  };

  return (
      <View style={styles.container}>
        <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
            initialRegion={{
              latitude: (parsedStart.latitude + parsedEnd.latitude) / 2,
              longitude: (parsedStart.longitude + parsedEnd.longitude) / 2,
              latitudeDelta: Math.abs(parsedStart.latitude - parsedEnd.latitude) * 1.5,
              longitudeDelta: Math.abs(parsedStart.longitude - parsedEnd.longitude) * 1.5,
            }}
        >
          <Marker
              coordinate={{
                latitude: parsedStart.latitude,
                longitude: parsedStart.longitude,
              }}
              title="Start"
              description={parsedStart.name}
              pinColor="green"
          />
          <Marker
              coordinate={{
                latitude: parsedEnd.latitude,
                longitude: parsedEnd.longitude,
              }}
              title="Destination"
              description={parsedEnd.name}
              pinColor="red"
          />
          <Polyline
              coordinates={coordinates}
              strokeColor="#3B82F6"
              strokeWidth={4}
              lineDashPattern={[0]}
          />
        </MapView>

        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoHeader}>
            <Text style={styles.routeInfoTitle}>Route Details</Text>
            <View style={styles.routeStats}>
              <Text style={styles.routeDistance}>{formatDistance(selectedRoute.distance)}</Text>
              <Text style={styles.routeDuration}>{formatDuration(selectedRoute.duration)}</Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.locationText} numberOfLines={1}>
                {parsedStart.name}
              </Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.locationText} numberOfLines={1}>
                {parsedEnd.name}
              </Text>
            </View>
          </View>

          <TouchableOpacity
              style={styles.navigationButton}
              onPress={handleStartNavigation}
              activeOpacity={0.8}
          >
            <Navigation size={20} color="#FFFFFF" />
            <Text style={styles.navigationButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

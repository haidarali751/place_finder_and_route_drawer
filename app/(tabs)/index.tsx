import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { fetchRoutes } from '@/services/api/routes';
import { RouteOption } from '@/types/navigation';
import { Clock, MapPin, Navigation, Route as RouteIcon } from '../../assets/icons';
import { useLocationContext } from '../../contexts/LocationContext';
import styles from './index.styles';

export default function InputScreen() {
  const router = useRouter();
  const { startLocation, endLocation } = useLocationContext();

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLocationPress = useCallback((fieldType: 'start' | 'end') => {
    router.push({
      pathname: '/search',
      params: { fieldType },
    });
  }, [router]);

  const fetchRoute = async () => {
    if (!startLocation || !endLocation) {
      Alert.alert('Error', 'Please select both start and end locations');
      return;
    }

    setLoading(true);
    try {
      const routeOptions = await fetchRoutes(startLocation, endLocation);
      setRoutes(routeOptions);
    } catch (err) {
      console.error('Route fetch error:', err);
      Alert.alert('Error', 'Failed to fetch route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleViewMap = () => {
    if (!startLocation || !endLocation || routes.length === 0) {
      Alert.alert('Error', 'Please fetch a route first');
      return;
    }

    router.push({
      pathname: '/map',
      params: {
        startLocation: JSON.stringify(startLocation),
        endLocation: JSON.stringify(endLocation),
        routes: JSON.stringify(routes),
        selectedRouteIndex: selectedRouteIndex.toString(),
      },
    });
  };

  return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Plan Your Journey</Text>
            <Text style={styles.subtitle}>Select your start and end locations</Text>

            <View style={styles.inputSection}>
              <TouchableOpacity
                  style={styles.locationInput}
                  onPress={() => handleLocationPress('start')}
                  activeOpacity={0.7}
              >
                <View style={styles.inputIcon}>
                  <MapPin size={20} color="#10B981" />
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>From</Text>
                  <Text style={[styles.inputText, !startLocation && styles.placeholderText]}>
                    {startLocation ? startLocation.name : 'Select start location'}
                  </Text>
                  {startLocation && <Text style={styles.addressText}>{startLocation.address}</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.locationInput}
                  onPress={() => handleLocationPress('end')}
                  activeOpacity={0.7}
              >
                <View style={styles.inputIcon}>
                  <MapPin size={20} color="#EF4444" />
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>To</Text>
                  <Text style={[styles.inputText, !endLocation && styles.placeholderText]}>
                    {endLocation ? endLocation.name : 'Select end location'}
                  </Text>
                  {endLocation && <Text style={styles.addressText}>{endLocation.address}</Text>}
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                  styles.searchButton,
                  (!startLocation || !endLocation) && styles.searchButtonDisabled,
                ]}
                onPress={fetchRoute}
                disabled={!startLocation || !endLocation || loading}
                activeOpacity={0.8}
            >
              {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                  <Navigation size={20} color="#FFFFFF" />
              )}
              <Text style={styles.searchButtonText}>
                {loading ? 'Finding Routes...' : 'Find Routes'}
              </Text>
            </TouchableOpacity>

            {routes.length > 0 && (
                <View style={styles.routesSection}>
                  <Text style={styles.routesTitle}>Route Options</Text>
                  {routes.map((route, index) => (
                      <TouchableOpacity
                          key={index}
                          style={[
                            styles.routeOption,
                            selectedRouteIndex === index && styles.routeOptionSelected,
                          ]}
                          onPress={() => setSelectedRouteIndex(index)}
                          activeOpacity={0.7}
                      >
                        <View style={styles.routeHeader}>
                          <RouteIcon
                              size={18}
                              color={selectedRouteIndex === index ? '#3B82F6' : '#6B7280'}
                          />
                          <Text
                              style={[
                                styles.routeTitle,
                                selectedRouteIndex === index && styles.routeTitleSelected,
                              ]}
                          >
                            Route {index + 1}
                          </Text>
                        </View>
                        <View style={styles.routeDetails}>
                          <View style={styles.routeDetail}>
                            <Text style={styles.routeDetailLabel}>Distance</Text>
                            <Text style={styles.routeDetailValue}>
                              {formatDistance(route.distance)}
                            </Text>
                          </View>
                          <View style={styles.routeDetail}>
                            <Clock size={14} color="#6B7280" />
                            <Text style={styles.routeDetailValue}>
                              {formatDuration(route.duration)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                      style={styles.viewMapButton}
                      onPress={handleViewMap}
                      activeOpacity={0.8}
                  >
                    <Text style={styles.viewMapButtonText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
            )}
          </View>
        </ScrollView>
      </View>
  );
}

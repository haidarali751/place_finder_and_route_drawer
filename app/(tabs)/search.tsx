import { fetchLocations } from '@/services/api/routes';
import { Clock, MapPin, Search } from '@/assets/icons';
import { Location } from '@/types/navigation';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useLocationContext } from '@/contexts/LocationContext';
import styles from './search.styles';

export default function LocationSearchScreen() {
  const { setStartLocation, setEndLocation } = useLocationContext();
  const params = useLocalSearchParams();
  const { fieldType } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);

  useEffect(() => {
    setRecentSearches([
      {
        id: '1',
        name: 'Marina Bay Sands',
        address: '10 Bayfront Avenue, Singapore 018956',
        latitude: 1.2834,
        longitude: 103.8607,
      },
      {
        id: '2',
        name: 'Changi Airport',
        address: 'Airport Boulevard, Singapore 819643',
        latitude: 1.3644,
        longitude: 103.9915,
      },
      {
        id: '3',
        name: 'Orchard Road',
        address: 'Orchard Road, Singapore',
        latitude: 1.3048,
        longitude: 103.8318,
      },
    ]);
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchLocations(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search locations. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    if (fieldType === 'start') setStartLocation(location);
    if (fieldType === 'end') setEndLocation(location);
    router.back();
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
      <TouchableOpacity
          style={styles.locationItem}
          onPress={() => handleLocationSelect(item)}
          activeOpacity={0.7}
      >
        <View style={styles.locationIcon}>
          <MapPin size={18} color="#3B82F6" />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.locationAddress} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
      </TouchableOpacity>
  );

  const renderRecentItem = ({ item }: { item: Location }) => (
      <TouchableOpacity
          style={styles.locationItem}
          onPress={() => handleLocationSelect(item)}
          activeOpacity={0.7}
      >
        <View style={styles.locationIcon}>
          <Clock size={18} color="#6B7280" />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.locationAddress} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
      </TouchableOpacity>
  );

  return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
                style={styles.searchInput}
                placeholder={`Search for ${fieldType} location...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                placeholderTextColor="#9CA3AF"
            />
            {loading && <ActivityIndicator size="small" color="#3B82F6" />}
          </View>
        </View>

        <View style={styles.resultsContainer}>
          {searchQuery.length === 0 ? (
              <View>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <FlatList
                    data={recentSearches}
                    renderItem={renderRecentItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
              </View>
          ) : (
              <View>
                <Text style={styles.sectionTitle}>
                  {searchResults.length > 0 ? 'Search Results' : 'No results found'}
                </Text>
                <FlatList
                    data={searchResults}
                    renderItem={renderLocationItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
              </View>
          )}
        </View>
      </View>
  );
}

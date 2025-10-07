import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { API_BASE } from '../constants';

// Types for the API response
interface NearbyGame {
  id: string;
  title: string;
  venueName: string;
  startTime: string;
  distance: number;
  mapsUrlApple?: string;
  mapsUrlGoogle?: string;
}

interface ApiResponse {
  games: NearbyGame[];
  totalCount: number;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

type Mode = 'standort' | 'link';

// Geocoding using Nominatim API
const geocodeAddress = async (address: string): Promise<LocationCoords | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Extract location keywords from fupa URLs for geocoding
const extractLocationFromUrl = (url: string): string | null => {
  try {
    // Extract region/location from fupa URLs like https://www.fupa.net/region/rotenburg/...
    const fupaMatch = url.match(/fupa\.net\/region\/([^\/]+)/);
    if (fupaMatch) {
      return fupaMatch[1];
    }

    // Add more patterns as needed for other URL types
    return null;
  } catch (error) {
    console.error('Error extracting location from URL:', error);
    return null;
  }
};

const NearbyGames: React.FC = () => {
  const [games, setGames] = useState<NearbyGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('standort');

  // Standortmodus state
  const [manualAddress, setManualAddress] = useState('');
  const [useManualAddress, setUseManualAddress] = useState(false);

  // Linkmodus state
  const [fussballdeUrl, setFussballdeUrl] = useState('');
  const [fupaUrls, setFupaUrls] = useState('');
  const [linkCenter, setLinkCenter] = useState('');

  // Common state
  const [radiusKm, setRadiusKm] = useState(10);

  // Update radius when mode changes to Linkmodus
  useEffect(() => {
    if (mode === 'link') {
      setRadiusKm(25);
    } else {
      setRadiusKm(10);
    }
  }, [mode]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  const radiusOptions = [1, 5, 10, 25, 50, 75, 100];

  const getCurrentLocation = async (): Promise<LocationCoords | null> => {
    try {
      setLocationError(null);

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Failed to get current location');
      return null;
    }
  };

  const fetchNearbyGames = useCallback(async (params: {
    coords?: LocationCoords;
    fussballdeUrl?: string;
    fupaUrls?: string;
  }) => {
    try {
      setLoading(true);

      let apiUrl = `${API_BASE}/api/nearby-games?radiusKm=${radiusKm}&date=${selectedDate}&daysBack=3&daysForward=3`;

      if (params.coords) {
        apiUrl += `&lat=${params.coords.latitude}&lon=${params.coords.longitude}`;
      }

      if (params.fussballdeUrl) {
        apiUrl += `&fussballdeMatchkalender=${encodeURIComponent(params.fussballdeUrl)}`;
      }

      if (params.fupaUrls) {
        apiUrl += `&fupaUrl=${encodeURIComponent(params.fupaUrls)}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'Failed to fetch nearby games. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [radiusKm, selectedDate]);

  const handleStandortSearch = useCallback(async () => {
    let coords: LocationCoords | null = null;

    if (useManualAddress && manualAddress.trim()) {
      // Use manual address
      coords = await geocodeAddress(manualAddress.trim());
      if (!coords) {
        Alert.alert('Error', 'Could not find location for the entered address');
        return;
      }
    } else {
      // Use current location
      coords = await getCurrentLocation();
      if (!coords) {
        return;
      }
    }

    await fetchNearbyGames({ coords });
  }, [useManualAddress, manualAddress, fetchNearbyGames]);

  const handleLinkSearch = useCallback(async () => {
    const trimmedFussballdeUrl = fussballdeUrl.trim();
    const trimmedFupaUrls = fupaUrls.trim();

    if (!trimmedFussballdeUrl && !trimmedFupaUrls) {
      Alert.alert('Error', 'Please provide at least one URL (fussball.de or fupa.net)');
      return;
    }

    let coords: LocationCoords | null = null;

    // Handle center location for Linkmodus
    if (linkCenter.trim()) {
      // User provided manual center
      coords = await geocodeAddress(linkCenter.trim());
      if (!coords) {
        Alert.alert('Error', 'Could not find location for the provided center address');
        return;
      }
    } else {
      // Try to derive center from URLs
      let locationKeyword: string | null = null;

      if (trimmedFupaUrls) {
        const firstFupaUrl = trimmedFupaUrls.split(',')[0].trim();
        locationKeyword = extractLocationFromUrl(firstFupaUrl);
      }

      if (locationKeyword) {
        coords = await geocodeAddress(locationKeyword);
        if (!coords) {
          console.warn('Could not geocode location from URL, proceeding without coordinates');
        }
      }
    }

    await fetchNearbyGames({
      coords: coords || undefined,
      fussballdeUrl: trimmedFussballdeUrl || undefined,
      fupaUrls: trimmedFupaUrls || undefined,
    });
  }, [fussballdeUrl, fupaUrls, linkCenter, fetchNearbyGames]);

  const handleSearch = useCallback(async () => {
    if (mode === 'standort') {
      await handleStandortSearch();
    } else {
      await handleLinkSearch();
    }
  }, [mode, handleStandortSearch, handleLinkSearch]);

  const openMaps = (game: NearbyGame) => {
    const mapsUrl = Platform.OS === 'ios' ? game.mapsUrlApple : game.mapsUrlGoogle;

    if (mapsUrl) {
      Linking.openURL(mapsUrl).catch(err => {
        console.error('Failed to open maps:', err);
        Alert.alert('Error', 'Could not open maps application');
      });
    } else {
      Alert.alert('Error', 'Maps URL not available for this game');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  const renderGame = ({ item }: { item: NearbyGame }) => (
    <View style={[commonStyles.card, { marginHorizontal: 0 }]}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <Text style={[commonStyles.subtitle, { flex: 1 }]} numberOfLines={2}>
          {item.title}
        </Text>
        <TouchableOpacity
          onPress={() => openMaps(item)}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginLeft: 8,
          }}
        >
          <View style={[commonStyles.row, { alignItems: 'center' }]}>
            <Ionicons name="navigate" size={16} color={colors.background} />
            <Text style={{ color: colors.background, marginLeft: 4, fontSize: 12, fontWeight: '600' }}>
              Route
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 4 }}>
        <Text style={[commonStyles.text, { fontSize: 14 }]}>
          <Ionicons name="location" size={14} color={colors.textSecondary} /> {item.venueName}
        </Text>
      </View>

      <View style={[commonStyles.row, commonStyles.spaceBetween]}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
          <Ionicons name="time" size={12} color={colors.textSecondary} /> {formatDateTime(item.startTime)}
        </Text>
        <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
          {item.distance.toFixed(1)} km away
        </Text>
      </View>
    </View>
  );

  // Load games on component mount
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const renderStandortMode = () => (
    <>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>Location Source</Text>
        <TouchableOpacity
          onPress={() => setUseManualAddress(!useManualAddress)}
          style={{
            backgroundColor: useManualAddress ? colors.primary : colors.backgroundAlt,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={{
            color: useManualAddress ? colors.background : colors.text,
            fontSize: 12,
            fontWeight: '600'
          }}>
            {useManualAddress ? 'Use GPS' : 'Manual'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Manual address input */}
      {useManualAddress && (
        <TextInput
          style={[commonStyles.input, { marginVertical: 4 }]}
          placeholder="Enter your address..."
          value={manualAddress}
          onChangeText={setManualAddress}
          placeholderTextColor={colors.textSecondary}
        />
      )}
    </>
  );

  const renderLinkMode = () => (
    <>
      <View style={{ marginBottom: 12 }}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
          fussball.de Matchkalender URL (optional)
        </Text>
        <TextInput
          style={[commonStyles.input, { marginVertical: 0 }]}
          placeholder="https://www.fussball.de/matchkalender/..."
          value={fussballdeUrl}
          onChangeText={setFussballdeUrl}
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
          fupa.net URLs (optional, comma-separated)
        </Text>
        <TextInput
          style={[commonStyles.input, { marginVertical: 0 }]}
          placeholder="https://www.fupa.net/region/rotenburg/..., https://www.fupa.net/..."
          value={fupaUrls}
          onChangeText={setFupaUrls}
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
          Umkreis-Zentrum (optional)
        </Text>
        <TextInput
          style={[commonStyles.input, { marginVertical: 0 }]}
          placeholder="Address or city name (default: derived from URL)"
          value={linkCenter}
          onChangeText={setLinkCenter}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    </>
  );

  return (
    <View style={{ marginVertical: 16 }}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 0 }]}>Nearby Games</Text>
      </View>

      {/* Mode Toggle */}
      <View style={{ marginBottom: 16 }}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 8 }]}>Mode</Text>
        <View style={[commonStyles.row, { gap: 12 }]}>
          <TouchableOpacity
            onPress={() => setMode('standort')}
            style={{
              flex: 1,
              backgroundColor: mode === 'standort' ? colors.primary : colors.backgroundAlt,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View style={[commonStyles.row, commonStyles.center]}>
              <Ionicons
                name="location"
                size={16}
                color={mode === 'standort' ? colors.background : colors.text}
              />
              <Text style={{
                color: mode === 'standort' ? colors.background : colors.text,
                marginLeft: 6,
                fontWeight: '600',
                fontSize: 14,
              }}>
                Standortmodus
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('link')}
            style={{
              flex: 1,
              backgroundColor: mode === 'link' ? colors.primary : colors.backgroundAlt,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View style={[commonStyles.row, commonStyles.center]}>
              <Ionicons
                name="link"
                size={16}
                color={mode === 'link' ? colors.background : colors.text}
              />
              <Text style={{
                color: mode === 'link' ? colors.background : colors.text,
                marginLeft: 6,
                fontWeight: '600',
                fontSize: 14,
              }}>
                Linkmodus
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional rendering based on mode */}
      {mode === 'standort' ? renderStandortMode() : renderLinkMode()}

      {/* Radius and Date Controls */}
      <View style={[commonStyles.row, { marginBottom: 12, justifyContent: 'space-between' }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
            Radius (km) {mode === 'link' ? '(default: 25)' : ''}
          </Text>
          <View style={[commonStyles.row, { flexWrap: 'wrap' }]}>
            {radiusOptions.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setRadiusKm(option)}
                style={{
                  backgroundColor: radiusKm === option ? colors.primary : colors.backgroundAlt,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginRight: 4,
                  marginBottom: 4,
                }}
              >
                <Text style={{
                  color: radiusKm === option ? colors.background : colors.text,
                  fontSize: 11,
                  fontWeight: '600'
                }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
            Date (YYYY-MM-DD)
          </Text>
          <TextInput
            style={[commonStyles.input, { marginVertical: 0, fontSize: 14, paddingVertical: 8 }]}
            placeholder="YYYY-MM-DD"
            value={selectedDate}
            onChangeText={setSelectedDate}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        onPress={handleSearch}
        disabled={loading}
        style={{
          backgroundColor: loading ? colors.backgroundAlt : colors.secondary,
          borderRadius: 8,
          paddingVertical: 12,
          marginBottom: 12,
        }}
      >
        <View style={[commonStyles.row, commonStyles.center]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <>
              <Ionicons name="search" size={16} color={colors.background} />
              <Text style={{ color: colors.background, marginLeft: 8, fontWeight: '600' }}>
                Find Games
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Location Error */}
      {locationError && (
        <View style={{
          backgroundColor: colors.error + '10',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}>
          <Text style={[commonStyles.textSecondary, { color: colors.error, fontSize: 12 }]}>
            <Ionicons name="warning" size={12} color={colors.error} /> {locationError}
          </Text>
        </View>
      )}

      {/* Games List */}
      {games.length > 0 ? (
        <FlatList
          data={games}
          renderItem={renderGame}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : !loading && (
        <View style={[commonStyles.center, { paddingVertical: 24 }]}>
          <Ionicons name="football" size={32} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
            No games found.{'\n'}Try adjusting the {mode === 'standort' ? 'radius or date' : 'parameters or providing different URLs'}.
          </Text>
        </View>
      )}
    </View>
  );
};

export default NearbyGames;

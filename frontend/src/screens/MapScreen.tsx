import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, {Marker, Region} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../styles/colors';

type MapPoint = {
  id: string;
  title: string;
  description: string;
  category: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const FILTERS = ['전체', '나눔물품', '제휴매장', '제로웨이스트'];

const MAP_POINTS: MapPoint[] = [
  {
    id: 'share-zone',
    title: 'EcoBid 나눔존',
    description: '재사용 물품을 맡기고 찾아가는 공유 거점',
    category: '나눔물품',
    coordinate: {
      latitude: 37.5669,
      longitude: 126.9787,
    },
  },
  {
    id: 'partner-store',
    title: '제휴 리필 매장',
    description: '개인 용기를 가져오면 포인트를 받을 수 있어요',
    category: '제휴매장',
    coordinate: {
      latitude: 37.5658,
      longitude: 126.9769,
    },
  },
  {
    id: 'zero-waste',
    title: '제로웨이스트 스팟',
    description: '다회용품과 친환경 제품을 만날 수 있는 장소',
    category: '제로웨이스트',
    coordinate: {
      latitude: 37.5677,
      longitude: 126.9761,
    },
  },
];

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    '위치 권한을 허용하면 현재 위치 주변을 볼 수 있어요.',
  );
  const [searchMarker, setSearchMarker] = useState<MapPoint | null>(null);

  const visiblePoints = useMemo(() => {
    const basePoints =
      activeFilter === '전체'
        ? MAP_POINTS
        : MAP_POINTS.filter(point => point.category === activeFilter);

    return searchMarker ? [searchMarker, ...basePoints] : basePoints;
  }, [activeFilter, searchMarker]);

  useEffect(() => {
    requestCurrentLocation();
  }, []);

  const animateToRegion = (nextRegion: Region) => {
    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 700);
  };

  const requestCurrentLocation = async () => {
    setIsLocating(true);

    try {
      const {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        setLocationGranted(false);
        setStatusMessage('위치 권한 없이도 지도를 둘러볼 수 있어요.');
        return;
      }

      setLocationGranted(true);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
      };

      animateToRegion(nextRegion);
      setStatusMessage('현재 위치 주변을 보여주고 있어요.');
    } catch (error) {
      console.warn('Get current location error:', error);
      setStatusMessage('현재 위치를 불러오지 못했어요.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSearch = async () => {
    const keyword = query.trim();

    if (!keyword) {
      return;
    }

    Keyboard.dismiss();
    setIsSearching(true);

    try {
      const [result] = await Location.geocodeAsync(keyword);

      if (!result) {
        setStatusMessage('검색 결과를 찾을 수 없어요.');
        return;
      }

      const nextRegion = {
        latitude: result.latitude,
        longitude: result.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      };

      setSearchMarker({
        id: 'search-result',
        title: keyword,
        description: '검색한 위치',
        category: '검색',
        coordinate: {
          latitude: result.latitude,
          longitude: result.longitude,
        },
      });
      animateToRegion(nextRegion);
      setStatusMessage(`"${keyword}" 위치로 이동했어요.`);
    } catch (error) {
      console.warn('Search location error:', error);
      setStatusMessage('지금은 검색할 수 없어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          screenStyles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}>
        <View style={screenStyles.header}>
          <Text style={screenStyles.headerSub}>EcoBid</Text>
          <Text style={screenStyles.headerTitle}>지도</Text>
        </View>
        <View style={screenStyles.webFallback}>
          <Ionicons name="map-outline" size={40} color={colors.primary} />
          <Text style={screenStyles.webFallbackTitle}>
            지도는 모바일 앱에서 사용할 수 있어요.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        screenStyles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={screenStyles.header}>
        <Text style={screenStyles.headerSub}>EcoBid</Text>
        <Text style={screenStyles.headerTitle}>지도</Text>

        <View style={screenStyles.searchContainer}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={screenStyles.searchInput}
            placeholder="장소나 주소 검색"
            placeholderTextColor={colors.textDisabled}
          />

          <TouchableOpacity
            accessibilityLabel="검색"
            activeOpacity={0.85}
            disabled={isSearching}
            onPress={handleSearch}
            style={screenStyles.searchButton}>
            {isSearching ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Ionicons name="search" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={screenStyles.filterRow}
          contentContainerStyle={screenStyles.filterContent}>
          {FILTERS.map(filter => {
            const isActive = activeFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(filter)}
                style={[screenStyles.chip, isActive && screenStyles.chipActive]}>
                <Text
                  style={[
                    screenStyles.chipText,
                    isActive && screenStyles.chipTextActive,
                  ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={screenStyles.mapWrap}>
        <MapView
          ref={mapRef}
          style={screenStyles.map}
          initialRegion={DEFAULT_REGION}
          region={region}
          showsUserLocation={locationGranted}
          showsMyLocationButton={false}
          onRegionChangeComplete={setRegion}>
          {visiblePoints.map(point => (
            <Marker
              key={point.id}
              coordinate={point.coordinate}
              title={point.title}
              description={point.description}
              pinColor={
                point.id === 'search-result' ? colors.googleBlue : colors.primary
              }
            />
          ))}
        </MapView>

        <TouchableOpacity
          accessibilityLabel="현재 위치로 이동"
          activeOpacity={0.85}
          onPress={requestCurrentLocation}
          style={screenStyles.locationButton}>
          {isLocating ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Ionicons name="locate" size={22} color={colors.primary} />
          )}
        </TouchableOpacity>

        <View style={screenStyles.statusPanel}>
          <View style={screenStyles.statusIcon}>
            <Ionicons name="leaf-outline" size={18} color={colors.primary} />
          </View>
          <Text style={screenStyles.statusText}>{statusMessage}</Text>
        </View>
      </View>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayBackground,
  },
  header: {
    backgroundColor: colors.white,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSub: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
  mapWrap: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.inputBackground,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusPanel: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    minHeight: 54,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGreenBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  webFallbackTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  PanResponder,
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
  details?: {
    benefits: string;
    operatingHours: string;
    contact: string;
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
    id: 'partner-store-1',
    title: '제휴 리필 매장',
    description: '개인 용기를 가져오면 에코 포인트를 받을 수 있어요',
    category: '제휴매장',
    coordinate: {
      latitude: 37.5658,
      longitude: 126.9769,
    },
  },
  {
    id: 'partner-store-2',
    title: '지구사랑 카페',
    description: '텀블러 지참 시 음료 500원 할인 및 친환경 빨대 제공',
    category: '제휴매장',
    coordinate: {
      latitude: 37.5645,
      longitude: 126.9750,
    },
  },
  {
    id: 'partner-store-3',
    title: '에코 프레시 마트',
    description: '포장지 없는 채소 구매 시 에코 포인트 2배 적립',
    category: '제휴매장',
    coordinate: {
      latitude: 37.5680,
      longitude: 126.9800,
    },
  },
  {
    id: 'partner-store-4',
    title: '그린 베이커리',
    description: '개인 다회용기에 빵 포장 시 미니 스콘 무료 증정',
    category: '제휴매장',
    coordinate: {
      latitude: 37.5630,
      longitude: 126.9785,
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
  const [dynamicPoints, setDynamicPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const visiblePoints = useMemo(() => {
    const allPoints = [...MAP_POINTS, ...dynamicPoints];
    const basePoints =
      activeFilter === '전체'
        ? allPoints
        : allPoints.filter(point => point.category === activeFilter);

    return searchMarker ? [searchMarker, ...basePoints] : basePoints;
  }, [activeFilter, searchMarker, dynamicPoints]);

  const translateY = useRef(new Animated.Value(600)).current;
  const lastY = useRef(0);

  useEffect(() => {
    const listener = translateY.addListener(({ value }) => {
      lastY.current = value;
    });
    return () => translateY.removeListener(listener);
  }, [translateY]);

  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const expandSheet = () => {
    Animated.spring(translateY, {
      toValue: -200,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: 600,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedPoint(null));
  };

  useEffect(() => {
    if (selectedPoint) {
      translateY.setValue(600);
      openSheet();
    }
  }, [selectedPoint]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(lastY.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        
        if (lastY.current > 100) {
          closeSheet();
        } else if (lastY.current < -50) {
          expandSheet();
        } else {
          openSheet();
        }
      },
    })
  ).current;

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

      const lat = currentLocation.coords.latitude;
      const lng = currentLocation.coords.longitude;

      const newPoints: MapPoint[] = [];
      const generateCategories = ['나눔물품', '제휴매장', '제로웨이스트'];
      
      generateCategories.forEach(category => {
        for (let i = 0; i < 15; i++) {
          newPoints.push({
            id: `dynamic-${category}-${Date.now()}-${i}`,
            title: `[${category}] 에코 스토어 ${i + 1}호점`,
            description: `이곳은 ${category}에 특화된 친환경 매장입니다.`,
            category: category,
            coordinate: {
              latitude: lat + (Math.random() - 0.5) * 0.03,
              longitude: lng + (Math.random() - 0.5) * 0.03,
            },
            details: {
              benefits: `${category} 관련 특별 할인 제공 및 에코 포인트 2배 적립`,
              operatingHours: '평일 09:00 - 18:00 (주말 및 공휴일 휴무)',
              contact: `02-1234-${Math.floor(1000 + Math.random() * 9000)}`,
            }
          });
        }
      });

      setDynamicPoints(newPoints);

      const nextRegion = {
        latitude: lat,
        longitude: lng,
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
          onPress={() => setSelectedPoint(null)}
          onRegionChangeComplete={setRegion}>
          {visiblePoints.map(point => (
            <Marker
              key={point.id}
              coordinate={point.coordinate}
              title={point.title}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedPoint(point);
              }}
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

        {selectedPoint && (
          <Animated.View style={[screenStyles.bottomSheet, { transform: [{ translateY }] }]}>
            <View {...panResponder.panHandlers} style={screenStyles.dragArea}>
              <View style={screenStyles.bottomSheetHandle} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.bottomSheetContent}>
              <View style={screenStyles.detailHeader}>
                <View>
                  <Text style={screenStyles.detailCategory}>{selectedPoint.category}</Text>
                  <Text style={screenStyles.detailTitle}>{selectedPoint.title}</Text>
                </View>
                <TouchableOpacity onPress={() => closeSheet()}>
                  <Ionicons name="close-circle" size={28} color={colors.textDisabled} />
                </TouchableOpacity>
              </View>
              <Text style={screenStyles.detailDesc}>{selectedPoint.description}</Text>
              
              <View style={screenStyles.detailSection}>
                <Text style={screenStyles.detailSectionTitle}>✨ 혜택 상세정보</Text>
                <Text style={screenStyles.detailSectionText}>{selectedPoint.details?.benefits || '제공되는 혜택이 없습니다.'}</Text>
              </View>
              
              <View style={screenStyles.detailSection}>
                <Text style={screenStyles.detailSectionTitle}>🏪 매장 정보</Text>
                <Text style={screenStyles.detailSectionText}>운영: {selectedPoint.details?.operatingHours || '정보 없음'}</Text>
                <Text style={screenStyles.detailSectionText}>연락처: {selectedPoint.details?.contact || '정보 없음'}</Text>
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {!selectedPoint && (
          <View style={screenStyles.statusPanel}>
            <View style={screenStyles.statusIcon}>
              <Ionicons name="leaf-outline" size={18} color={colors.primary} />
            </View>
            <Text style={screenStyles.statusText}>{statusMessage}</Text>
          </View>
        )}
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
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -200,
    height: 550,
    paddingBottom: 200,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  dragArea: {
    paddingTop: 16,
    paddingBottom: 16,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bottomSheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  detailDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  detailSection: {
    backgroundColor: colors.grayBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  detailSectionText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

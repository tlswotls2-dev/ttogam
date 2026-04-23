import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALL_ITEMS } from '../constants/items.js';
import { useSound } from './useSound.js';
import { createRandomPointInRadius, mapClickToRadius } from '../utils/geo.js';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const DEFAULT_RADIUS_METERS = 50;

const pickRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
const DEFAULT_VIBRATION_PATTERN = [200, 100, 200];

const getVibrationPatternByRarity = (rarity) => {
  if (rarity === 'legendary') return [300, 120, 300, 120, 300];
  if (rarity === 'epic') return [250, 100, 250, 100, 250];
  if (rarity === 'rare') return [220, 100, 220, 100, 220];
  if (rarity === 'uncommon') return [200, 100, 220];
  return DEFAULT_VIBRATION_PATTERN;
};

/**
 * 브라우저/기기에서 진동 API를 지원할 때만 호출합니다.
 * 미지원 환경(일부 iOS/PC)에서는 예외 없이 무시해 UX를 해치지 않도록 합니다.
 */
const vibrateSafely = (pattern) => {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    navigator.vibrate(pattern);
  } catch {
    // 진동 실패는 핵심 기능이 아니므로 조용히 무시합니다.
  }
};

/**
 * GPS 기반 아이템 발생 로직을 담당하는 훅입니다.
 * 지도 렌더링(Leaflet/Mapbox)과 분리되어 있어, 지도 라이브러리 교체 시에도
 * 이 훅의 입력/출력 계약만 유지하면 동일하게 재사용할 수 있습니다.
 */
export function useItemSpawner(options = {}) {
  const { play } = useSound();
  const radiusMeters = options.radiusMeters ?? DEFAULT_RADIUS_METERS;
  const sourceItems = options.items ?? ALL_ITEMS;

  const [currentPosition, setCurrentPosition] = useState(DEFAULT_CENTER);
  const [spawnedItems, setSpawnedItems] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [testMode, setTestMode] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);

  const refreshPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(error.message || '위치 정보를 가져오지 못했습니다.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
    );
  }, []);

  const spawnNear = useCallback(
    (center, customRadius = radiusMeters) => {
      if (!sourceItems.length) return null;

      const item = pickRandomItem(sourceItems);
      vibrateSafely(getVibrationPatternByRarity(item.rarity));
      play('discover');
      const coordinate = createRandomPointInRadius(center, customRadius);
      const spawned = {
        spawnId: `${item.id}-${Date.now()}`,
        item,
        coordinate,
        spawnedAt: new Date().toISOString(),
      };

      setSpawnedItems((prev) => [spawned, ...prev].slice(0, 30));
      return spawned;
    },
    [play, radiusMeters, sourceItems],
  );

  const spawnByCurrentGPS = useCallback(() => spawnNear(currentPosition), [currentPosition, spawnNear]);

  const spawnFromMapClick = useCallback(
    (point) => {
      if (!testMode) return null;

      /**
       * 테스트 모드에서는 지도 클릭 좌표의 위경도를 우선 사용합니다.
       * 화면 픽셀 좌표만 있는 경우에는 기존처럼 반경을 유동 계산해 현재 위치 근처에서 생성합니다.
       */
      if (typeof point.lat === 'number' && typeof point.lng === 'number') {
        return spawnNear({ lat: point.lat, lng: point.lng }, 12);
      }

      const adaptiveRadius = mapClickToRadius(point.x, point.y, radiusMeters);
      return spawnNear(currentPosition, adaptiveRadius);
    },
    [currentPosition, radiusMeters, spawnNear, testMode],
  );

  const clearSpawnedItems = useCallback(() => setSpawnedItems([]), []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }
    if (watchIdRef.current !== null) return;

    setLocationError('');
    setIsTracking(true);
    setIsLocating(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(error.message || '실시간 위치를 추적하지 못했습니다.');
        setIsLocating(false);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 },
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return useMemo(
    () => ({
      currentPosition,
      spawnedItems,
      isLocating,
      locationError,
      testMode,
      setTestMode,
      refreshPosition,
      spawnByCurrentGPS,
      spawnFromMapClick,
      clearSpawnedItems,
      isTracking,
      startTracking,
      stopTracking,
    }),
    [
      clearSpawnedItems,
      currentPosition,
      isLocating,
      isTracking,
      locationError,
      refreshPosition,
      spawnByCurrentGPS,
      spawnFromMapClick,
      startTracking,
      stopTracking,
      spawnedItems,
      testMode,
    ],
  );
}

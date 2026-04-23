import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useCollectionStore } from '../context/CollectionStoreContext.jsx';
import { useItemSpawner } from '../hooks/useItemSpawner.js';

const categoryMarkerStyle = {
  '동물': { color: '#16A34A', emoji: '🐾' },
  '식물': { color: '#22C55E', emoji: '🌿' },
  '역사적 유물': { color: '#EAB308', emoji: '🏺' },
  '진로 아이템': { color: '#0EA5E9', emoji: '🚗' },
};

const getCategoryStyle = (fullCategory) => {
  const root = fullCategory.split('/')[0];
  return categoryMarkerStyle[root] ?? { color: '#64748B', emoji: '📍' };
};

const createItemIcon = (color, emoji) =>
  L.divIcon({
    className: 'custom-item-marker',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-size:16px;border:2px solid white;box-shadow:0 2px 8px rgba(15,23,42,0.35);">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: '<div style="width:30px;height:30px;border-radius:50%;background:#2563EB;border:4px solid #BFDBFE;box-shadow:0 0 0 6px rgba(37,99,235,0.25);"></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function MapController({ center, followMode }) {
  const map = useMap();
  useEffect(() => {
    if (!followMode) return;
    map.setView([center.lat, center.lng], Math.max(map.getZoom(), 18), { animate: true });
  }, [center.lat, center.lng, followMode, map]);
  return null;
}

function MapClickSpawner({ enabled, onSpawn }) {
  useMapEvents({
    click(event) {
      if (!enabled) return;
      onSpawn({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        x: event.containerPoint.x,
        y: event.containerPoint.y,
      });
    },
  });
  return null;
}

function MainMap() {
  const { collectItem, collectedItems, collectedCount } = useCollectionStore();
  const [followMode, setFollowMode] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const {
    currentPosition,
    spawnedItems,
    isLocating,
    locationError,
    testMode,
    setTestMode,
    refreshPosition,
    spawnByCurrentGPS,
    spawnFromMapClick,
    isTracking,
    startTracking,
    stopTracking,
  } = useItemSpawner({ radiusMeters: 50 });

  const collectedSet = useMemo(
    () => new Set(collectedItems.map((item) => item.id)),
    [collectedItems],
  );

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">MainMap</h2>
        <p className="text-sm text-slate-600">
          Leaflet 지도와 GPS를 연결했습니다. 테스트 모드를 켜면 지도 클릭으로 아이템을 생성할 수
          있습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={refreshPosition}
          className="rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white"
        >
          {isLocating ? '위치 확인 중...' : '현재 위치 갱신'}
        </button>
        <button
          type="button"
          onClick={spawnByCurrentGPS}
          className="rounded-lg bg-brand-secondary px-3 py-2 text-sm font-semibold text-white"
        >
          내 주변 50m 스폰
        </button>
        <button
          type="button"
          onClick={() => setFollowMode((prev) => !prev)}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          팔로우 모드: {followMode ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          onClick={() => (isTracking ? stopTracking() : startTracking())}
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
        >
          실시간 GPS: {isTracking ? '중지' : '시작'}
        </button>
        <button
          type="button"
          onClick={() => setTestMode((prev) => !prev)}
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
        >
          테스트 모드: {testMode ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-300 shadow">
        {mapLoading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-slate-900/50">
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-primary" />
              지도를 불러오는 중...
            </div>
          </div>
        )}

        <MapContainer
          center={[currentPosition.lat, currentPosition.lng]}
          zoom={18}
          className="h-[50vh] w-full"
          whenReady={() => setMapLoading(false)}
        >
          <MapController center={currentPosition} followMode={followMode} />
          <MapClickSpawner enabled={testMode} onSpawn={spawnFromMapClick} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={[currentPosition.lat, currentPosition.lng]}
            radius={20}
            pathOptions={{ color: '#2563EB', fillColor: '#60A5FA', fillOpacity: 0.25, weight: 2 }}
          />
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={userIcon}>
            <Popup>현재 위치</Popup>
          </Marker>

          {spawnedItems.map((spawn) => {
            const { color, emoji } = getCategoryStyle(spawn.item.category);
            const isCollected = collectedSet.has(spawn.item.id);
            return (
              <Marker
                key={spawn.spawnId}
                position={[spawn.coordinate.lat, spawn.coordinate.lng]}
                icon={createItemIcon(color, emoji)}
              >
                <Popup>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold">{spawn.item.name}</p>
                    <p className="text-slate-600">{spawn.item.category}</p>
                    {isCollected ? (
                      <p className="font-semibold text-emerald-600">이미 수집한 아이템입니다.</p>
                    ) : (
                      <div className="space-y-1">
                        <p>수집하시겠습니까?</p>
                        <button
                          type="button"
                          className="rounded bg-brand-accent px-2 py-1 text-xs font-semibold text-white"
                          onClick={() => collectItem(spawn.item)}
                        >
                          수집
                        </button>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">현재 좌표</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            lat {currentPosition.lat.toFixed(6)}, lng {currentPosition.lng.toFixed(6)}
          </p>
          <p className="mt-1 text-xs text-slate-500">팔로우 모드: {followMode ? '사용자 추적 중' : '자유 탐색 중'}</p>
          {locationError && <p className="mt-2 text-sm text-rose-500">{locationError}</p>}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">수집 상태</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">누적 수집: {collectedCount}개</p>
          <p className="mt-1 text-xs text-slate-500">테스트 모드에서 지도 클릭 시 아이템이 생성됩니다.</p>
        </article>
      </div>
    </section>
  );
}

export default MainMap;

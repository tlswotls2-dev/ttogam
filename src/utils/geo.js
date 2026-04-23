const EARTH_RADIUS_METERS = 6371000;

const toRadians = (deg) => (deg * Math.PI) / 180;
const toDegrees = (rad) => (rad * 180) / Math.PI;

/**
 * 중심 좌표에서 특정 거리/방향으로 이동한 새 좌표를 계산합니다.
 * 지도 라이브러리와 무관하게 좌표 계산만 담당하므로 재사용성이 높습니다.
 */
export const createOffsetCoordinate = (center, distanceMeters, bearingRadians) => {
  const lat1 = toRadians(center.lat);
  const lon1 = toRadians(center.lng);
  const angularDistance = distanceMeters / EARTH_RADIUS_METERS;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRadians),
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRadians) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
    );

  return { lat: toDegrees(lat2), lng: toDegrees(lon2) };
};

/**
 * 반경 내 임의의 지점을 균등하게 생성합니다.
 * sqrt(random) 를 사용해 원 중심부/외곽 편향을 줄였습니다.
 */
export const createRandomPointInRadius = (center, radiusMeters) => {
  const distance = Math.sqrt(Math.random()) * radiusMeters;
  const bearing = Math.random() * Math.PI * 2;
  return createOffsetCoordinate(center, distance, bearing);
};

/**
 * 픽셀 클릭 좌표를 기반으로 테스트용 반경을 조절합니다.
 * 실제 지도 API가 붙으면 픽셀->위경도 변환만 교체하면 됩니다.
 */
export const mapClickToRadius = (x, y, maxRadius = 50) => {
  const normalized = Math.min(1, (Math.abs(x) + Math.abs(y)) / 1200);
  return Math.max(5, normalized * maxRadius);
};

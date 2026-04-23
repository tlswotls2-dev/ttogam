import { CATEGORY_META } from '../utils/categoryMeta.js';

const mockCollectionItems = [
  { id: 1, category: 'animal', name: '청설모', discovered: true },
  { id: 2, category: 'plant', name: '민들레', discovered: true },
  { id: 3, category: 'artifact', name: '토기 조각', discovered: false },
  { id: 4, category: 'career', name: '생태 해설가', discovered: false },
];

/**
 * 도감 데이터를 가져오는 서비스 함수입니다.
 * 지금은 목업 데이터를 반환하지만, 추후 Firebase/Supabase SDK 호출로
 * 내부 구현만 교체하면 화면 로직은 거의 건드리지 않도록 분리했습니다.
 */
export async function fetchCollectionItems() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCollectionItems), 200);
  });
}

/**
 * 카테고리 메타 정보를 제공하는 함수입니다.
 * 데이터 저장소가 바뀌어도 동일한 접근 방식을 유지하도록 서비스 계층으로 노출합니다.
 */
export async function fetchCategories() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(CATEGORY_META), 100);
  });
}

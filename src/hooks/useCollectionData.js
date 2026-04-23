import { useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchCollectionItems } from '../services/collectionService.js';

export function useCollectionData() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const [fetchedItems, fetchedCategories] = await Promise.all([
          fetchCollectionItems(),
          fetchCategories(),
        ]);

        if (!isMounted) return;
        setItems(fetchedItems);
        setCategories(fetchedCategories);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * 카테고리별 개수를 한 번에 계산해두면 화면에서 반복 계산을 줄일 수 있습니다.
   * 아이템 수가 많아져도 렌더링 성능을 안정적으로 유지하기 위한 구조입니다.
   */
  const categorySummary = useMemo(() => {
    return categories.map((category) => {
      const relatedItems = items.filter((item) => item.category === category.id);
      const discoveredCount = relatedItems.filter((item) => item.discovered).length;

      return {
        ...category,
        totalCount: relatedItems.length,
        discoveredCount,
      };
    });
  }, [items, categories]);

  return {
    loading,
    items,
    categories,
    categorySummary,
  };
}

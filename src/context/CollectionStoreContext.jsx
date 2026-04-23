import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { syncCollectedItemsToServer } from '../services/syncService.js';
import { AppContext } from './AppContext.jsx';

const CollectionStoreContext = createContext(null);
const COLLECTION_STORAGE_KEY = 'ttogam:collected-items';
const PENDING_SYNC_STORAGE_KEY = 'ttogam:pending-sync-items';

const readLocalJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export function CollectionStoreProvider({ children }) {
  const { studentName, activeClassName } = useContext(AppContext);
  const [collectedItems, setCollectedItems] = useState(() => readLocalJSON(COLLECTION_STORAGE_KEY, []));
  const [pendingSyncItems, setPendingSyncItems] = useState(() =>
    readLocalJSON(PENDING_SYNC_STORAGE_KEY, []),
  );
  const [lastCollectedItem, setLastCollectedItem] = useState(null);

  const collectItem = (item) => {
    const collectedEntry = {
      ...item,
      collectedAt: new Date().toISOString(),
      studentName,
      className: activeClassName,
    };
    let shouldQueueSync = false;

    setCollectedItems((prev) => {
      if (prev.some((entry) => entry.id === item.id)) return prev;
      shouldQueueSync = true;

      /**
       * 수집 시각(collectedAt)을 데이터에 함께 저장해
       * 나중에 학습 타임라인, 주간 통계 등으로 확장할 수 있게 구성합니다.
       */
      return [...prev, collectedEntry];
    });

    if (shouldQueueSync) {
      setPendingSyncItems((queue) => [...queue, collectedEntry]);
      setLastCollectedItem(collectedEntry);
    }
  };

  const removeCollectedItem = (itemId) => {
    setCollectedItems((prev) => prev.filter((entry) => entry.id !== itemId));
  };

  const resetCollection = () => {
    setCollectedItems([]);
    setPendingSyncItems([]);
  };
  const dismissCollectionCelebration = () => setLastCollectedItem(null);

  useEffect(() => {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collectedItems));
  }, [collectedItems]);

  useEffect(() => {
    localStorage.setItem(PENDING_SYNC_STORAGE_KEY, JSON.stringify(pendingSyncItems));
  }, [pendingSyncItems]);

  useEffect(() => {
    const flushPendingSync = async () => {
      if (!navigator.onLine || pendingSyncItems.length === 0) return;
      try {
        const result = await syncCollectedItemsToServer(pendingSyncItems);
        if (result.ok) {
          setPendingSyncItems([]);
        }
      } catch {
        // 동기화 실패 시 큐를 유지해 다음 online 이벤트에서 재시도합니다.
      }
    };

    flushPendingSync();

    const handleOnline = () => {
      flushPendingSync();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingSyncItems]);

  const value = useMemo(
    () => ({
      collectedItems,
      collectedCount: collectedItems.length,
      pendingSyncCount: pendingSyncItems.length,
      collectItem,
      removeCollectedItem,
      resetCollection,
      lastCollectedItem,
      dismissCollectionCelebration,
    }),
    [collectedItems, lastCollectedItem, pendingSyncItems.length],
  );

  return (
    <CollectionStoreContext.Provider value={value}>{children}</CollectionStoreContext.Provider>
  );
}

export const useCollectionStore = () => {
  const context = useContext(CollectionStoreContext);
  if (!context) {
    throw new Error('useCollectionStore는 CollectionStoreProvider 내부에서 사용해야 합니다.');
  }
  return context;
};

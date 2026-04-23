import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';

const COLLECTIONS_PATH = 'collections';
const REWARDS_PATH = 'rewards';

/**
 * 오프라인 큐를 Firestore collections 컬렉션으로 동기화합니다.
 */
export async function syncCollectedItemsToServer(payload) {
  if (!Array.isArray(payload) || payload.length === 0) {
    return { ok: true, syncedCount: 0, syncedAt: new Date().toISOString() };
  }

  const writeJobs = payload.map((entry) =>
    addDoc(collection(db, COLLECTIONS_PATH), {
      itemId: entry.id,
      itemName: entry.name,
      itemCategory: entry.category,
      rarity: entry.rarity ?? 'common',
      description: entry.description ?? '',
      image: entry.image ?? '',
      collectedAt: entry.collectedAt ?? new Date().toISOString(),
      studentName: entry.studentName ?? '이름 없음',
      className: entry.className ?? '학급 미지정',
      syncedAt: serverTimestamp(),
    }),
  );

  await Promise.all(writeJobs);
  return {
    ok: true,
    syncedCount: payload.length,
    syncedAt: new Date().toISOString(),
  };
}

/**
 * 선생님 대시보드 실시간 감시를 위한 구독 함수입니다.
 * 반환값으로 unsubscribe 함수를 전달해 컴포넌트 unmount 시 정리합니다.
 */
export function subscribeCollectionStream({ className, onData, onError }) {
  const baseRef = collection(db, COLLECTIONS_PATH);
  const streamQuery = className
    ? query(baseRef, where('className', '==', className), orderBy('collectedAt', 'desc'))
    : query(baseRef, orderBy('collectedAt', 'desc'));

  return onSnapshot(
    streamQuery,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      onData(records);
    },
    (error) => {
      if (onError) onError(error);
    },
  );
}

export async function sendRewardBox({ className, teacherName = '선생님' }) {
  await addDoc(collection(db, REWARDS_PATH), {
    className,
    teacherName,
    message: '선생님이 보낸 선물이 도착했습니다!',
    rewardType: 'random-box',
    createdAt: serverTimestamp(),
    openedBy: [],
  });
}

export function subscribeRewardStream({ className, onData, onError }) {
  const streamQuery = query(
    collection(db, REWARDS_PATH),
    where('className', '==', className),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    streamQuery,
    (snapshot) => {
      const rewards = snapshot.docs.map((rewardDoc) => ({
        rewardId: rewardDoc.id,
        ...rewardDoc.data(),
      }));
      onData(rewards);
    },
    (error) => {
      if (onError) onError(error);
    },
  );
}

export async function markRewardOpened({ rewardId, studentName }) {
  const rewardRef = doc(db, REWARDS_PATH, rewardId);
  await updateDoc(rewardRef, {
    openedBy: arrayUnion(studentName),
    lastOpenedAt: serverTimestamp(),
  });
}

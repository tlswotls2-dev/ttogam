import confetti from 'canvas-confetti';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { useCollectionStore } from '../../context/CollectionStoreContext.jsx';
import { ALL_ITEMS } from '../../constants/items.js';
import { useSound } from '../../hooks/useSound.js';
import { markRewardOpened, subscribeRewardStream } from '../../services/syncService.js';

const readSeenRewards = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

function RewardBoxModal({ disabled }) {
  const { activeClassName, studentName } = useContext(AppContext);
  const { collectItem } = useCollectionStore();
  const { play } = useSound();
  const [pendingReward, setPendingReward] = useState(null);
  const [revealedItem, setRevealedItem] = useState(null);
  const storageKey = useMemo(
    () => `ttogam:seen-rewards:${activeClassName}:${studentName}`,
    [activeClassName, studentName],
  );

  useEffect(() => {
    if (disabled) return undefined;

    const unsubscribe = subscribeRewardStream({
      className: activeClassName,
      onData: (rewards) => {
        const seenSet = readSeenRewards(storageKey);
        const availableReward = rewards.find((reward) => !seenSet.has(reward.rewardId));
        if (availableReward) {
          setPendingReward(availableReward);
          play('reward');
        }
      },
    });

    return () => unsubscribe();
  }, [activeClassName, disabled, play, storageKey]);

  const handleOpenBox = async () => {
    if (!pendingReward) return;
    const randomItem = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    setRevealedItem(randomItem);
    collectItem(randomItem);
    play('success');
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#F97316', '#EAB308', '#06B6D4', '#EC4899'],
    });
    try {
      await markRewardOpened({ rewardId: pendingReward.rewardId, studentName });
    } catch {
      // 표시 상태는 로컬에도 저장하므로 서버 업데이트 실패 시에도 UX는 유지합니다.
    }
  };

  const handleClose = () => {
    if (!pendingReward) return;
    const seenSet = readSeenRewards(storageKey);
    seenSet.add(pendingReward.rewardId);
    localStorage.setItem(storageKey, JSON.stringify([...seenSet]));
    setPendingReward(null);
    setRevealedItem(null);
  };

  if (!pendingReward || disabled) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-3xl border-2 border-amber-200 bg-white p-6 text-center shadow-2xl">
        <p className="text-lg font-black text-amber-600">선생님이 보낸 선물이 도착했습니다!</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{activeClassName}</p>

        {!revealedItem ? (
          <button
            type="button"
            onClick={handleOpenBox}
            className="mx-auto mt-5 flex h-36 w-36 animate-[shake_1.2s_ease-in-out_infinite] items-center justify-center rounded-3xl bg-gradient-to-b from-amber-300 to-orange-500 text-6xl shadow-lg transition active:scale-95"
          >
            🎁
          </button>
        ) : (
          <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-3xl bg-emerald-50 text-6xl shadow-inner">
            🪄
          </div>
        )}

        {revealedItem ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-700">랜덤박스 개봉 성공!</p>
            <p className="mt-1 text-xl font-black text-slate-800">{revealedItem.name}</p>
            <p className="text-sm text-slate-500">{revealedItem.category}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">상자를 터치해서 랜덤 아이템을 확인해보세요.</p>
        )}

        <button
          type="button"
          onClick={handleClose}
          className="mt-5 rounded-xl bg-slate-800 px-5 py-3 text-base font-black text-white transition hover:bg-slate-900 active:scale-95"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default RewardBoxModal;

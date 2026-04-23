import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { useCollectionStore } from '../../context/CollectionStoreContext.jsx';
import { useSound } from '../../hooks/useSound.js';

function CollectionCelebrateModal() {
  const { lastCollectedItem, dismissCollectionCelebration } = useCollectionStore();
  const { play } = useSound();

  useEffect(() => {
    if (!lastCollectedItem) return;

    play('success');
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#22C55E', '#0EA5E9', '#F59E0B', '#EC4899', '#A855F7'],
    });
  }, [lastCollectedItem, play]);

  if (!lastCollectedItem) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md animate-[popup_280ms_ease-out] rounded-3xl border-2 border-emerald-200 bg-white p-6 text-center shadow-2xl">
        <p className="text-lg font-black text-emerald-600">새로운 수집품을 발견했어요!</p>
        <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-full bg-emerald-50 text-6xl shadow-inner">
          ✨
        </div>
        <h3 className="mt-4 text-2xl font-black text-slate-800">{lastCollectedItem.name}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">{lastCollectedItem.category}</p>
        <button
          type="button"
          onClick={dismissCollectionCelebration}
          className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-base font-black text-white transition hover:bg-emerald-600 active:scale-95"
        >
          확인했어요!
        </button>
      </div>
    </div>
  );
}

export default CollectionCelebrateModal;

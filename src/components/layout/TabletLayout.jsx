import { Outlet, useLocation } from 'react-router-dom';
import CollectionCelebrateModal from '../feedback/CollectionCelebrateModal.jsx';
import RewardBoxModal from '../feedback/RewardBoxModal.jsx';
import { useCollectionStore } from '../../context/CollectionStoreContext.jsx';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';
import BottomNav from '../navigation/BottomNav.jsx';

function TabletLayout() {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const { pendingSyncCount } = useCollectionStore();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-gradient-to-b from-emerald-50 via-sky-50 to-amber-50">
      <header className="sticky top-0 z-10 border-b border-emerald-200 bg-white/90 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl font-black text-emerald-600">또감</h1>
        <p className="text-base font-semibold text-slate-500">초등학생 GPS 기반 수집 도감 플랫폼</p>
        {!isOnline && (
          <div className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            오프라인 모드로 작동 중입니다
          </div>
        )}
        {isOnline && pendingSyncCount > 0 && (
          <div className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            오프라인 데이터 동기화 준비: {pendingSyncCount}건
          </div>
        )}
      </header>

      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>

      <BottomNav />
      <CollectionCelebrateModal />
      <RewardBoxModal disabled={location.pathname === '/teacher'} />
    </div>
  );
}

export default TabletLayout;

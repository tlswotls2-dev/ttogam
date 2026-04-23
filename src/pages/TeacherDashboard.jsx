import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { sendRewardBox, subscribeCollectionStream } from '../services/syncService.js';
import { useSound } from '../hooks/useSound.js';

function TeacherDashboard() {
  const { activeClassName, studentName } = useContext(AppContext);
  const { play } = useSound();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState('');
  const [isSendingReward, setIsSendingReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    setStreamError('');

    const unsubscribe = subscribeCollectionStream({
      className: activeClassName,
      onData: (nextRecords) => {
        setRecords(nextRecords);
        setLoading(false);
      },
      onError: () => {
        setStreamError('실시간 수집 데이터 연결에 실패했습니다.');
        setLoading(false);
      },
    });

    return () => unsubscribe();
  }, [activeClassName]);

  const categorySummary = useMemo(() => {
    return records.reduce(
      (acc, record) => {
        if (record.itemCategory?.startsWith('동물/')) acc.animals += 1;
        else if (record.itemCategory?.startsWith('식물/')) acc.plants += 1;
        else if (record.itemCategory?.startsWith('역사적 유물/')) acc.artifacts += 1;
        else if (record.itemCategory?.startsWith('진로 아이템/')) acc.careers += 1;
        return acc;
      },
      { animals: 0, plants: 0, artifacts: 0, careers: 0 },
    );
  }, [records]);

  const handleSendReward = async () => {
    try {
      setIsSendingReward(true);
      setRewardMessage('');
      await sendRewardBox({ className: activeClassName, teacherName: '담임 선생님' });
      play('reward');
      setRewardMessage('랜덤박스를 지급했습니다. 학생 화면에서 즉시 확인됩니다.');
    } catch {
      setRewardMessage('랜덤박스 지급에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSendingReward(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">TeacherDashboard</h2>
        <p className="text-sm text-slate-500">학급 활동 현황을 빠르게 확인하는 간단한 뷰입니다.</p>
        <button
          type="button"
          onClick={handleSendReward}
          disabled={isSendingReward}
          className="mt-3 rounded-xl bg-amber-500 px-4 py-2 text-sm font-black text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSendingReward ? '지급 중...' : '랜덤박스 지급'}
        </button>
        {rewardMessage && <p className="mt-2 text-sm font-semibold text-slate-600">{rewardMessage}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">활성 학급</p>
          <p className="mt-1 text-lg font-bold text-slate-800">{activeClassName}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">기준 학생</p>
          <p className="mt-1 text-lg font-bold text-slate-800">{studentName}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">실시간 수집 수</p>
          <p className="mt-1 text-lg font-bold text-brand-primary">
            {loading ? '집계 중...' : `${records.length}개`}
          </p>
        </article>
      </div>

      {streamError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-600">
          {streamError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">동물</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{categorySummary.animals}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">식물</p>
          <p className="mt-1 text-xl font-bold text-lime-600">{categorySummary.plants}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">유물</p>
          <p className="mt-1 text-xl font-bold text-amber-600">{categorySummary.artifacts}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">진로</p>
          <p className="mt-1 text-xl font-bold text-sky-600">{categorySummary.careers}</p>
        </article>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700">최근 수집 내역</h3>
        {loading ? (
          <p className="mt-2 text-sm text-slate-500">불러오는 중...</p>
        ) : records.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">아직 수집 데이터가 없습니다.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {records.slice(0, 6).map((record) => (
              <li
                key={record.docId}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-slate-700">{record.itemName}</span>
                <span className="text-slate-500">{record.studentName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default TeacherDashboard;

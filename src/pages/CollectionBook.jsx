import { useMemo, useState } from 'react';
import { ITEM_CATALOG } from '../constants/items.js';
import { useCollectionStore } from '../context/CollectionStoreContext.jsx';

const CATEGORY_TABS = [
  { key: 'animals', label: '동물', emoji: '🐾' },
  { key: 'plants', label: '식물', emoji: '🌿' },
  { key: 'artifacts', label: '유물', emoji: '🏺' },
  { key: 'careers', label: '진로', emoji: '🚗' },
];

const flattenGroups = (groups) => Object.values(groups).flatMap((items) => items);

const getRarityBadgeStyle = (rarity) => {
  if (rarity === 'legendary') return 'bg-violet-100 text-violet-700';
  if (rarity === 'epic') return 'bg-fuchsia-100 text-fuchsia-700';
  if (rarity === 'rare') return 'bg-sky-100 text-sky-700';
  if (rarity === 'uncommon') return 'bg-emerald-100 text-emerald-700';
  return 'bg-slate-100 text-slate-600';
};

function CollectionBook() {
  const { collectedItems } = useCollectionStore();
  const [activeCategoryKey, setActiveCategoryKey] = useState('animals');
  const [selectedItem, setSelectedItem] = useState(null);

  const collectedItemIds = useMemo(
    () => new Set(collectedItems.map((item) => item.id)),
    [collectedItems],
  );

  /**
   * 카테고리별 총 아이템 수와 수집 완료 수를 계산합니다.
   * 이후 DB 연동 시에도 item catalog와 수집 목록만 바꾸면 같은 계산 로직을 유지할 수 있습니다.
   */
  const categoryStats = useMemo(
    () =>
      CATEGORY_TABS.map((tab) => {
        const items = flattenGroups(ITEM_CATALOG[tab.key].groups);
        const collectedCount = items.filter((item) => collectedItemIds.has(item.id)).length;
        const progress = items.length ? (collectedCount / items.length) * 100 : 0;

        return {
          ...tab,
          items,
          totalCount: items.length,
          collectedCount,
          progress,
        };
      }),
    [collectedItemIds],
  );

  const activeCategory = categoryStats.find((category) => category.key === activeCategoryKey);

  return (
    <section className="space-y-4">
      <header className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800">탐험 도감</h2>
        <p className="mt-1 text-base font-medium text-slate-500">
          수집한 아이템을 카테고리별로 확인하고, 진행률을 한눈에 살펴보세요.
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <CategoryTabs
          tabs={CATEGORY_TABS}
          activeCategoryKey={activeCategoryKey}
          onChange={setActiveCategoryKey}
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {categoryStats.map((category) => (
          <CategoryCard
            key={category.key}
            label={category.label}
            emoji={category.emoji}
            collectedCount={category.collectedCount}
            totalCount={category.totalCount}
            progress={category.progress}
            isActive={category.key === activeCategoryKey}
          />
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">
            {activeCategory?.emoji} {activeCategory?.label}
          </h3>
          <p className="text-base font-black text-slate-500">
            {activeCategory?.collectedCount} / {activeCategory?.totalCount}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {activeCategory?.items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isCollected={collectedItemIds.has(item.id)}
              onOpenDetail={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </section>

      <ItemDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}

function CategoryTabs({ tabs, activeCategoryKey, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-2xl px-4 py-2 text-base font-black transition ${
            activeCategoryKey === tab.key
              ? 'bg-emerald-500 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  );
}

function CategoryCard({ label, emoji, collectedCount, totalCount, progress, isActive }) {
  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm transition ${
        isActive ? 'border-emerald-400 bg-emerald-50/60' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-slate-800">
          {emoji} {label}
        </p>
        <p className="text-sm font-semibold text-slate-500">
          {collectedCount}/{totalCount}
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-secondary transition-all"
          style={{ width: `${Math.max(4, progress)}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-bold text-slate-500">진행률 {Math.round(progress)}%</p>
    </article>
  );
}

function ItemCard({ item, isCollected, onOpenDetail }) {
  return (
    <button
      type="button"
      onClick={() => isCollected && onOpenDetail()}
      className={`rounded-2xl border p-3 text-left shadow-sm transition duration-200 active:scale-[0.98] ${
        isCollected
          ? 'border-slate-200 bg-white hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow'
          : 'border-slate-200 bg-slate-50 grayscale hover:scale-[1.02]'
      }`}
    >
      <div
        className={`flex h-24 items-center justify-center rounded-xl ${
          isCollected ? 'bg-slate-100' : 'bg-slate-200'
        }`}
      >
        {isCollected ? (
          <span className="text-4xl">📘</span>
        ) : (
          <span className="text-4xl font-black text-slate-500">?</span>
        )}
      </div>
      <p className="mt-3 text-sm font-bold text-slate-800">{isCollected ? item.name : '미발견 아이템'}</p>
      <p className="mt-1 text-xs text-slate-500">
        {isCollected ? item.category : '수집 후 상세 정보가 공개됩니다.'}
      </p>
      <div className="mt-2">
        {isCollected ? (
          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getRarityBadgeStyle(item.rarity)}`}>
            {item.rarity}
          </span>
        ) : (
          <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500">
            locked
          </span>
        )}
      </div>
    </button>
  );
}

function ItemDetailModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">상세 정보 (구조 프리셋)</p>
            <h4 className="text-xl font-bold text-slate-800">{item.name}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-500"
          >
            닫기
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-600">{item.description}</p>
        <p className="mt-2 text-xs text-slate-500">향후 이미지/오디오/퀴즈 요소를 여기에 확장합니다.</p>
      </div>
    </div>
  );
}

export default CollectionBook;

import Link from 'next/link';
import { useEffect, useState, useMemo, ReactNode } from 'react';
import { api, BASE_URL } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

const LEVEL_CONFIG: Record<string, { label: string; className: string }> = {
  easy: { label: 'Dễ', className: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
  medium: { label: 'Trung bình', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' },
  advanced: { label: 'Nâng cao', className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

const LEVEL_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'advanced', label: 'Nâng cao' },
];

const PRICE_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'paid', label: 'Có phí' },
];

interface WishlistItem {
  courseId: string;
  title: string;
  description: string;
  image: string | null;
  price: number;
  isFree: boolean;
  category: string;
  addedAt: string;
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    api.get<WishlistItem[]>('/api/wishlists')
      .then(data => setItems(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(courseId: string) {
    setRemovingId(courseId);
    await api.delete(`/api/wishlists/${courseId}`).catch(() => {});
    setItems(prev => prev.filter(i => i.courseId !== courseId));
    setRemovingId(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(item => {
      if (q && !`${item.title} ${item.description ?? ''}`.toLowerCase().includes(q)) return false;
      if (levelFilter !== 'all' && item.category !== levelFilter) return false;
      if (priceFilter === 'free' && !(item.isFree || !item.price)) return false;
      if (priceFilter === 'paid' && (item.isFree || !item.price)) return false;
      return true;
    });
  }, [items, search, levelFilter, priceFilter]);

  const hasActiveFilter = search.trim() || levelFilter !== 'all' || priceFilter !== 'all';

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Khoá học yêu thích</h1>
      </AppPageHeader>

      <div className="app-content">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] z-10">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm khoá học yêu thích..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Level filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shrink-0">
            <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">signal_cellular_alt</span>
            {LEVEL_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setLevelFilter(f.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  levelFilter === f.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Price filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shrink-0">
            <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">payments</span>
            {PRICE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setPriceFilter(f.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  priceFilter === f.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count + clear filters */}
        {!loading && items.length > 0 && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              {hasActiveFilter
                ? `${filtered.length} / ${items.length} khoá học`
                : `${items.length} khoá học yêu thích`}
            </span>
            {hasActiveFilter && (
              <button
                onClick={() => { setSearch(''); setLevelFilter('all'); setPriceFilter('all'); }}
                className="flex items-center gap-1 text-primary hover:underline text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                Xoá bộ lọc
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">favorite_border</span>
            <p className="text-slate-500 text-base">Bạn chưa có khoá học yêu thích nào.</p>
            <Link href="/user/courses" className="mt-4 inline-block text-primary font-semibold text-sm hover:underline">
              Khám phá khoá học
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">search_off</span>
            <p className="text-slate-500">Không tìm thấy khoá học phù hợp.</p>
            <button
              onClick={() => { setSearch(''); setLevelFilter('all'); setPriceFilter('all'); }}
              className="mt-3 text-primary font-semibold text-sm hover:underline"
            >
              Xoá bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item.courseId} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="h-48 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {item.image ? (
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${BASE_URL}${item.image}')` }} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary/40">psychology</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => handleRemove(item.courseId)}
                      disabled={removingId === item.courseId}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-sm hover:bg-black/40 transition-colors disabled:opacity-60"
                      title="Xoá khỏi yêu thích"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] text-amber-400"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >star</span>
                    </button>
                    <div className={`backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm ${LEVEL_CONFIG[item.category]?.className ?? 'bg-white/90 dark:bg-slate-900/90 text-slate-700'}`}>
                      {LEVEL_CONFIG[item.category]?.label ?? item.category}
                    </div>
                  </div>
                  {(item.isFree || !item.price) ? (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">Miễn phí</div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {item.price.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{item.description}</p>
                  <Link
                    href={`/user/courses/${item.courseId}`}
                    className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors"
                  >
                    Xem khoá học
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Wishlist.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

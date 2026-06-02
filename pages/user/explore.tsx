import { useEffect, useState, ReactNode, useMemo, useRef } from 'react';
import { api, BASE_URL } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

const PAGE_SIZE = 9;

const LEVEL_CONFIG: Record<string, { label: string; cls: string }> = {
  easy:     { label: 'Dễ',         cls: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
  medium:   { label: 'Trung bình', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' },
  advanced: { label: 'Nâng cao',   cls: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

interface Course {
  id: string; title: string; description: string; image: string | null;
  category: string; lessonCount: number; isFree: boolean; price: number; status: string;
}
interface Rating { avg: number; count: number; }
interface SearchHistory { id: string; keyword: string; createdAt: string; }

type SortKey = 'default' | 'rating_desc' | 'price_asc' | 'price_desc';
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',     label: 'Mặc định' },
  { value: 'rating_desc', label: 'Đánh giá cao nhất' },
  { value: 'price_asc',   label: 'Giá tăng dần' },
  { value: 'price_desc',  label: 'Giá giảm dần' },
];

export default function Explore() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Search with history
  const [search, setSearch] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filters & sort
  const [level, setLevel] = useState('all');
  const [price, setPrice] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get<Course[]>('/api/courses'),
      api.get<Course[]>('/api/courses/my'),
    ]).then(([all, enrolled]) => {
      setAllCourses(all ?? []);
      setEnrolledIds(new Set((enrolled ?? []).map(c => c.id)));

      const ids = (all ?? []).map(c => c.id);
      Promise.all(ids.map(id =>
        api.get<{ rating: number }[]>(`/api/courses/${id}/reviews`)
          .then(r => ({ id, reviews: r ?? [] })).catch(() => ({ id, reviews: [] }))
      )).then(results => {
        const map: Record<string, Rating> = {};
        for (const { id, reviews } of results)
          if (reviews.length > 0)
            map[id] = { avg: Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10, count: reviews.length };
        setRatings(map);
      });
    }).catch(() => setError('Không thể tải khoá học.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get<SearchHistory[]>('/api/search-histories').then(d => setHistory(d ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowHistory(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function saveToHistory(kw: string) {
    if (!kw.trim()) return;
    api.post<SearchHistory[]>('/api/search-histories', { keywords: [kw.trim()] })
      .then(d => { if (d) setHistory(d); }).catch(() => {});
  }

  function resetFilters() { setSearch(''); setLevel('all'); setPrice('all'); setSort('default'); setPage(1); }
  const hasFilter = search.trim() || level !== 'all' || price !== 'all' || sort !== 'default';

  const exploreCourses = allCourses.filter(c => !enrolledIds.has(c.id));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = exploreCourses.filter(c => {
      if (q && !`${c.title} ${c.description ?? ''}`.toLowerCase().includes(q)) return false;
      if (level !== 'all' && c.category !== level) return false;
      if (price === 'free' && !(c.isFree || !c.price)) return false;
      if (price === 'paid' && (c.isFree || !c.price)) return false;
      return true;
    });
    if (sort === 'rating_desc') result = [...result].sort((a, b) => (ratings[b.id]?.avg ?? 0) - (ratings[a.id]?.avg ?? 0));
    if (sort === 'price_asc')   result = [...result].sort((a, b) => (a.isFree ? 0 : a.price) - (b.isFree ? 0 : b.price));
    if (sort === 'price_desc')  result = [...result].sort((a, b) => (b.isFree ? 0 : b.price) - (a.isFree ? 0 : a.price));
    return result;
  }, [exploreCourses, search, level, price, sort, ratings]);

  const filteredHistory = search.trim()
    ? history.filter(h => h.keyword.toLowerCase().includes(search.toLowerCase()))
    : history;

  async function handleEnroll(courseId: string) {
    setEnrollingId(courseId); setError('');
    try {
      await api.post(`/api/courses/${courseId}/enroll`);
      setEnrolledIds(prev => new Set([...prev, courseId]));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Đăng ký thất bại.');
    } finally { setEnrollingId(null); }
  }

  async function handleBuy(courseId: string) {
    setPayingId(courseId); setError('');
    try {
      const res = await api.post<{ paymentUrl: string }>('/api/payments', { courseId });
      if (res?.paymentUrl) window.location.href = res.paymentUrl;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Không thể tạo thanh toán.');
      setPayingId(null);
    }
  }

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Khám phá khoá học</h1>
      </AppPageHeader>

      <div className="app-content space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>{error}
          </div>
        )}

        {/* Search + History */}
        <div ref={searchRef} className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px] z-10">search</span>
          <input type="text" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            onFocus={() => setShowHistory(true)}
            onKeyDown={e => { if (e.key === 'Enter' && search.trim()) { saveToHistory(search); setShowHistory(false); } }}
            placeholder="Tìm kiếm khoá học..."
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {search && (
            <button onClick={() => { setSearch(''); setShowHistory(true); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          {showHistory && filteredHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tìm kiếm gần đây</span>
                <button onClick={() => { api.delete('/api/search-histories').catch(() => {}); setHistory([]); }}
                  className="text-xs font-semibold text-primary hover:underline">Xoá tất cả</button>
              </div>
              <ul>
                {filteredHistory.slice(0, 8).map(item => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 group">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">history</span>
                    <button className="flex-1 text-left text-sm text-slate-700 dark:text-slate-300 truncate"
                      onClick={() => { setSearch(item.keyword); setShowHistory(false); setPage(1); }}>
                      {item.keyword}
                    </button>
                    <button onClick={() => { api.delete(`/api/search-histories/${item.id}`).catch(() => {}); setHistory(prev => prev.filter(h => h.id !== item.id)); }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-opacity">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2">
          {/* Level */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
            <span className="material-symbols-outlined text-[14px] text-slate-400 mr-0.5">signal_cellular_alt</span>
            {['all','easy','medium','advanced'].map(v => (
              <button key={v} onClick={() => { setLevel(v); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${level === v ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {v === 'all' ? 'Tất cả' : LEVEL_CONFIG[v]?.label}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
            <span className="material-symbols-outlined text-[14px] text-slate-400 mr-0.5">payments</span>
            {[['all','Tất cả'],['free','Miễn phí'],['paid','Có phí']].map(([v,l]) => (
              <button key={v} onClick={() => { setPrice(v); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${price === v ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {l}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
            <span className="material-symbols-outlined text-[14px] text-slate-400">sort</span>
            <select value={sort} onChange={e => { setSort(e.target.value as SortKey); setPage(1); }}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Clear filters */}
          {hasFilter && (
            <button onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>Xoá bộ lọc
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && exploreCourses.length > 0 && (
          <p className="text-xs text-slate-400">{filtered.length} khoá học{hasFilter ? ` / ${exploreCourses.length}` : ''}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border h-72 animate-pulse" />)}
          </div>
        ) : exploreCourses.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">school</span>
            <p className="text-slate-500">Bạn đã đăng ký tất cả khoá học!</p>
            <Link href="/user/courses" className="mt-3 inline-block text-primary font-semibold text-sm hover:underline">Xem khoá học của tôi</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">search_off</span>
            <p className="text-slate-500 text-sm">Không có khoá học phù hợp.</p>
            <button onClick={resetFilters} className="mt-2 text-primary text-sm font-semibold hover:underline">Xoá bộ lọc</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map(course => (
                <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  <div className="h-44 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {course.image ? (
                      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }} />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-primary/40">psychology</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${(course.isFree || !course.price) ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                      {(course.isFree || !course.price) ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')}đ`}
                    </div>
                    <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold ${LEVEL_CONFIG[course.category]?.cls ?? 'bg-white/90 text-slate-700'}`}>
                      {LEVEL_CONFIG[course.category]?.label ?? course.category}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">menu_book</span>{course.lessonCount} bài
                      </span>
                      {ratings[course.id] ? (
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-slate-700 dark:text-slate-300">{ratings[course.id].avg.toFixed(1)}</span>
                          <span className="text-slate-400">({ratings[course.id].count})</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-300">
                          <span className="material-symbols-outlined text-[14px]">star</span>Chưa có
                        </span>
                      )}
                    </div>
                    {(course.isFree || !course.price) ? (
                      <button onClick={() => handleEnroll(course.id)} disabled={enrollingId === course.id}
                        className="w-full py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-60 transition-colors">
                        {enrollingId === course.id ? 'Đang đăng ký...' : 'Đăng ký miễn phí'}
                      </button>
                    ) : (
                      <button onClick={() => handleBuy(course.id)} disabled={payingId === course.id}
                        className="w-full py-2 rounded-lg text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                        {payingId === course.id
                          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xử lý...</>
                          : <><span className="material-symbols-outlined text-[15px]">payment</span>Mua · {course.price.toLocaleString('vi-VN')}đ</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE}
              onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </>
        )}
      </div>
    </>
  );
}

Explore.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

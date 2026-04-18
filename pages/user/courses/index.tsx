import Link from 'next/link';
import { useEffect, useState, ReactNode, useMemo, useRef } from 'react';
import { api, BASE_URL } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

const LEVEL_CONFIG: Record<string, { label: string; className: string }> = {
  easy: { label: 'Dễ', className: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
  medium: { label: 'Trung bình', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' },
  advanced: { label: 'Nâng cao', className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

interface CourseResponse {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  lessonCount: number;
  enrolled: boolean;
  isFree: boolean;
  price: number;
  status: string;
}

interface RatingSummary {
  avg: number;
  count: number;
}

interface SearchHistory {
  id: string;
  keyword: string;
  createdAt: string;
}

/** Tính điểm khớp giữa query và text (0 = không khớp) */
function fuzzyScore(query: string, text: string): number {
  const t = text.toLowerCase();
  // 1. Khớp chính xác toàn chuỗi → điểm cao nhất
  if (t.includes(query)) return 100;

  const queryTokens = query.split(/\s+/).filter(Boolean);
  const textTokens  = t.split(/\s+/).filter(Boolean);

  // 2. Tất cả từ có trong text (bất kể thứ tự) → "bản cơ" khớp "cơ bản"
  const allExact = queryTokens.every(qt => t.includes(qt));
  if (allExact) return 80;

  // 3. Một phần từ có mặt (khớp một phần)
  const matchedExact = queryTokens.filter(qt => t.includes(qt)).length;
  if (matchedExact > 0) return Math.round(60 * matchedExact / queryTokens.length);

  // 4. Fuzzy từng từ qua Levenshtein (chịu được lỗi chính tả nhẹ)
  const matchedFuzzy = queryTokens.filter(qt =>
    textTokens.some(tt => levenshtein(qt, tt) <= Math.max(1, Math.floor(qt.length / 4)))
  ).length;
  if (matchedFuzzy > 0) return Math.round(40 * matchedFuzzy / queryTokens.length);

  return 0;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function CourseGrid({ courses, tab, ratings, enrollingId, payingId, onEnroll, onBuy }: {
  courses: CourseResponse[];
  tab: 'enrolled' | 'explore';
  ratings: Record<string, RatingSummary>;
  enrollingId: string | null;
  payingId: string | null;
  onEnroll: (id: string) => void;
  onBuy: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
          <div className="h-48 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
            {course.image ? (
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary/40">psychology</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className={`absolute top-3 right-3 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm ${LEVEL_CONFIG[course.category]?.className ?? 'bg-white/90 dark:bg-slate-900/90 text-slate-700'}`}>
              {LEVEL_CONFIG[course.category]?.label ?? course.category}
            </div>
            {(course.isFree || !course.price) ? (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">Miễn phí</div>
            ) : (
              <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                {course.price.toLocaleString('vi-VN')}đ
              </div>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                {course.lessonCount} bài học
              </span>
              {ratings[course.id] ? (
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
                  <span className="text-slate-700 dark:text-slate-300">{ratings[course.id].avg.toFixed(1)}</span>
                  <span className="text-slate-400">({ratings[course.id].count})</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-300 dark:text-slate-600">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  Chưa có
                </span>
              )}
            </div>
            {tab === 'enrolled' ? (
              <Link href={`/user/courses/${course.id}`}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
                Tiếp tục học
              </Link>
            ) : (course.isFree || !course.price) ? (
              <button onClick={() => onEnroll(course.id)} disabled={enrollingId === course.id}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-60 transition-colors">
                {enrollingId === course.id ? 'Đang đăng ký...' : 'Đăng ký miễn phí'}
              </button>
            ) : (
              <button onClick={() => onBuy(course.id)} disabled={payingId === course.id}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {payingId === course.id ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xử lý...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">payment</span>Mua · {course.price.toLocaleString('vi-VN')}đ</>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Courses() {
  const [enrolledCourses, setEnrolledCourses] = useState<CourseResponse[]>([]);
  const [allCourses, setAllCourses] = useState<CourseResponse[]>([]);
  const [ratings, setRatings] = useState<Record<string, RatingSummary>>({});
  const [tab, setTab] = useState<'enrolled' | 'explore'>('enrolled');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Search history
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.get<CourseResponse[]>('/api/courses/my'),
      api.get<CourseResponse[]>('/api/courses'),
    ]).then(([enrolled, all]) => {
      const e = enrolled ?? [];
      const a = all ?? [];
      setEnrolledCourses(e);
      setAllCourses(a);

      const ids = [...new Set([...e.map(c => c.id), ...a.map(c => c.id)])];
      Promise.all(
        ids.map(id =>
          api.get<{ rating: number }[]>(`/api/courses/${id}/reviews`)
            .then(reviews => ({ id, reviews: reviews ?? [] }))
            .catch(() => ({ id, reviews: [] }))
        )
      ).then(results => {
        const map: Record<string, RatingSummary> = {};
        for (const { id, reviews } of results) {
          if (reviews.length > 0) {
            const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
            map[id] = { avg: Math.round(avg * 10) / 10, count: reviews.length };
          }
        }
        setRatings(map);
      });
    }).catch(() => setError('Không thể tải danh sách khoá học.')).finally(() => setLoading(false));
  }, []);

  // Load history on mount
  useEffect(() => {
    api.get<SearchHistory[]>('/api/search-histories')
      .then(data => setHistory(data ?? []))
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function applySearch(keyword: string) {
    setSearch(keyword);
    setShowHistory(false);
  }

  function saveToHistory(keyword: string) {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    api.post<SearchHistory[]>('/api/search-histories', { keywords: [trimmed] })
      .then(data => { if (data) setHistory(data); })
      .catch(() => {});
  }

  async function deleteHistory(id: string) {
    await api.delete(`/api/search-histories/${id}`).catch(() => {});
    setHistory(prev => prev.filter(h => h.id !== id));
  }

  async function clearAllHistory() {
    await api.delete('/api/search-histories').catch(() => {});
    setHistory([]);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && search.trim()) {
      saveToHistory(search);
      setShowHistory(false);
    }
  }

  const enrolledIds = new Set(enrolledCourses.map(c => c.id));
  const exploreCourses = allCourses.filter(c => !enrolledIds.has(c.id));
  const baseCourses = tab === 'enrolled' ? enrolledCourses : exploreCourses;

  const { exactCourses, relatedCourses } = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return { exactCourses: baseCourses, relatedCourses: [] };

    const exact: CourseResponse[] = [];
    const related: CourseResponse[] = [];

    for (const c of baseCourses) {
      const text = `${c.title} ${c.description ?? ''}`.toLowerCase();
      if (text.includes(q)) {
        exact.push(c);
      } else {
        const score = fuzzyScore(q, text);
        if (score > 0) related.push(c);
      }
    }
    return { exactCourses: exact, relatedCourses: related };
  }, [baseCourses, search]);

  // Filtered history to show (exclude duplicates with current search)
  const filteredHistory = search.trim()
    ? history.filter(h => h.keyword.toLowerCase().includes(search.toLowerCase()))
    : history;

  async function handleBuy(courseId: string) {
    setPayingId(courseId);
    setError('');
    try {
      const res = await api.post<{ paymentUrl: string }>('/api/payments', { courseId });
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Không thể tạo thanh toán.');
      setPayingId(null);
    }
  }

  async function handleEnroll(courseId: string) {
    setEnrollingId(courseId);
    setError('');
    try {
      await api.post(`/api/courses/${courseId}/enroll`);
      const enrolled = await api.get<CourseResponse[]>('/api/courses/my');
      setEnrolledCourses(enrolled ?? []);
      setTab('enrolled');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Đăng ký thất bại.');
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Khoá học</h1>
      </AppPageHeader>

      <div className="app-content">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* Search with history dropdown */}
        <div ref={searchRef} className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] z-10">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Tìm kiếm khoá học..."
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setShowHistory(true); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}

          {/* History dropdown */}
          {showHistory && filteredHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tìm kiếm gần đây</span>
                <button
                  onClick={clearAllHistory}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Xoá tất cả
                </button>
              </div>
              <ul>
                {filteredHistory.slice(0, 8).map(item => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 group">
                    <span className="material-symbols-outlined text-[18px] text-slate-400 shrink-0">history</span>
                    <button
                      className="flex-1 text-left text-sm text-slate-700 dark:text-slate-300 truncate"
                      onClick={() => applySearch(item.keyword)}
                    >
                      {item.keyword}
                    </button>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => { setTab('enrolled'); setSearch(''); }}
            className={`px-4 py-3 text-sm font-bold transition-colors ${tab === 'enrolled' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            Đang học ({enrolledCourses.length})
          </button>
          <button
            onClick={() => { setTab('explore'); setSearch(''); }}
            className={`px-4 py-3 text-sm font-bold transition-colors ${tab === 'explore' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            Khám phá ({exploreCourses.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : !search.trim() && exactCourses.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">school</span>
            <p className="text-slate-500">
              {tab === 'enrolled' ? 'Bạn chưa đăng ký khoá học nào.' : 'Không có khoá học mới.'}
            </p>
            {tab === 'enrolled' && (
              <button onClick={() => setTab('explore')} className="mt-4 text-primary font-semibold text-sm hover:underline">
                Khám phá khoá học
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Kết quả chính xác ── */}
            {search.trim() && exactCourses.length === 0 ? (
              <div className="text-center py-10">
                <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">search_off</span>
                <p className="text-slate-500">Không tìm thấy khoá học cho &ldquo;{search}&rdquo;.</p>
              </div>
            ) : (
              <CourseGrid courses={exactCourses} tab={tab} ratings={ratings}
                enrollingId={enrollingId} payingId={payingId}
                onEnroll={handleEnroll} onBuy={handleBuy} />
            )}

            {/* ── Khoá học liên quan (fuzzy) ── */}
            {search.trim() && relatedCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    Khoá học có liên quan
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>
                <CourseGrid courses={relatedCourses} tab={tab} ratings={ratings}
                  enrollingId={enrollingId} payingId={payingId}
                  onEnroll={handleEnroll} onBuy={handleBuy} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

Courses.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

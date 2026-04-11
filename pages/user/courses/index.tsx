import Link from 'next/link';
import { useEffect, useState, ReactNode, useMemo } from 'react';
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

export default function Courses() {
  const [enrolledCourses, setEnrolledCourses] = useState<CourseResponse[]>([]);
  const [allCourses, setAllCourses] = useState<CourseResponse[]>([]);
  const [ratings, setRatings] = useState<Record<string, RatingSummary>>({});
  const [tab, setTab] = useState<'enrolled' | 'explore'>('enrolled');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<CourseResponse[]>('/api/courses/my'),
      api.get<CourseResponse[]>('/api/courses'),
    ]).then(([enrolled, all]) => {
      const e = enrolled ?? [];
      const a = all ?? [];
      setEnrolledCourses(e);
      setAllCourses(a);

      // Fetch ratings for all courses in parallel
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

  const enrolledIds = new Set(enrolledCourses.map(c => c.id));
  const exploreCourses = allCourses.filter(c => !enrolledIds.has(c.id));
  const baseCourses = tab === 'enrolled' ? enrolledCourses : exploreCourses;
  const displayCourses = useMemo(() => {
    if (!search.trim()) return baseCourses;
    const q = search.toLowerCase();
    return baseCourses.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [baseCourses, search]);

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

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm khoá học..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
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
        ) : displayCourses.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">
              {search ? 'search_off' : 'school'}
            </span>
            <p className="text-slate-500">
              {search
                ? `Không tìm thấy khoá học cho "${search}".`
                : tab === 'enrolled' ? 'Bạn chưa đăng ký khoá học nào.' : 'Không có khoá học mới.'}
            </p>
            {!search && tab === 'enrolled' && (
              <button onClick={() => setTab('explore')} className="mt-4 text-primary font-semibold text-sm hover:underline">
                Khám phá khoá học
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayCourses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="h-48 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {course.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }}
                    />
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
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Miễn phí
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {course.price.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
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
                    <Link
                      href={`/user/courses/${course.id}`}
                      className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors"
                    >
                      Tiếp tục học
                    </Link>
                  ) : (
                    <button
                      onClick={() => course.isFree ? handleEnroll(course.id) : undefined}
                      disabled={enrollingId === course.id || !course.isFree}
                      className={`w-full py-2.5 rounded-lg text-sm font-bold text-center transition-colors ${
                        course.isFree
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-60'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {enrollingId === course.id
                        ? 'Đang đăng ký...'
                        : course.isFree
                          ? 'Đăng ký miễn phí'
                          : 'Mua khoá học'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Courses.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

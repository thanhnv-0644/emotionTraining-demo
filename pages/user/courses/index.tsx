import Link from 'next/link';
import { useEffect, useState, ReactNode } from 'react';
import { api, BASE_URL } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

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

export default function Courses() {
  const [enrolledCourses, setEnrolledCourses] = useState<CourseResponse[]>([]);
  const [allCourses, setAllCourses] = useState<CourseResponse[]>([]);
  const [tab, setTab] = useState<'enrolled' | 'explore'>('enrolled');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<CourseResponse[]>('/api/courses/my'),
      api.get<CourseResponse[]>('/api/courses'),
    ]).then(([enrolled, all]) => {
      setEnrolledCourses(enrolled ?? []);
      setAllCourses(all ?? []);
    }).catch(() => setError('Không thể tải danh sách khoá học.')).finally(() => setLoading(false));
  }, []);

  const enrolledIds = new Set(enrolledCourses.map(c => c.id));
  const exploreCourses = allCourses.filter(c => !enrolledIds.has(c.id));
  const displayCourses = tab === 'enrolled' ? enrolledCourses : exploreCourses;

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

        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setTab('enrolled')}
            className={`px-4 py-3 text-sm font-bold transition-colors ${tab === 'enrolled' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            Đang học ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setTab('explore')}
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
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm capitalize">
                    {course.category}
                  </div>
                  {course.isFree ? (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Miễn phí
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {(course.price ?? 0).toLocaleString('vi-VN')}đ
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      {course.lessonCount} bài học
                    </span>
                    <span className="capitalize px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold uppercase tracking-wider">
                      {course.category}
                    </span>
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

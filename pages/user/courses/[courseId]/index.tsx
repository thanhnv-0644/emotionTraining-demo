import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api, BASE_URL } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import Reviews from '@/components/Reviews';

interface LessonResponse {
  id: string;
  title: string;
  order: number;
}

interface CourseDetailResponse {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  lessonCount: number;
  enrolled: boolean;
  isFree: boolean;
  price: number;
  lessons: LessonResponse[];
}

interface ProgressResponse {
  lessonId: string;
  score: number | null;
}

const LEVEL_CONFIG: Record<string, { label: string; className: string }> = {
  easy:     { label: 'Dễ',         className: 'bg-green-500/20 text-green-300 border border-green-500/40' },
  medium:   { label: 'Trung bình', className: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' },
  advanced: { label: 'Nâng cao',   className: 'bg-red-500/20 text-red-300 border border-red-500/40' },
};

type Tab = 'reviews';

export default function CourseDetailPage() {
  const router = useRouter();
  const { courseId } = router.query as { courseId: string };

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [progresses, setProgresses] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('reviews');

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      api.get<CourseDetailResponse>(`/api/courses/${courseId}`),
      api.get<ProgressResponse[]>('/api/users/me/progress'),
    ]).then(([c, p]) => {
      setCourse(c);
      setProgresses(p ?? []);
    }).catch(() => setError('Không thể tải khoá học.'))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy khoá học</h1>
          <p className="mt-2 text-slate-500">{error || 'Khoá học không tồn tại.'}</p>
          <Link href="/user/courses" className="mt-4 inline-block text-primary font-semibold hover:underline">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const completedLessonIds = new Set(
    progresses.filter(p => p.score !== null).map(p => p.lessonId)
  );
  const completedCount = course.lessons.filter(l => completedLessonIds.has(l.id)).length;
  const totalLessons = course.lessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const hasStarted = completedCount > 0;
  const level = LEVEL_CONFIG[course.category];

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-y-auto">
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link className="hover:text-primary transition-colors" href="/user/courses">Khoá học</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{course.title}</span>
        </div>
        <Link
          href={`/user/courses/${courseId}/lessons`}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">play_circle</span>
          {hasStarted ? 'Tiếp tục học' : 'Bắt đầu học'}
        </Link>
      </div>

      {/* Hero section — full width, split left/right */}
      <div className="relative w-full bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 overflow-hidden">
        {/* Background image blur */}
        {course.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-110"
            style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 px-8 py-10 lg:px-12 lg:py-12">
          {/* Left: course info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {level && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${level.className}`}>
                  {level.label}
                </span>
              )}
              {(course.isFree || !course.price) ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Miễn phí</span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {course.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-2xl">
                {course.description}
              </p>
            )}
            {/* Progress */}
            {hasStarted && (
              <div className="max-w-sm">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Tiến độ của bạn</span>
                  <span className="font-bold text-white">{progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  {completedCount} / {totalLessons} bài đã hoàn thành
                </p>
              </div>
            )}
          </div>

          {/* Right: course image */}
          {course.image ? (
            <div className="shrink-0 w-full lg:w-72 xl:w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video lg:aspect-auto lg:h-48 xl:h-56">
              <img
                src={`${BASE_URL}${course.image}`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="shrink-0 w-full lg:w-72 xl:w-80 h-48 xl:h-56 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-white/20">psychology</span>
            </div>
          )}
        </div>
      </div>

      {/* Content area — two columns */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Main content (tabs) */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sticky top-[53px] z-10">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-3.5 text-sm font-bold transition-colors border-b-2 -mb-px ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Đánh giá
            </button>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'reviews' && <Reviews courseId={courseId} />}
          </div>
        </div>

        {/* Right sidebar: course info card */}
        <div className="lg:w-72 xl:w-80 shrink-0 p-5 lg:border-l border-slate-200 dark:border-slate-800 lg:sticky lg:top-[53px] lg:self-start">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              {(course.isFree || !course.price) ? (
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Miễn phí</p>
              ) : (
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {course.price.toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>
            <div className="p-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Thông tin khoá học
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
                  {totalLessons} bài học
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                  {completedCount} đã hoàn thành
                </li>
                {level && (
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-orange-500">hotel_class</span>
                    Cấp độ: {level.label}
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-purple-500">all_inclusive</span>
                  Truy cập trọn đời
                </li>
              </ul>
              <Link
                href={`/user/courses/${courseId}/lessons`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors mt-1"
              >
                <span className="material-symbols-outlined text-base">play_circle</span>
                {hasStarted ? 'Tiếp tục học' : 'Bắt đầu học'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CourseDetailPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

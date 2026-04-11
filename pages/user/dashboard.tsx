import Link from 'next/link';
import { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
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
}

interface ProgressResponse {
  id: string;
  lessonId: string;
  lessonTitle: string | null;
  courseId?: string;
  score: number | null;
  completedAt: string | null;
  attemptNumber: number;
}

interface UserAnalytics {
  totalLessonsCompleted: number;
  avgScore: number;
  totalXp: number;
  emotionAccuracy: Record<string, { correct: number; total: number; accuracy: number }>;
  weakestEmotion: string | null;
  strongestEmotion: string | null;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  easy:     { label: 'Dễ',         color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
  medium:   { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' },
  advanced: { label: 'Nâng cao',   color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

const EMOTION_COLORS: Record<string, string> = {
  happiness: 'bg-yellow-400', sadness: 'bg-blue-400', anger: 'bg-red-400',
  surprise: 'bg-purple-400', fear: 'bg-indigo-400', disgust: 'bg-green-400', neutral: 'bg-slate-400',
};

const EMOTION_LABELS: Record<string, string> = {
  happiness: 'Hạnh phúc', sadness: 'Buồn bã', anger: 'Tức giận',
  surprise: 'Ngạc nhiên', fear: 'Sợ hãi', disgust: 'Ghê tởm', neutral: 'Bình thản',
};

const XP_LEVELS = [
  { xp: 0,    label: 'Người mới' },
  { xp: 100,  label: 'Người học' },
  { xp: 300,  label: 'Người thực hành' },
  { xp: 700,  label: 'Chuyên gia' },
  { xp: 1500, label: 'Bậc thầy' },
  { xp: 3000, label: 'Huyền thoại' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [recentProgress, setRecentProgress] = useState<ProgressResponse[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<CourseResponse[]>('/api/courses/my'),
      api.get<ProgressResponse[]>('/api/users/me/progress'),
      api.get<UserAnalytics>('/api/users/me/analytics'),
    ]).then(([c, p, a]) => {
      setCourses(c ?? []);
      const sorted = (p ?? [])
        .filter(x => x.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
      setRecentProgress(sorted.slice(0, 5));
      setAnalytics(a);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalXp = analytics?.totalXp ?? user?.xp ?? 0;
  const currentLevelIdx = XP_LEVELS.reduce((acc, lvl, i) => totalXp >= lvl.xp ? i : acc, 0);
  const currentLevel = XP_LEVELS[currentLevelIdx];
  const nextLevel = XP_LEVELS[currentLevelIdx + 1] ?? null;
  const xpPct = nextLevel
    ? Math.round(((totalXp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100)
    : 100;

  const emotionEntries = Object.entries(analytics?.emotionAccuracy ?? {})
    .sort((a, b) => b[1].accuracy - a[1].accuracy);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Tổng quan</h1>
      </AppPageHeader>

      <div className="app-content">
        {/* Welcome + XP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {loading ? 'Đang tải...' : `Chào mừng, ${user?.name ?? ''}! 👋`}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Theo dõi tiến trình học tập của bạn.</p>
          </div>

          {/* XP + Level */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm px-5 py-4 flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-500">bolt</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold">{currentLevel.label}</span>
                <span className="text-xs font-bold text-amber-500">{totalXp} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ width: `${xpPct}%` }} />
              </div>
              {nextLevel && (
                <p className="text-[10px] text-slate-400 mt-0.5">Còn {nextLevel.xp - totalXp} XP → {nextLevel.label}</p>
              )}
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <span className="material-symbols-outlined">target</span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium">Độ chính xác TB</p>
              <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : `${analytics?.avgScore ?? 0}%`}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium">Bài học hoàn thành</p>
              <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : analytics?.totalLessonsCompleted ?? 0}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium">Khoá đang học</p>
              <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : courses.length}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: courses + recent */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Enrolled courses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Khoá học của bạn</h3>
                <Link href="/user/courses" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2].map(i => <div key={i} className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">school</span>
                  <p className="text-slate-500 text-sm mb-3">Bạn chưa đăng ký khoá học nào.</p>
                  <Link href="/user/courses" className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
                    Khám phá khoá học
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(course => {
                    const level = LEVEL_CONFIG[course.category];
                    return (
                      <Link
                        key={course.id}
                        href={`/user/courses/${course.id}`}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex gap-0 hover:shadow-md transition-shadow"
                      >
                        {/* Thumbnail */}
                        <div className="w-28 shrink-0 relative bg-slate-100 dark:bg-slate-800">
                          {course.image ? (
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                              style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }} />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
                              <span className="material-symbols-outlined text-3xl text-primary/40">psychology</span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {level && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${level.color}`}>{level.label}</span>
                            )}
                            <h4 className="text-sm font-bold mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                              {course.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                            <span className="material-symbols-outlined text-[14px]">menu_book</span>
                            {course.lessonCount} bài học
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <h3 className="text-base font-bold mb-4">Hoạt động gần đây</h3>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}</div>
              ) : recentProgress.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Chưa có hoạt động nào. Hãy bắt đầu một bài học!</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentProgress.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${(p.score ?? 0) >= 80 ? 'bg-green-100 dark:bg-green-500/20 text-green-600' : (p.score ?? 0) >= 60 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600' : 'bg-red-100 dark:bg-red-500/20 text-red-500'}`}>
                          <span className="material-symbols-outlined text-[18px]">hearing</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{p.lessonTitle ?? 'Bài học'}</p>
                          <p className="text-xs text-slate-500">
                            {p.completedAt ? new Date(p.completedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                          </p>
                        </div>
                      </div>
                      <div className={`shrink-0 text-sm font-black ml-4 ${(p.score ?? 0) >= 80 ? 'text-green-600' : (p.score ?? 0) >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {p.score != null ? `${p.score}%` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: emotion mastery + weak point */}
          <div className="flex flex-col gap-6">
            {/* Emotion mastery */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <h3 className="text-base font-bold mb-4">Mức độ cảm xúc</h3>
              {loading ? (
                <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}</div>
              ) : emotionEntries.length === 0 ? (
                <p className="text-slate-500 text-sm">Hoàn thành bài học để xem dữ liệu.</p>
              ) : (
                <div className="space-y-3">
                  {emotionEntries.slice(0, 5).map(([emotion, stat]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{EMOTION_LABELS[emotion] ?? emotion}</span>
                        <span className="font-bold">{stat.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className={`${EMOTION_COLORS[emotion] ?? 'bg-primary'} h-1.5 rounded-full`} style={{ width: `${stat.accuracy}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/user/analytics" className="w-full mt-5 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors text-center block">
                Xem chi tiết phân tích
              </Link>
            </div>

            {/* Weakest / Strongest */}
            {analytics?.weakestEmotion && (
              <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="relative z-10">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1">Cần cải thiện</h3>
                  <p className="text-white/70 text-xs mb-1">Cảm xúc yếu nhất:</p>
                  <p className="text-lg font-black">{EMOTION_LABELS[analytics.weakestEmotion] ?? analytics.weakestEmotion}</p>
                  <p className="text-white/70 text-xs mt-1">
                    {analytics.emotionAccuracy[analytics.weakestEmotion]?.accuracy ?? 0}% chính xác
                  </p>
                </div>
              </div>
            )}

            {analytics?.strongestEmotion && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Cảm xúc giỏi nhất</p>
                    <p className="font-black text-emerald-600">{EMOTION_LABELS[analytics.strongestEmotion] ?? analytics.strongestEmotion}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {analytics.emotionAccuracy[analytics.strongestEmotion]?.accuracy ?? 0}% độ chính xác
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

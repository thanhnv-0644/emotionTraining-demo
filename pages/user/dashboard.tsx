import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

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
  lessonId: string;
  lessonTitle: string;
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

const EMOTION_COLORS: Record<string, string> = {
  happiness: 'bg-yellow-400',
  sadness: 'bg-blue-400',
  anger: 'bg-red-400',
  surprise: 'bg-purple-400',
  fear: 'bg-indigo-400',
  disgust: 'bg-green-400',
  neutral: 'bg-slate-400',
};

const EMOTION_LABELS: Record<string, string> = {
  happiness: 'Hạnh phúc', sadness: 'Buồn bã', anger: 'Tức giận',
  surprise: 'Ngạc nhiên', fear: 'Sợ hãi', disgust: 'Ghê tởm', neutral: 'Bình thản',
};

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
      setRecentProgress((p ?? []).slice(0, 3));
      setAnalytics(a);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const continueLesson = courses[0] ?? null;
  const emotionEntries = Object.entries(analytics?.emotionAccuracy ?? {}).sort((a, b) => b[1].accuracy - a[1].accuracy);

  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" placeholder="Tìm kiếm khoá học..." className="w-full pl-10 pr-4 py-2 rounded-lg border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {loading ? 'Đang tải...' : `Chào mừng, ${user?.name ?? ''}!`}
            </h2>
            <p className="text-slate-500">Theo dõi tiến trình học tập của bạn.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">stars</span>
              <span className="text-sm font-bold text-primary">{user?.xp ?? 0} XP</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">target</span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Độ chính xác trung bình</p>
              <h3 className="text-3xl font-black mt-1">{loading ? '...' : `${analytics?.avgScore ?? 0}%`}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Bài học hoàn thành</p>
              <h3 className="text-3xl font-black mt-1">{loading ? '...' : analytics?.totalLessonsCompleted ?? 0}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined">emoji_events</span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Tổng XP</p>
              <h3 className="text-3xl font-black mt-1">{loading ? '...' : analytics?.totalXp ?? 0}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Tiếp tục học</h3>
              <Link href="/courses" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>
            </div>

            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-40 animate-pulse" />
            ) : continueLesson ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 sm:h-auto relative bg-slate-100 dark:bg-slate-800">
                    <div className="absolute inset-0 bg-cover bg-center bg-slate-200 dark:bg-slate-700" style={continueLesson.image ? { backgroundImage: `url('http://localhost:8080${continueLesson.image}')` } : {}}></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold capitalize">{continueLesson.category}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-2">{continueLesson.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{continueLesson.description}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">menu_book</span>
                        {continueLesson.lessonCount} bài học
                      </span>
                      <Link href={`/courses/${continueLesson.id}`} className="ml-auto bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
                        Tiếp tục
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">school</span>
                <p className="text-slate-500 text-sm">Bạn chưa enroll khoá học nào.</p>
                <Link href="/courses" className="mt-4 inline-block text-primary font-semibold text-sm hover:underline">Khám phá khoá học</Link>
              </div>
            )}

            {/* Recent progress */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-6">Bài học gần đây</h3>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}</div>
              ) : recentProgress.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Chưa có bài học nào.</p>
              ) : (
                <div className="space-y-4">
                  {recentProgress.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                          <span className="material-symbols-outlined">hearing</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">{p.lessonTitle}</h5>
                          <p className="text-xs text-slate-500">{p.completedAt ? new Date(p.completedAt).toLocaleDateString('vi-VN') : 'Chưa hoàn thành'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Điểm</p>
                        <p className={`font-bold text-sm ${(p.score ?? 0) >= 90 ? 'text-emerald-600' : (p.score ?? 0) >= 70 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {p.score != null ? `${p.score}%` : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Emotion Mastery */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Emotion Mastery</h3>
              {loading ? (
                <div className="space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}</div>
              ) : emotionEntries.length === 0 ? (
                <p className="text-slate-500 text-sm">Chưa có dữ liệu.</p>
              ) : (
                <div className="space-y-4">
                  {emotionEntries.map(([emotion, stat]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{EMOTION_LABELS[emotion] ?? emotion}</span>
                        <span className="font-bold">{stat.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className={`${EMOTION_COLORS[emotion] ?? 'bg-primary'} h-1.5 rounded-full`} style={{ width: `${stat.accuracy}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/analytics" className="w-full mt-6 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors text-center block">
                Xem chi tiết
              </Link>
            </div>

            {analytics?.weakestEmotion && (
              <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                    <span className="material-symbols-outlined">tips_and_updates</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Cần cải thiện</h3>
                  <p className="text-white/80 text-sm mb-2">Cảm xúc yếu nhất của bạn:</p>
                  <p className="text-xl font-black">{EMOTION_LABELS[analytics.weakestEmotion] ?? analytics.weakestEmotion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

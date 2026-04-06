import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

interface EmotionStat {
  correct: number;
  total: number;
  accuracy: number;
}

interface UserAnalytics {
  totalLessonsCompleted: number;
  avgScore: number;
  totalXp: number;
  emotionAccuracy: Record<string, EmotionStat>;
  weakestEmotion: string | null;
  strongestEmotion: string | null;
}

const EMOTION_LABELS: Record<string, string> = {
  happiness: 'Hạnh phúc',
  sadness: 'Buồn bã',
  anger: 'Tức giận',
  surprise: 'Ngạc nhiên',
  fear: 'Sợ hãi',
  disgust: 'Ghê tởm',
  neutral: 'Bình thản',
};

const EMOTION_COLORS: Record<string, string> = {
  happiness: 'bg-yellow-400',
  sadness: 'bg-blue-400',
  anger: 'bg-red-400',
  surprise: 'bg-purple-400',
  fear: 'bg-indigo-400',
  disgust: 'bg-green-400',
  neutral: 'bg-slate-400',
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<UserAnalytics>('/api/users/me/analytics')
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const emotionEntries = Object.entries(analytics?.emotionAccuracy ?? {})
    .sort((a, b) => b[1].accuracy - a[1].accuracy);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Phân tích</h1>
      </AppPageHeader>

      <div className="app-content">
        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Độ chính xác trung bình</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : `${analytics?.avgScore ?? 0}%`}
            </h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Bài học hoàn thành</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : analytics?.totalLessonsCompleted ?? 0}
            </h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng XP</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : analytics?.totalXp ?? 0}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emotion Proficiency */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Độ thành thạo cảm xúc</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : emotionEntries.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">Chưa có dữ liệu. Hãy hoàn thành một bài học để xem kết quả.</p>
            ) : (
              <div className="space-y-5">
                {emotionEntries.map(([emotion, stat]) => (
                  <div key={emotion}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {EMOTION_LABELS[emotion] ?? emotion}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {stat.accuracy}%
                        <span className="text-xs text-slate-500 ml-1">({stat.correct}/{stat.total})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                      <div
                        className={`${EMOTION_COLORS[emotion] ?? 'bg-primary'} h-2.5 rounded-full`}
                        style={{ width: `${stat.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strengths / Weaknesses */}
          <div className="space-y-6">
            {analytics?.strongestEmotion && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined">emoji_events</span>
                  </div>
                  <h3 className="text-base font-bold">Cảm xúc giỏi nhất</h3>
                </div>
                <p className="text-2xl font-black text-emerald-600">
                  {EMOTION_LABELS[analytics.strongestEmotion] ?? analytics.strongestEmotion}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {analytics.emotionAccuracy[analytics.strongestEmotion]?.accuracy ?? 0}% độ chính xác
                </p>
              </div>
            )}

            {analytics?.weakestEmotion && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined">tips_and_updates</span>
                  </div>
                  <h3 className="text-base font-bold">Cần cải thiện</h3>
                </div>
                <p className="text-2xl font-black text-orange-600">
                  {EMOTION_LABELS[analytics.weakestEmotion] ?? analytics.weakestEmotion}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {analytics.emotionAccuracy[analytics.weakestEmotion]?.accuracy ?? 0}% độ chính xác
                </p>
              </div>
            )}

            {!loading && !analytics?.weakestEmotion && !analytics?.strongestEmotion && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">monitoring</span>
                <p className="text-slate-500 text-sm">Hoàn thành bài học để xem phân tích của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Analytics.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

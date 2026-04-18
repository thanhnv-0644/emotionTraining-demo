import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

interface UserAnalytics {
  totalLessonsCompleted: number;
  avgScore: number;
  totalXp: number;
  emotionAccuracy: Record<string, { correct: number; total: number; accuracy: number }>;
  weakestEmotion: string | null;
  strongestEmotion: string | null;
}

interface User {
  xp: number;
  name: string;
}

const XP_LEVELS = [
  { xp: 0,    label: 'Người mới',    icon: 'emoji_nature',  color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800' },
  { xp: 100,  label: 'Người học',    icon: 'school',        color: 'text-green-600',   bg: 'bg-green-100 dark:bg-green-900/30' },
  { xp: 300,  label: 'Người thực hành', icon: 'psychology', color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { xp: 700,  label: 'Chuyên gia',   icon: 'workspace_premium', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { xp: 1500, label: 'Bậc thầy',     icon: 'military_tech', color: 'text-yellow-600',  bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { xp: 3000, label: 'Huyền thoại',  icon: 'stars',         color: 'text-orange-600',  bg: 'bg-orange-100 dark:bg-orange-900/30' },
];

const EMOTION_VI: Record<string, string> = {
  happiness: 'Hạnh phúc', sadness: 'Buồn bã', anger: 'Tức giận',
  surprise: 'Ngạc nhiên', fear: 'Sợ hãi', disgust: 'Ghê tởm', neutral: 'Bình thản',
};

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  earned: boolean;
}

function buildBadges(analytics: UserAnalytics): Badge[] {
  const badges: Badge[] = [
    {
      id: 'first_lesson',
      label: 'Bước đầu tiên',
      description: 'Hoàn thành bài học đầu tiên',
      icon: 'rocket_launch',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      earned: analytics.totalLessonsCompleted >= 1,
    },
    {
      id: 'five_lessons',
      label: 'Đang tiến bộ',
      description: 'Hoàn thành 5 bài học',
      icon: 'trending_up',
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
      earned: analytics.totalLessonsCompleted >= 5,
    },
    {
      id: 'ten_lessons',
      label: 'Kiên trì',
      description: 'Hoàn thành 10 bài học',
      icon: 'local_fire_department',
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      earned: analytics.totalLessonsCompleted >= 10,
    },
    {
      id: 'twenty_five_lessons',
      label: 'Chuyên cần',
      description: 'Hoàn thành 25 bài học',
      icon: 'military_tech',
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      earned: analytics.totalLessonsCompleted >= 25,
    },
    {
      id: 'high_accuracy',
      label: 'Chính xác cao',
      description: 'Đạt điểm trung bình ≥ 80%',
      icon: 'target',
      color: 'text-primary',
      bg: 'bg-primary/10',
      earned: analytics.avgScore >= 80,
    },
    {
      id: 'perfect_score',
      label: 'Xuất sắc',
      description: 'Đạt điểm trung bình ≥ 90%',
      icon: 'workspace_premium',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      earned: analytics.avgScore >= 90,
    },
    {
      id: 'emotion_master',
      label: 'Thành thạo cảm xúc',
      description: 'Nhận diện chính xác 100% một cảm xúc',
      icon: 'emoji_emotions',
      color: 'text-pink-600',
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      earned: Object.values(analytics.emotionAccuracy).some(s => s.accuracy === 100 && s.total >= 3),
    },
    {
      id: 'all_emotions',
      label: 'Đa cảm xúc',
      description: 'Đã luyện tập với ít nhất 5 loại cảm xúc',
      icon: 'sentiment_very_satisfied',
      color: 'text-teal-600',
      bg: 'bg-teal-100 dark:bg-teal-900/30',
      earned: Object.keys(analytics.emotionAccuracy).length >= 5,
    },
  ];
  return badges;
}

export default function Achievements() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<User>('/api/users/me'),
      api.get<UserAnalytics>('/api/users/me/analytics'),
    ]).then(([u, a]) => {
      setUser(u);
      setAnalytics(a);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalXp = user?.xp ?? 0;
  const currentLevelIdx = XP_LEVELS.reduce((acc, lvl, i) => totalXp >= lvl.xp ? i : acc, 0);
  const currentLevel = XP_LEVELS[currentLevelIdx];
  const nextLevel = XP_LEVELS[currentLevelIdx + 1] ?? null;
  const xpToNext = nextLevel ? nextLevel.xp - totalXp : 0;
  const xpPct = nextLevel
    ? Math.round(((totalXp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100)
    : 100;

  const badges = analytics ? buildBadges(analytics) : [];
  const earnedBadges = badges.filter(b => b.earned);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Thành tích</h1>
      </AppPageHeader>

      <div className="app-content">
        {/* XP Level Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          {loading ? (
            <div className="h-24 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl ${currentLevel.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined text-4xl ${currentLevel.color}`}>{currentLevel.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold">{currentLevel.label}</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {totalXp.toLocaleString()} XP
                  </span>
                </div>
                {nextLevel ? (
                  <>
                    <p className="text-sm text-slate-500 mb-3">
                      Cần thêm <span className="font-bold text-primary">{xpToNext} XP</span> để đạt cấp <span className="font-semibold">{nextLevel.label}</span>
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{currentLevel.xp} XP</span>
                      <span>{nextLevel.xp} XP</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Bạn đã đạt cấp cao nhất!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* All XP Levels */}
        <div>
          <h3 className="text-base font-bold mb-4">Cấp bậc</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {XP_LEVELS.map((lvl, i) => {
              const reached = totalXp >= lvl.xp;
              return (
                <div key={lvl.xp} className={`rounded-xl p-4 text-center border transition-all ${reached ? `${lvl.bg} border-transparent` : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-50 grayscale'}`}>
                  <span className={`material-symbols-outlined text-3xl ${reached ? lvl.color : 'text-slate-400'}`}>{lvl.icon}</span>
                  <p className={`text-xs font-bold mt-2 ${reached ? '' : 'text-slate-400'}`}>{lvl.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{lvl.xp} XP</p>
                  {i === currentLevelIdx && !loading && (
                    <span className="mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">Hiện tại</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-primary">{analytics.totalLessonsCompleted}</p>
              <p className="text-xs text-slate-500 mt-1">Bài học hoàn thành</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-green-600">{analytics.avgScore}%</p>
              <p className="text-xs text-slate-500 mt-1">Điểm trung bình</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-purple-600">{earnedBadges.length}</p>
              <p className="text-xs text-slate-500 mt-1">Huy hiệu đạt được</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-orange-600">{Object.keys(analytics.emotionAccuracy).length}</p>
              <p className="text-xs text-slate-500 mt-1">Loại cảm xúc đã học</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div>
          <h3 className="text-base font-bold mb-4">
            Huy hiệu
            {!loading && <span className="ml-2 text-xs font-normal text-slate-500">({earnedBadges.length}/{badges.length} đạt được)</span>}
          </h3>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map(badge => (
                <div key={badge.id} className={`rounded-2xl border p-5 flex flex-col items-center text-center gap-2 transition-all ${badge.earned ? `${badge.bg} border-transparent` : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-50 grayscale'}`}>
                  <span className={`material-symbols-outlined text-4xl ${badge.earned ? badge.color : 'text-slate-400'}`}>{badge.icon}</span>
                  <p className={`text-sm font-bold ${badge.earned ? '' : 'text-slate-500'}`}>{badge.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                  {badge.earned && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400">
                      Đạt được
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emotion mastery detail */}
        {analytics && Object.keys(analytics.emotionAccuracy).length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-base font-bold mb-5">Thành thạo từng cảm xúc</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(analytics.emotionAccuracy).sort((a, b) => b[1].accuracy - a[1].accuracy).map(([emotion, stat]) => (
                <div key={emotion} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base text-slate-500">psychology</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{EMOTION_VI[emotion] ?? emotion}</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {stat.accuracy}%
                        <span className="text-xs text-slate-400 ml-1">({stat.correct}/{stat.total})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${stat.accuracy >= 80 ? 'bg-green-500' : stat.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${stat.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Achievements.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

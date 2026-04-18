import { useEffect, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

const RadarChart      = dynamic(() => import('recharts').then(m => m.RadarChart),      { ssr: false });
const Radar           = dynamic(() => import('recharts').then(m => m.Radar),           { ssr: false });
const PolarGrid       = dynamic(() => import('recharts').then(m => m.PolarGrid),       { ssr: false });
const PolarAngleAxis  = dynamic(() => import('recharts').then(m => m.PolarAngleAxis),  { ssr: false });
const Tooltip         = dynamic(() => import('recharts').then(m => m.Tooltip),         { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const LineChart       = dynamic(() => import('recharts').then(m => m.LineChart),       { ssr: false });
const Line            = dynamic(() => import('recharts').then(m => m.Line),            { ssr: false });
const XAxis           = dynamic(() => import('recharts').then(m => m.XAxis),           { ssr: false });
const YAxis           = dynamic(() => import('recharts').then(m => m.YAxis),           { ssr: false });
const CartesianGrid   = dynamic(() => import('recharts').then(m => m.CartesianGrid),   { ssr: false });
const ReferenceLine   = dynamic(() => import('recharts').then(m => m.ReferenceLine),   { ssr: false });

interface EmotionStat { correct: number; total: number; accuracy: number; }

interface UserAnalytics {
  totalLessonsCompleted: number;
  avgScore: number;
  totalXp: number;
  emotionAccuracy: Record<string, EmotionStat>;
  weakestEmotion: string | null;
  strongestEmotion: string | null;
}

interface ProgressRecord {
  id: string;
  lessonId: string;
  lessonTitle: string | null;
  courseId?: string;
  score: number | null;
  completedAt: string | null;
}

interface CourseResponse { id: string; title: string; lessonCount?: number; image?: string | null; }

const EMOTION_LABELS: Record<string, string> = {
  happiness: 'Hạnh phúc', sadness: 'Buồn bã', anger: 'Tức giận',
  surprise: 'Ngạc nhiên', fear: 'Sợ hãi', disgust: 'Ghê tởm', neutral: 'Bình thản',
};


// Custom tooltip for radar chart showing correct/total
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadarTooltip({ active, payload, emotionMap }: any) {
  if (!active || !payload?.length) return null;
  const emotion = payload[0]?.payload?.emotion ?? '';
  const key = Object.entries(EMOTION_LABELS).find(([, v]) => v === emotion)?.[0] ?? '';
  const stat = emotionMap[key];
  if (!stat) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-slate-900 dark:text-white mb-1">{emotion}</p>
      <p className="text-slate-500">Đúng: <span className="font-semibold text-slate-800 dark:text-slate-200">{stat.correct}/{stat.total}</span></p>
      <p className="text-slate-500">Chính xác: <span className={`font-black ${stat.accuracy >= 80 ? 'text-green-600' : stat.accuracy >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{stat.accuracy}%</span></p>
    </div>
  );
}

// Custom tooltip for line chart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LineTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-600 dark:text-slate-400 mb-1 truncate max-w-[180px]">{d?.name}</p>
      <p className="font-black text-primary text-lg">{d?.score}%</p>
    </div>
  );
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [progresses, setProgresses] = useState<ProgressRecord[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    Promise.all([
      api.get<UserAnalytics>('/api/users/me/analytics'),
      api.get<ProgressRecord[]>('/api/users/me/progress'),
      api.get<CourseResponse[]>('/api/courses/my'),
    ]).then(([a, p, c]) => {
      setAnalytics(a);
      setProgresses((p ?? []).filter(x => x.score !== null && x.completedAt));
      setCourses(c ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // ── Derived data ──────────────────────────────────────────────

  // Radar chart data
  const radarData = Object.entries(analytics?.emotionAccuracy ?? {}).map(([k, v]) => ({
    emotion: EMOTION_LABELS[k] ?? k,
    value: v.accuracy,
    fullMark: 100,
  }));

  // Line chart: group by day → avg score per day
  const lineData = (() => {
    const byDay: Record<string, number[]> = {};
    [...progresses]
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
      .forEach(p => {
        const day = new Date(p.completedAt!).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(p.score!);
      });
    return Object.entries(byDay).map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
      name: date,
    }));
  })();

  // Course breakdown — richer stats
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));
  const courseStats = Object.entries(
    progresses.reduce<Record<string, ProgressRecord[]>>((acc, p) => {
      const cid = p.courseId ?? 'unknown';
      if (!acc[cid]) acc[cid] = [];
      acc[cid].push(p);
      return acc;
    }, {})
  ).map(([cid, records]) => {
    const scores = records.map(r => r.score!);
    const sorted = [...records].sort((a, b) =>
      new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );
    const course = courseMap[cid];
    const totalLessons = course?.lessonCount ?? 0;
    const uniqueLessons = new Set(records.map(r => r.lessonId)).size;
    // Last 8 scores in chronological order for sparkline
    const sparkline = [...records]
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
      .slice(-8)
      .map(r => r.score!);
    return {
      courseId: cid,
      title: course?.title ?? 'Khoá học',
      avg: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
      best: Math.max(...scores),
      worst: Math.min(...scores),
      count: scores.length,
      uniqueLessons,
      totalLessons,
      lastDate: sorted[0]?.completedAt
        ? new Date(sorted[0].completedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null,
      sparkline,
    };
  }).sort((a, b) => b.avg - a.avg);

  const LoadingBox = ({ h = 'h-64' }: { h?: string }) => (
    <div className={`${h} rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse`} />
  );

  const avgScore = analytics?.avgScore ?? 0;

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Phân tích</h1>
      </AppPageHeader>

      <div className="app-content">

        {/* ── Hàng 1: KPI cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Độ chính xác TB', value: `${analytics?.avgScore ?? 0}%`, icon: 'target', color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Bài học hoàn thành', value: analytics?.totalLessonsCompleted ?? 0, icon: 'menu_book', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
            { label: 'Tổng XP', value: (analytics?.totalXp ?? 0).toLocaleString(), icon: 'bolt', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
          ].map(card => (
            <div key={card.label} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                <p className="text-2xl font-black mt-0.5">{loading ? '...' : card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Hàng 2: Line chart full-width ── */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-base font-bold">Xu hướng điểm số theo thời gian</h3>
              <p className="text-xs text-slate-400 mt-0.5">Điểm trung bình mỗi ngày — rê chuột để xem chi tiết</p>
            </div>
            {lineData.length >= 2 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                {lineData.length} ngày
              </span>
            )}
          </div>
          {loading ? <LoadingBox h="h-56" /> : lineData.length < 2 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-4xl">show_chart</span>
              <p className="text-sm">Cần ít nhất 2 ngày làm bài để hiển thị xu hướng</p>
            </div>
          ) : mounted ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<LineTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <ReferenceLine y={avgScore} stroke="#6366f1" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Line
                  type="monotone" dataKey="score"
                  stroke="#6366f1" strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : <LoadingBox h="h-56" />}
        </div>

        {/* ── Hàng 3: Radar + Course stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Radar polygon với tooltip chi tiết */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold mb-0.5">Biểu đồ đa giác cảm xúc</h3>
            <p className="text-xs text-slate-400 mb-4">Rê chuột vào từng cạnh để xem số liệu chi tiết</p>
            {loading ? <LoadingBox /> : radarData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-4xl">radar</span>
                <p className="text-sm">Chưa có dữ liệu cảm xúc</p>
              </div>
            ) : mounted ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="emotion"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  />
                  <Radar
                    name="Điểm"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2.5}
                  />
                  <Tooltip content={<RadarTooltip emotionMap={analytics?.emotionAccuracy ?? {}} />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <LoadingBox />}
          </div>

          {/* Course breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold mb-0.5">Thống kê theo khoá học</h3>
            <p className="text-xs text-slate-400 mb-5">Hiệu suất chi tiết từng khoá bạn đã học</p>
            {loading ? (
              <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}</div>
            ) : courseStats.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-4xl">school</span>
                <p className="text-sm">Chưa có dữ liệu khoá học</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courseStats.map(c => {
                  const avgColor = c.avg >= 80 ? 'bg-green-500' : c.avg >= 60 ? 'bg-yellow-500' : 'bg-red-400';
                  const avgText  = c.avg >= 80 ? 'text-green-600' : c.avg >= 60 ? 'text-yellow-600' : 'text-red-500';
                  const completePct = c.totalLessons > 0
                    ? Math.round((c.uniqueLessons / c.totalLessons) * 100)
                    : null;
                  const sparkMax = Math.max(...c.sparkline, 1);
                  return (
                    <div key={c.courseId} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
                      {/* Title + last date */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">{c.title}</p>
                        {c.lastDate && (
                          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            {c.lastDate}
                          </span>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg py-2">
                          <p className={`text-base font-black ${avgText}`}>{c.avg}%</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Trung bình</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg py-2">
                          <p className="text-base font-black text-green-600">{c.best}%</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Cao nhất</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg py-2">
                          <p className="text-base font-black text-red-500">{c.worst}%</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Thấp nhất</p>
                        </div>
                      </div>

                      {/* Progress bar + sparkline */}
                      <div className="flex items-end gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Tiến độ hoàn thành</span>
                            <span>{c.uniqueLessons}{c.totalLessons > 0 ? `/${c.totalLessons}` : ''} bài · {c.count} lần</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${avgColor}`}
                              style={{ width: completePct != null ? `${completePct}%` : '100%' }}
                            />
                          </div>
                        </div>
                        {/* Mini sparkline */}
                        {c.sparkline.length > 1 && (
                          <div className="flex items-end gap-[2px] h-8 shrink-0">
                            {c.sparkline.map((s, i) => (
                              <div
                                key={i}
                                className={`w-1.5 rounded-sm ${s >= 80 ? 'bg-green-400' : s >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                style={{ height: `${Math.round((s / sparkMax) * 100)}%` }}
                                title={`${s}%`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

Analytics.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

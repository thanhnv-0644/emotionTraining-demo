"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import AppPageHeader from "@/components/AppPageHeader";

// ─── Recharts dynamic imports (SSR-safe) ────────────────────────────────────
const BarChart      = dynamic(() => import("recharts").then(m => m.BarChart),      { ssr: false });
const Bar           = dynamic(() => import("recharts").then(m => m.Bar),           { ssr: false });
const LineChart     = dynamic(() => import("recharts").then(m => m.LineChart),     { ssr: false });
const Line          = dynamic(() => import("recharts").then(m => m.Line),          { ssr: false });
const RadarChart    = dynamic(() => import("recharts").then(m => m.RadarChart),    { ssr: false });
const Radar         = dynamic(() => import("recharts").then(m => m.Radar),         { ssr: false });
const PolarGrid     = dynamic(() => import("recharts").then(m => m.PolarGrid),     { ssr: false });
const PolarAngleAxis= dynamic(() => import("recharts").then(m => m.PolarAngleAxis),{ ssr: false });
const PieChart      = dynamic(() => import("recharts").then(m => m.PieChart),      { ssr: false });
const Pie           = dynamic(() => import("recharts").then(m => m.Pie),           { ssr: false });
const Cell          = dynamic(() => import("recharts").then(m => m.Cell),          { ssr: false });
const XAxis         = dynamic(() => import("recharts").then(m => m.XAxis),         { ssr: false });
const YAxis         = dynamic(() => import("recharts").then(m => m.YAxis),         { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false });
const Tooltip       = dynamic(() => import("recharts").then(m => m.Tooltip),       { ssr: false });
const Legend        = dynamic(() => import("recharts").then(m => m.Legend),        { ssr: false });
const ResponsiveContainer = dynamic(
  () => import("recharts").then(m => m.ResponsiveContainer), { ssr: false }
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface MonthlyRevenue { month: string; revenue: number; }
interface MonthlyCount   { month: string; count: number; }
interface TopCourse      { courseId: string; title: string; enrollments: number; revenue: number; avgScore: number; }

interface AdminAnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  totalLessons: number;
  avgSystemScore: number;
  newUsersLast30Days: number;
  activeUsersLast30Days: number;
  roleDistribution: Record<string, number>;
  revenueByMonth: MonthlyRevenue[];
  userGrowth: MonthlyCount[];
  emotionAccuracy: Record<string, number>;
  topCourses: TopCourse[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const EMOTION_LABELS: Record<string, string> = {
  happiness: "Hạnh phúc", sadness: "Buồn bã", anger: "Tức giận",
  surprise: "Ngạc nhiên", fear: "Sợ hãi", disgust: "Ghê tởm", neutral: "Bình thản",
};

const ROLE_COLORS: Record<string, string> = {
  student: "#6366f1", admin: "#f59e0b",
};
const ROLE_LABELS: Record<string, string> = {
  student: "Học viên", admin: "Quản trị viên",
};

const PRIMARY = "#6366f1";
const EMERALD = "#10b981";

// ─── Helper: shorten month label ─────────────────────────────────────────────
function shortMonth(yyyyMm: string) {
  const [y, m] = yyyyMm.split("-");
  return `T${parseInt(m)}/${y.slice(2)}`;
}

// ─── Skeleton placeholder ─────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl ${className}`} />;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, icon, color, sub, trend,
}: {
  label: string; value: string | number; icon: string;
  color: string; sub?: string; trend?: { value: string; up: boolean };
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -mr-6 -mt-6 ${color}`} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${color}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend.up ? "text-emerald-500" : "text-red-400"}`}>
          <span className="material-symbols-outlined text-[14px]">
            {trend.up ? "trending_up" : "trending_down"}
          </span>
          {trend.value}
        </div>
      )}
    </div>
  );
}

// ─── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 ${className}`}>
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-5 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p className="text-primary font-bold">{Number(payload[0].value).toLocaleString("vi-VN")}đ</p>
    </div>
  );
}

function GrowthTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p className="text-emerald-500 font-bold">{payload[0].value} người dùng mới</p>
    </div>
  );
}

function RadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{payload[0].payload.emotion}</p>
      <p className="text-primary font-bold">{payload[0].value}%</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AdminAnalyticsData>("/api/admin/analytics")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Derived data ────────────────────────────────────────────────────────────
  const revenueData = (data?.revenueByMonth ?? []).map(r => ({
    month: shortMonth(r.month), revenue: r.revenue,
  }));

  const growthData = (data?.userGrowth ?? []).map(r => ({
    month: shortMonth(r.month), count: r.count,
  }));

  const radarData = Object.entries(data?.emotionAccuracy ?? {}).map(([key, val]) => ({
    emotion: EMOTION_LABELS[key] ?? key, accuracy: val,
  }));

  const pieData = Object.entries(data?.roleDistribution ?? {}).map(([role, count]) => ({
    name: ROLE_LABELS[role] ?? role, value: count, color: ROLE_COLORS[role] ?? "#94a3b8",
  }));

  const topEnroll = Math.max(...(data?.topCourses ?? []).map(c => c.enrollments), 1);

  return (
    <>
      <AppPageHeader>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
          Analytics hệ thống
        </h2>
      </AppPageHeader>

      <div className="app-content space-y-7">

        {/* ── Row 1: KPI Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            <>
              <KpiCard label="Người dùng" value={(data?.totalUsers ?? 0).toLocaleString()}
                icon="group" color="bg-indigo-500"
                sub="Tổng tài khoản"
                trend={{ value: `+${data?.newUsersLast30Days ?? 0} trong 30 ngày`, up: true }} />
              <KpiCard label="Đang hoạt động" value={(data?.activeUsersLast30Days ?? 0).toLocaleString()}
                icon="person_check" color="bg-emerald-500"
                sub="30 ngày gần nhất" />
              <KpiCard label="Khoá học" value={(data?.totalCourses ?? 0).toLocaleString()}
                icon="book_5" color="bg-blue-500"
                sub={`${data?.totalLessons ?? 0} bài học`} />
              <KpiCard label="Đăng ký" value={(data?.totalEnrollments ?? 0).toLocaleString()}
                icon="school" color="bg-purple-500"
                sub="Tổng lượt đăng ký" />
              <KpiCard label="Doanh thu" value={`${(data?.totalRevenue ?? 0).toLocaleString("vi-VN")}đ`}
                icon="payments" color="bg-amber-500"
                sub="Tổng thanh toán" />
              <KpiCard label="Điểm TB hệ thống" value={`${data?.avgSystemScore ?? 0}%`}
                icon="grade" color="bg-rose-500"
                sub="Tất cả học viên" />
            </>
          )}
        </div>

        {/* ── Row 2: Revenue Bar + Role Pie ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue bar chart */}
          <ChartCard title="Doanh thu theo tháng" className="lg:col-span-2">
            {loading ? <Skeleton className="h-64" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)}
                    tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                  <Bar dataKey="revenue" fill={PRIMARY} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Role Pie chart */}
          <ChartCard title="Phân phối người dùng">
            {loading ? <Skeleton className="h-64" /> : pieData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%"
                      innerRadius={52} outerRadius={80} paddingAngle={3}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v} người`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 w-full">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* ── Row 3: User Growth Line + Emotion Radar ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User growth line chart */}
          <ChartCard title="Tăng trưởng người dùng (12 tháng)">
            {loading ? <Skeleton className="h-64" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<GrowthTooltip />} />
                  <Line type="monotone" dataKey="count" stroke={EMERALD} strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, fill: EMERALD }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Emotion Radar */}
          <ChartCard title="Độ chính xác cảm xúc toàn hệ thống">
            {loading ? <Skeleton className="h-64" /> : radarData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Chưa có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Radar dataKey="accuracy" stroke={PRIMARY} fill={PRIMARY} fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip content={<RadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 4: Top Courses Table ────────────────────────────────────── */}
        <ChartCard title="Top khoá học phổ biến nhất">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : (data?.topCourses ?? []).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                <span className="col-span-1">#</span>
                <span className="col-span-4">Khoá học</span>
                <span className="col-span-3">Đăng ký</span>
                <span className="col-span-2 text-right">Doanh thu</span>
                <span className="col-span-2 text-right">Điểm TB</span>
              </div>
              {(data?.topCourses ?? []).map((course, i) => {
                const barPct = Math.round((course.enrollments / topEnroll) * 100);
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div key={course.courseId}
                    className="grid grid-cols-12 items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-3 border border-slate-100 dark:border-slate-800">
                    {/* Rank */}
                    <div className="col-span-1">
                      {i < 3 ? (
                        <span className="text-lg">{medals[i]}</span>
                      ) : (
                        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-black text-slate-500">
                          {i + 1}
                        </span>
                      )}
                    </div>
                    {/* Title */}
                    <div className="col-span-4 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{course.title}</p>
                    </div>
                    {/* Enrollment bar */}
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${barPct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap w-12 text-right">
                        {course.enrollments.toLocaleString()}
                      </span>
                    </div>
                    {/* Revenue */}
                    <div className="col-span-2 text-right">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {course.revenue > 0 ? `${course.revenue.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                      </span>
                    </div>
                    {/* Avg score */}
                    <div className="col-span-2 text-right">
                      <span className={`text-xs font-bold ${
                        course.avgScore >= 80 ? "text-emerald-500"
                          : course.avgScore >= 60 ? "text-amber-500"
                          : course.avgScore > 0 ? "text-red-400"
                          : "text-slate-400"
                      }`}>
                        {course.avgScore > 0 ? `${course.avgScore}%` : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>

      </div>
    </>
  );
}

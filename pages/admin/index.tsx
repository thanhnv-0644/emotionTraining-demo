import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';

interface AdminAnalytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  topCourses: Array<{ courseId: string; title: string; enrollments: number }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AdminAnalytics>('/api/admin/analytics')
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Bảng điều khiển</h1>
      </AppPageHeader>

      <div className="app-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng người dùng</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : (analytics?.totalUsers ?? 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng khoá học</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : analytics?.totalCourses ?? 0}
            </h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng đăng ký</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : (analytics?.totalEnrollments ?? 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Doanh thu</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : (analytics?.totalRevenue ?? 0).toLocaleString('vi-VN') + 'đ'}
            </h3>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Khoá học phổ biến nhất</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
            </div>
          ) : (analytics?.topCourses ?? []).length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">Chưa có dữ liệu.</p>
          ) : (
            <div className="space-y-3">
              {(analytics?.topCourses ?? []).map((course, i) => (
                <div key={course.courseId} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-sm">{course.title}</span>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    {course.enrollments.toLocaleString()} đăng ký
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

AdminDashboard.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AppPageHeader from "@/components/AppPageHeader";

interface AdminAnalytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  topCourses: Array<{ courseId: string; title: string; enrollments: number }>;
  emotionAccuracy: Record<string, number>;
}

const EMOTION_LABELS: Record<string, string> = {
  happiness: "Hạnh phúc",
  sadness: "Buồn bã",
  anger: "Tức giận",
  surprise: "Ngạc nhiên",
  fear: "Sợ hãi",
  disgust: "Ghê tởm",
  neutral: "Bình thản",
};

const EMOTION_COLORS: Record<string, string> = {
  happiness: "bg-yellow-400",
  sadness: "bg-blue-400",
  anger: "bg-red-400",
  surprise: "bg-orange-400",
  fear: "bg-purple-400",
  disgust: "bg-green-400",
  neutral: "bg-slate-400",
};

export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AdminAnalytics>("/api/admin/analytics")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const emotionEntries = Object.entries(data?.emotionAccuracy ?? {})
    .sort((a, b) => b[1] - a[1]);

  return (
    <>
      <AppPageHeader>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Analytics hệ thống</h2>
      </AppPageHeader>

      <div className="app-content">
        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng người dùng</p>
            <h3 className="text-3xl font-black mt-2">{loading ? "..." : (data?.totalUsers ?? 0).toLocaleString()}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng khoá học</p>
            <h3 className="text-3xl font-black mt-2">{loading ? "..." : data?.totalCourses ?? 0}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Tổng đăng ký</p>
            <h3 className="text-3xl font-black mt-2">{loading ? "..." : (data?.totalEnrollments ?? 0).toLocaleString()}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10" />
            <p className="text-slate-500 text-sm font-medium">Doanh thu</p>
            <h3 className="text-3xl font-black mt-2">
              {loading ? "..." : `${(data?.totalRevenue ?? 0).toLocaleString("vi-VN")}đ`}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Độ chính xác theo cảm xúc */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Độ chính xác nhận diện cảm xúc (trung bình toàn hệ thống)</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
              </div>
            ) : emotionEntries.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-5">
                {emotionEntries.map(([emotion, accuracy]) => (
                  <div key={emotion}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {EMOTION_LABELS[emotion] ?? emotion}
                      </span>
                      <span className="font-bold">{accuracy}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                      <div
                        className={`${EMOTION_COLORS[emotion] ?? "bg-primary"} h-2.5 rounded-full`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top khoá học */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Khoá học phổ biến nhất</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
              </div>
            ) : (data?.topCourses ?? []).length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-3">
                {(data?.topCourses ?? []).map((course, i) => (
                  <div key={course.courseId} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-semibold text-sm truncate">{course.title}</span>
                    <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                      {course.enrollments.toLocaleString()} đăng ký
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

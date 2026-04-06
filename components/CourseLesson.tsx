'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import AppPageHeader from '@/components/AppPageHeader';

interface Lesson {
  id: string;
  number: number;
  title: string;
  duration: string;
  level: string;
  status: 'completed' | 'in-progress' | 'locked';
  score?: number;
}

interface CourseLessonProps {
  courseId: string;
  courseName: string;
  lessons: Lesson[];
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function CourseLesson({
  courseId,
  courseName,
  lessons,
  progress,
  completedLessons,
  totalLessons,
}: CourseLessonProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
            Đã xong
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-primary/20 text-primary">
            Đang học
          </span>
        );
      case 'locked':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
            Khoá
          </span>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in-progress':
        return 'play_circle';
      case 'locked':
        return 'lock';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'bg-primary/10 text-primary';
      case 'locked':
        return 'bg-slate-200 dark:bg-slate-800 text-slate-500';
    }
  };

  return (
    <main className="min-h-screen overflow-y-auto">
        <AppPageHeader>
          <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link className="shrink-0 hover:text-primary" href="/user/courses">
              Khoá học
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="truncate font-medium text-slate-900 dark:text-slate-100">{courseName}</span>
          </div>
          <button type="button" className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/90">
            <span className="material-symbols-outlined text-sm">play_circle</span>
            Tiếp tục học
          </button>
        </AppPageHeader>

        <div className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10">
          {/* Course Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary/40 p-10 text-white mb-8 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Lộ trình chứng chỉ
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">{courseName}</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Rèn luyện khả năng nhận diện cảm xúc và biểu cảm nhỏ qua các tình huống thực tế và phân tích âm thanh.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-300">Tiến độ</span>
                    <span className="text-xl font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">
                  <span className="text-white font-bold">{completedLessons}</span> /{' '}
                  <span className="text-white font-bold">{totalLessons}</span> bài đã hoàn thành
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Content */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chương trình bài học</h3>
            </div>

            {/* Lesson Cards */}
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`group rounded-xl p-5 flex items-center gap-6 transition-all ${
                    lesson.status === 'locked'
                      ? 'bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed opacity-60 grayscale-[0.5]'
                      : lesson.status === 'in-progress'
                        ? 'relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-primary shadow-xl shadow-primary/5 ring-4 ring-primary/5'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'
                  }`}
                >
                  <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${getStatusColor(lesson.status)}`}>
                    <span className="material-symbols-outlined text-[28px]">{getStatusIcon(lesson.status)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Bài {String(lesson.number).padStart(2, '0')}
                      </span>
                      {getStatusBadge(lesson.status)}
                    </div>
                    <h4 className={`text-lg font-bold truncate ${lesson.status !== 'locked' && 'group-hover:text-primary transition-colors'}`}>
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {lesson.duration}
                      </div>
                      {lesson.status === 'locked' ? (
                        <div className="flex items-center gap-1 text-slate-400 italic">
                          Hoàn thành bài trước để mở khoá
                        </div>
                      ) : lesson.status === 'completed' && lesson.score ? (
                        <div className="flex items-center gap-1 text-primary dark:text-primary/80 font-semibold">
                          <span className="material-symbols-outlined text-sm">analytics</span>
                          Điểm: {lesson.score}%
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">hotel_class</span>
                          Cấp {lesson.level}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (lesson.status !== 'locked') {
                        router.push(`/user/courses/${courseId}/lessons/${lesson.id}`);
                      }
                    }}
                    disabled={lesson.status === 'locked'}
                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      lesson.status === 'locked'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        : lesson.status === 'in-progress'
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lesson.status === 'locked' ? 'Đã khoá' : lesson.status === 'completed' ? 'Xem lại' : 'Bắt đầu'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    </main>
  );
}

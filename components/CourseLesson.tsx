'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { BASE_URL } from '@/lib/api';

interface Lesson {
  id: string;
  number: number;
  title: string;
  duration: string;
  level: string;
  status: 'completed' | 'in-progress' | 'locked';
  score?: number;
}

const LEVEL_CONFIG: Record<string, { label: string; className: string }> = {
  easy:     { label: 'Dễ',         className: 'bg-green-500/20 text-green-300 border border-green-500/40' },
  medium:   { label: 'Trung bình', className: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' },
  advanced: { label: 'Nâng cao',   className: 'bg-red-500/20 text-red-300 border border-red-500/40' },
};

const LEVEL_VI: Record<string, string> = {
  easy: 'Dễ', beginner: 'Cơ bản', medium: 'Trung bình',
  intermediate: 'Trung bình', advanced: 'Nâng cao', hard: 'Khó',
};

interface CourseLessonProps {
  courseId: string;
  courseName: string;
  image?: string | null;
  description?: string;
  category?: string;
  isFree?: boolean;
  price?: number;
  lessons: Lesson[];
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function CourseLesson({
  courseId,
  courseName,
  image,
  description,
  category,
  isFree,
  price,
  lessons,
  progress,
  completedLessons,
  totalLessons,
}: CourseLessonProps) {
  const level = category ? LEVEL_CONFIG[category] : null;
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">Đã xong</span>;
      case 'in-progress':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-primary/20 text-primary">Đang học</span>;
      case 'locked':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-500">Khoá</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'in-progress': return 'play_circle';
      case 'locked': return 'lock';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400';
      case 'in-progress': return 'bg-primary/10 text-primary';
      case 'locked': return 'bg-slate-200 dark:bg-slate-800 text-slate-500';
    }
  };

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-y-auto">
      {/* Sticky breadcrumb — same as detail page */}
      <div className="flex items-center px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link className="hover:text-primary transition-colors shrink-0" href="/user/courses">Khoá học</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary transition-colors truncate max-w-[140px]" href={`/user/courses/${courseId}`}>
            {courseName}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 shrink-0">Bài học</span>
        </div>
      </div>

      {/* Hero — identical style to course detail page */}
      <div className="relative w-full bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 overflow-hidden shrink-0">
        {image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-110"
            style={{ backgroundImage: `url('${BASE_URL}${image}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 px-8 pt-10 pb-12 lg:px-12 lg:pt-12 lg:pb-16 min-h-[280px] lg:min-h-[300px]">
          {/* Left */}
          <div className="flex-1 min-w-0">
            {(level || isFree !== undefined) && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {level && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${level.className}`}>
                    {level.label}
                  </span>
                )}
                {isFree !== undefined && (
                  (isFree || !price) ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Miễn phí</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      {price!.toLocaleString('vi-VN')}đ
                    </span>
                  )
                )}
              </div>
            )}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
              {courseName}
            </h1>
            {description && (
              <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-2xl">{description}</p>
            )}
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Tiến độ</span>
                  <span className="font-bold text-white">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-slate-400 text-sm shrink-0">
                <span className="text-white font-bold">{completedLessons}</span>
                {' / '}
                <span className="text-white font-bold">{totalLessons}</span>
                {' bài đã hoàn thành'}
              </p>
            </div>
          </div>

          {/* Right: image */}
          <div className="shrink-0 hidden lg:block w-72 xl:w-80 h-44 xl:h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {image ? (
              <img src={`${BASE_URL}${image}`} alt={courseName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-7xl text-white/20">psychology</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="p-6 sm:p-8 pt-8 sm:pt-10 flex flex-col gap-5">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chương trình bài học</h3>
        <div className="flex flex-col gap-3">
          {lessons.map(lesson => (
            <div
              key={lesson.id}
              className={`group rounded-xl p-5 flex items-center gap-5 transition-all ${
                lesson.status === 'locked'
                  ? 'bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed opacity-60 grayscale-[0.5]'
                  : lesson.status === 'in-progress'
                    ? 'bg-white dark:bg-slate-900 border-2 border-primary shadow-lg shadow-primary/5 ring-4 ring-primary/5'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none'
              }`}
            >
              <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${getStatusColor(lesson.status)}`}>
                <span className="material-symbols-outlined text-[28px]">{getStatusIcon(lesson.status)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Bài {String(lesson.number).padStart(2, '0')}
                  </span>
                  {getStatusBadge(lesson.status)}
                </div>
                <h4 className={`text-base font-bold truncate ${lesson.status !== 'locked' ? 'group-hover:text-primary transition-colors' : ''}`}>
                  {lesson.title}
                </h4>
                <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {lesson.duration}
                  </span>
                  {lesson.status === 'locked' ? (
                    <span className="italic">Hoàn thành bài trước để mở khoá</span>
                  ) : lesson.status === 'completed' && lesson.score != null ? (
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <span className="material-symbols-outlined text-sm">analytics</span>
                      Điểm: {lesson.score}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">hotel_class</span>
                      {LEVEL_VI[lesson.level] ?? lesson.level}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => lesson.status !== 'locked' && router.push(`/user/courses/${courseId}/lessons/${lesson.id}`)}
                disabled={lesson.status === 'locked'}
                className={`shrink-0 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  lesson.status === 'locked'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
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
  );
}

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import CourseLesson from '@/components/CourseLesson';
import { api } from '@/lib/api';
import UserLayout from '@/components/UserLayout';

interface LessonResponse {
  id: string;
  courseId: string;
  title: string;
  order: number;
  level: string;
  duration: number;
  status: string;
  audioClipCount: number;
}

interface CourseDetailResponse {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  lessonCount: number;
  enrolled: boolean;
  isFree: boolean;
  lessons: LessonResponse[];
}

interface ProgressResponse {
  id: string;
  lessonId: string;
  score: number | null;
  completedAt: string | null;
  attemptNumber: number;
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function CourseLessonsPage() {
  const router = useRouter();
  const { courseId } = router.query as { courseId: string };

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [progresses, setProgresses] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      api.get<CourseDetailResponse>(`/api/courses/${courseId}`),
      api.get<ProgressResponse[]>('/api/users/me/progress'),
    ]).then(([c, p]) => {
      setCourse(c);
      setProgresses(p ?? []);
    }).catch(() => setError('Không thể tải khoá học.'))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy khoá học</h1>
          <p className="mt-2 text-slate-500">{error || 'Khoá học không tồn tại.'}</p>
        </div>
      </div>
    );
  }

  // Compute status for each lesson based on progress
  const completedLessonIds = new Set(
    progresses.filter(p => p.score !== null).map(p => p.lessonId)
  );

  const lessons = course.lessons.map((lesson, index) => {
    let lessonStatus: 'completed' | 'in-progress' | 'locked';
    if (completedLessonIds.has(lesson.id)) {
      lessonStatus = 'completed';
    } else {
      const firstIncomplete = course.lessons.findIndex(l => !completedLessonIds.has(l.id));
      lessonStatus = index === firstIncomplete ? 'in-progress' : 'locked';
    }
    const progress = progresses.find(p => p.lessonId === lesson.id);
    return {
      id: lesson.id,
      number: lesson.order,
      title: lesson.title,
      duration: formatDuration(lesson.duration ?? 0),
      level: lesson.level as 'beginner' | 'intermediate' | 'advanced',
      status: lessonStatus,
      score: progress?.score ?? undefined,
    };
  });

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const progress = course.lessons.length > 0
    ? Math.round((completedCount / course.lessons.length) * 100)
    : 0;

  return (
    <CourseLesson
      courseId={course.id}
      courseName={course.title}
      lessons={lessons}
      progress={progress}
      completedLessons={completedCount}
      totalLessons={course.lessons.length}
    />
  );
}

CourseLessonsPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

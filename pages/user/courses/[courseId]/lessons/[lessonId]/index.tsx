import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LessonSession from '@/components/LessonSession';
import { api, BASE_URL } from '@/lib/api';

interface AudioClipResponse {
  id: string;
  lessonId: string;
  subject: string;
  audioUrl: string;
  duration: number;
  targetEmotion: string;
  order: number;
}

interface LessonDetailResponse {
  id: string;
  courseId: string;
  title: string;
  order: number;
  level: string;
  duration: number;
  audioClips: AudioClipResponse[];
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LessonSessionPage() {
  const router = useRouter();
  const { courseId, lessonId } = router.query as { courseId: string; lessonId: string };

  const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!lessonId) return;
    api.get<LessonDetailResponse>(`/api/lessons/${lessonId}`)
      .then(setLesson)
      .catch(() => setError('Không thể tải bài học.'))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy bài học</h1>
          <p className="mt-2 text-slate-500">{error || 'Bài học không tồn tại.'}</p>
        </div>
      </div>
    );
  }

  const audioClips = (lesson.audioClips ?? [])
    .sort((a, b) => a.order - b.order)
    .map(clip => ({
      id: clip.id,
      subject: clip.subject,
      scenario: clip.subject,
      duration: formatDuration(clip.duration ?? 0),
      url: `${BASE_URL}${clip.audioUrl}`,
      targetEmotion: clip.targetEmotion,
    }));

  return (
    <LessonSession
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle={lesson.title}
      audioClips={audioClips}
    />
  );
}

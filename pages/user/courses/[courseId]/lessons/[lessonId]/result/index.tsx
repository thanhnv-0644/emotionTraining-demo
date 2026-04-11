import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LessonResult from '@/components/LessonResult';

interface AnswerItem {
  question: string;
  selected: string;
  correct: string;
  status: 'correct' | 'incorrect';
}

interface ResultData {
  lessonTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  answers: AnswerItem[];
}

export default function LessonResultPage() {
  const router = useRouter();
  const { courseId, lessonId } = router.query as { courseId: string; lessonId: string };
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('lessonResult');
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        // malformed data — redirect back
        router.replace(`/user/courses/${courseId}`);
      }
    } else {
      router.replace(`/user/courses/${courseId}`);
    }
  }, [courseId, router]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LessonResult
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle={result.lessonTitle}
      score={result.score}
      totalQuestions={result.totalQuestions}
      correctAnswers={result.correctAnswers}
      xpEarned={result.xpEarned ?? 0}
      answers={result.answers}
    />
  );
}

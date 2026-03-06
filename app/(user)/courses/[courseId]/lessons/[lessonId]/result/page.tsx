'use client';

import LessonResult from '@/components/LessonResult';

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonResultPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  // Sample result data - in production, this would come from your backend
  // based on the lesson completion data
  const resultData = {
    lessonTitle: 'Happiness Recognition',
    score: 85,
    totalQuestions: 5,
    correctAnswers: 4,
    timeSpent: '12m 45s',
  };

  return (
    <LessonResult
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle={resultData.lessonTitle}
      score={resultData.score}
      totalQuestions={resultData.totalQuestions}
      correctAnswers={resultData.correctAnswers}
      timeSpent={resultData.timeSpent}
    />
  );
}

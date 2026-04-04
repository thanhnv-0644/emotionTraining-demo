import type { GetServerSideProps } from 'next';

import LessonResult from '@/components/LessonResult';

interface Props {
  courseId: string;
  lessonId: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { courseId, lessonId } = context.params || {};
  return {
    props: {
      courseId: typeof courseId === 'string' ? courseId : '',
      lessonId: typeof lessonId === 'string' ? lessonId : '',
    },
  };
};

export default function LessonResultPage({ courseId, lessonId }: Props) {

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

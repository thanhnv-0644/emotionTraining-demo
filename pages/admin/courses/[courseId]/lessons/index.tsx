import type { GetServerSideProps } from 'next';
import LessonManagement from '@/components/LessonManagement';

interface Props {
  courseId: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { courseId } = context.params || {};
  return {
    props: {
      courseId: typeof courseId === 'string' ? courseId : '',
    },
  };
};

export default function CourseLessonsPage({ courseId }: Props) {
  return <LessonManagement courseId={courseId} />;
}

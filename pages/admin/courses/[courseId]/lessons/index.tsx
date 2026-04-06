import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import LessonManagement from '@/components/LessonManagement';
import AdminLayout from '@/components/AdminLayout';

export default function CourseLessonsPage() {
  const { query } = useRouter();
  const courseId = typeof query.courseId === 'string' ? query.courseId : '';
  return <LessonManagement courseId={courseId} />;
}

CourseLessonsPage.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

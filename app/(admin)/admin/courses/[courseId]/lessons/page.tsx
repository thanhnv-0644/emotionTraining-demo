import LessonManagement from '@/components/LessonManagement';

export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <LessonManagement courseId={courseId} />;
}

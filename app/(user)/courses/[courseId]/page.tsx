'use client';

import { useState } from 'react';
import CourseLesson from '@/components/CourseLesson';

interface Lesson {
  id: string;
  number: number;
  title: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'completed' | 'in-progress' | 'locked';
  score?: number;
}

interface Props {
  params: Promise<{ courseId: string }>;
}

// Sample data
const coursesData: { [key: string]: { id: string; name: string; description: string; lessons: Lesson[] } } = {
  'react-basics': {
    id: 'react-basics',
    name: 'React Emotion Recognition',
    description: 'Learn to recognize and classify emotions in speech',
    lessons: [
      {
        id: 'lesson-1',
        number: 1,
        title: 'Happiness Recognition',
        duration: '5 min',
        level: 'beginner',
        status: 'completed',
        score: 92,
      },
      {
        id: 'lesson-2',
        number: 2,
        title: 'Sadness Detection',
        duration: '5 min',
        level: 'beginner',
        status: 'in-progress',
      },
      {
        id: 'lesson-3',
        number: 3,
        title: 'Anger Identification',
        duration: '5 min',
        level: 'intermediate',
        status: 'locked',
      },
      {
        id: 'lesson-4',
        number: 4,
        title: 'Fear Recognition',
        duration: '5 min',
        level: 'intermediate',
        status: 'locked',
      },
      {
        id: 'lesson-5',
        number: 5,
        title: 'Surprise Detection',
        duration: '5 min',
        level: 'intermediate',
        status: 'locked',
      },
    ],
  },
  'nlp-advanced': {
    id: 'nlp-advanced',
    name: 'Advanced NLP Techniques',
    description: 'Master advanced emotion analysis techniques',
    lessons: [
      {
        id: 'lesson-1',
        number: 1,
        title: 'Context-Based Analysis',
        duration: '8 min',
        level: 'advanced',
        status: 'completed',
        score: 88,
      },
      {
        id: 'lesson-2',
        number: 2,
        title: 'Multi-Emotion Detection',
        duration: '8 min',
        level: 'advanced',
        status: 'in-progress',
      },
      {
        id: 'lesson-3',
        number: 3,
        title: 'Temporal Emotion Flow',
        duration: '8 min',
        level: 'advanced',
        status: 'locked',
      },
    ],
  },
};

export default async function CourseLessonsPage({ params }: Props) {
  const { courseId } = await params;
  const course = coursesData[courseId as keyof typeof coursesData];

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The course you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const completedLessons = course.lessons.filter((l) => l.status === 'completed').length;
  const totalLessons = course.lessons.length;
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <CourseLesson
      courseId={course.id}
      courseName={course.name}
      lessons={course.lessons}
      progress={progress}
      completedLessons={completedLessons}
      totalLessons={totalLessons}
    />
  );
}

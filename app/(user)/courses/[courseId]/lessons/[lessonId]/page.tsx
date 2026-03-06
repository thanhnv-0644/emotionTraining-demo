'use client';

import { useState } from 'react';
import LessonSession from '@/components/LessonSession';

interface AudioClip {
  id: string;
  subject: string;
  scenario: string;
  duration: string;
  url?: string;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  audioClips: AudioClip[];
}

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

// Sample data
const lessonsData: { [key: string]: { [key: string]: LessonData } } = {
  'react-basics': {
    'lesson-1': {
      id: 'lesson-1',
      title: 'Happiness Recognition',
      description: 'Learn to recognize happy emotions in speech patterns and voice tone.',
      audioClips: [
        { id: 'clip-1', subject: 'Understanding Joy', scenario: 'Someone sharing good news', duration: '00:37' },
        { id: 'clip-2', subject: 'Excitement Expression', scenario: 'Person excited about an event', duration: '00:42' },
        { id: 'clip-3', subject: 'Cheerful Voice', scenario: 'Happy greeting', duration: '00:35' },
        { id: 'clip-4', subject: 'Laughter Context', scenario: 'Person laughing', duration: '00:40' },
        { id: 'clip-5', subject: 'Positive Tone', scenario: 'Celebrating success', duration: '00:38' },
      ],
    },
    'lesson-2': {
      id: 'lesson-2',
      title: 'Sadness Detection',
      description: 'Learn to identify sad emotions in speech and voice characteristics.',
      audioClips: [
        { id: 'clip-1', subject: 'Understanding Sorrow', scenario: 'Discussing loss', duration: '00:40' },
        { id: 'clip-2', subject: 'Melancholic Voice', scenario: 'Expressing disappointment', duration: '00:38' },
        { id: 'clip-3', subject: 'Mournful Tone', scenario: 'Sad news reaction', duration: '00:42' },
        { id: 'clip-4', subject: 'Emotional Pain', scenario: 'Difficulty speaking', duration: '00:36' },
        { id: 'clip-5', subject: 'Depressed Mood', scenario: 'Low energy speech', duration: '00:41' },
      ],
    },
    'lesson-3': {
      id: 'lesson-3',
      title: 'Anger Identification',
      description: 'Learn to recognize angry emotions in speech patterns.',
      audioClips: [
        { id: 'clip-1', subject: 'Irritation Expression', scenario: 'Minor frustration', duration: '00:35' },
        { id: 'clip-2', subject: 'Raised Voice', scenario: 'Angry confrontation', duration: '00:39' },
        { id: 'clip-3', subject: 'Hostile Tone', scenario: 'Aggressive response', duration: '00:37' },
      ],
    },
  },
  'nlp-advanced': {
    'lesson-1': {
      id: 'lesson-1',
      title: 'Context-Based Analysis',
      description: 'Advanced techniques for analyzing emotions based on context.',
      audioClips: [
        { id: 'clip-1', subject: 'Context Interpretation', scenario: 'Sarcastic speech', duration: '00:45' },
        { id: 'clip-2', subject: 'Emotional Nuance', scenario: 'Mixed emotions', duration: '00:50' },
        { id: 'clip-3', subject: 'Hidden Emotions', scenario: 'Masked feelings', duration: '00:48' },
      ],
    },
  },
};

export default async function LessonSessionPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const lesson = lessonsData[courseId as keyof typeof lessonsData]?.[lessonId];

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lesson not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The lesson you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <LessonSession
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle={lesson.title}
      audioClips={lesson.audioClips}
      clipIndex={0}
      totalClips={lesson.audioClips.length}
    />
  );
}

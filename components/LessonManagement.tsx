'use client';

import { useState } from 'react';

interface Lesson {
  id: string;
  filename: string;
  emotion: 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Surprised' | 'Disgusted';
  difficulty: number;
  uploadDate: string;
  duration: string;
  size: string;
}

const LESSONS: Lesson[] = [
  {
    id: 'AUD-001',
    filename: 'Joyful_Greeting.wav',
    emotion: 'Happy',
    difficulty: 85,
    uploadDate: 'Oct 01, 2023',
    duration: '00:45',
    size: '2.4 MB',
  },
  {
    id: 'AUD-002',
    filename: 'Sad_Monologue.mp3',
    emotion: 'Sad',
    difficulty: 40,
    uploadDate: 'Oct 02, 2023',
    duration: '01:12',
    size: '4.1 MB',
  },
  {
    id: 'AUD-003',
    filename: 'Angry_Command.wav',
    emotion: 'Angry',
    difficulty: 92,
    uploadDate: 'Oct 05, 2023',
    duration: '00:15',
    size: '1.1 MB',
  },
  {
    id: 'AUD-004',
    filename: 'Neutral_Dialogue.mp3',
    emotion: 'Neutral',
    difficulty: 10,
    uploadDate: 'Oct 07, 2023',
    duration: '02:30',
    size: '6.8 MB',
  },
];

const EMOTION_COLORS: Record<string, { bg: string; text: string }> = {
  Happy: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  Sad: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  Angry: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  Neutral: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
  Surprised: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  Disgusted: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
};

export default function LessonManagement({ courseId }: { courseId?: string }) {
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.filename.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && lesson.emotion === selectedFilter;
  });

  return (
    <>
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Lesson Management</h1>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
            <span>Courses</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary">Advanced Emotion Analysis</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500"
              placeholder="Search lessons..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="size-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title & Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Audio Lessons
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Manage and evaluate curated audio files for emotional intelligence training.
              </p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/25 transition-all">
              <span className="material-symbols-outlined text-[20px]">upload</span>
              Upload New Audio
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'Happy', 'Sad', 'Angry', 'Neutral'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary text-white flex items-center gap-2'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter === 'all' ? 'All Lessons' : `Emotion: ${filter}`}
                {selectedFilter === filter && (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                    {filteredLessons.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Lessons Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Lesson ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Target Emotion
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLessons.map((lesson) => (
                    <LessonRow key={lesson.id} lesson={lesson} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Showing {filteredLessons.length} of {lessons.length} lessons
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs font-bold text-slate-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
                  1
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold">
                  2
                </button>
                <button className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  const colors = EMOTION_COLORS[lesson.emotion];

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
      <td className="px-6 py-4 text-sm font-mono text-slate-500">{lesson.id}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {lesson.filename}
            </span>
            <span className="text-xs text-slate-500">
              {lesson.duration} • {lesson.size}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold`}>
          {lesson.emotion}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 w-32">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${lesson.difficulty}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold">{lesson.difficulty}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{lesson.uploadDate}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400"
            title="Preview"
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
          </button>
          <button
            className="size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            className="size-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-slate-400 hover:text-red-600"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

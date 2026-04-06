import React, { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

interface ProgressResponse {
  id: string;
  userId: string;
  userName: string;
  lessonId: string;
  lessonTitle: string;
  attemptNumber: number;
  score: number;
  completedAt: string;
  answers: string | null;
  createdAt: string;
}

interface AudioClip {
  id: string;
  subject: string;
  targetEmotion: string;
  order: number;
}

interface ParsedAnswer {
  audioClipId: string;
  correctAnswer: string;
  userAnswer: string | null;
}

interface UserOption { id: string; name: string; email: string; }

const EMOTION_VI: Record<string, string> = {
  happiness: 'Hạnh phúc', sadness: 'Buồn bã', anger: 'Tức giận',
  surprise: 'Ngạc nhiên', fear: 'Sợ hãi', disgust: 'Ghê tởm', neutral: 'Bình thản',
};

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    : score >= 60
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>{score}%</span>;
}

function ResultBadge({ userAnswer, correctAnswer }: { userAnswer: string | null; correctAnswer: string }) {
  if (!userAnswer) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      <span className="material-symbols-outlined text-xs">timer_off</span>Bỏ qua
    </span>
  );
  if (userAnswer === correctAnswer) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      <span className="material-symbols-outlined text-xs">check</span>Đúng
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <span className="material-symbols-outlined text-xs">close</span>Sai
    </span>
  );
}

function AnswerBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ProgressDetail({ progress, clips, clipsLoading }: {
  progress: ProgressResponse;
  clips: AudioClip[];
  clipsLoading: boolean;
}) {
  const [expandedClip, setExpandedClip] = useState<number | null>(null);

  if (clipsLoading) return (
    <div className="space-y-2 py-2">
      {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />)}
    </div>
  );

  let answers: ParsedAnswer[] = [];
  try {
    if (progress.answers) {
      const parsed = JSON.parse(progress.answers);
      answers = parsed.answers ?? parsed;
    }
  } catch { /* invalid json */ }

  if (answers.length === 0) return (
    <p className="text-xs text-slate-400 py-2">Không có dữ liệu câu trả lời.</p>
  );

  const clipMap = Object.fromEntries(clips.map(c => [c.id, c]));
  const correctCount = answers.filter(a => a.userAnswer && a.userAnswer === a.correctAnswer).length;
  const skippedCount = answers.filter(a => !a.userAnswer).length;

  return (
    <div>
      {/* Header summary */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          {correctCount} đúng
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          {answers.length - correctCount - skippedCount} sai
        </span>
        {skippedCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
            {skippedCount} bỏ qua
          </span>
        )}
      </div>

      {/* Clip list */}
      <div className="space-y-2">
        {answers.map((a, i) => {
          const clip = clipMap[a.audioClipId];
          const isCorrect = a.userAnswer && a.userAnswer === a.correctAnswer;
          const isSkipped = !a.userAnswer;
          const isExpanded = expandedClip === i;

          const rowBorder = isCorrect
            ? 'border-emerald-200 dark:border-emerald-800/50'
            : isSkipped
            ? 'border-slate-200 dark:border-slate-700'
            : 'border-red-200 dark:border-red-800/50';

          const rowBg = isCorrect
            ? 'bg-emerald-50/50 dark:bg-emerald-900/5'
            : isSkipped
            ? 'bg-slate-50 dark:bg-slate-800/30'
            : 'bg-red-50/50 dark:bg-red-900/5';

          return (
            <div key={i} className={`rounded-xl border overflow-hidden ${rowBorder}`}>
              {/* Row header — always visible */}
              <button
                onClick={() => setExpandedClip(isExpanded ? null : i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:brightness-95 ${rowBg}`}
              >
                {/* Icon */}
                <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                  isCorrect ? 'bg-emerald-500' : isSkipped ? 'bg-slate-400' : 'bg-red-500'
                }`}>
                  <span className="material-symbols-outlined text-white text-sm">
                    {isCorrect ? 'check' : isSkipped ? 'timer_off' : 'close'}
                  </span>
                </div>

                {/* Clip name */}
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex-1 min-w-0 truncate">
                  Clip #{i + 1}{clip ? ` — ${clip.subject}` : ''}
                </span>

                {/* Badge */}
                <ResultBadge userAnswer={a.userAnswer ?? null} correctAnswer={a.correctAnswer} />

                {/* Expand chevron */}
                <span className={`material-symbols-outlined text-slate-400 text-base transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className={`px-4 pb-4 pt-2 border-t ${rowBorder} ${rowBg}`}>
                  {isSkipped ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 py-1">
                      <span className="material-symbols-outlined text-slate-400">timer_off</span>
                      Hết thời gian, không trả lời
                    </div>
                  ) : isCorrect ? (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Đáp án của học viên</p>
                      <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800/50">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                          {EMOTION_VI[a.userAnswer!] ?? a.userAnswer}
                        </p>
                        <AnswerBar pct={100} color="bg-emerald-500" />
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">100%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">Đáp án của học viên</p>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-red-200 dark:border-red-800/50 h-full">
                          <p className="text-sm font-bold text-red-600 dark:text-red-400">
                            {EMOTION_VI[a.userAnswer!] ?? a.userAnswer}
                          </p>
                          <AnswerBar pct={20} color="bg-red-400" />
                          <p className="text-xs text-red-500 mt-1">Không đúng</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">Đáp án đúng</p>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800/50 h-full">
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            {EMOTION_VI[a.correctAnswer] ?? a.correctAnswer}
                          </p>
                          <AnswerBar pct={100} color="bg-emerald-500" />
                          <p className="text-xs text-emerald-600 mt-1">100%</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {clip && (
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">graphic_eq</span>
                      Cảm xúc mục tiêu: <span className="font-medium">{EMOTION_VI[clip.targetEmotion] ?? clip.targetEmotion}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminProgress() {
  const [progresses, setProgresses] = useState<ProgressResponse[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [search, setSearch] = useState('');

  // Per-row expand + clip fetch
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clipMap, setClipMap] = useState<Record<string, AudioClip[]>>({});
  const [clipsLoading, setClipsLoading] = useState(false);

  useEffect(() => {
    api.get<UserOption[]>('/api/admin/users').then(data => setUsers(data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedUserId ? `/api/admin/progress?userId=${selectedUserId}` : '/api/admin/progress';
    api.get<ProgressResponse[]>(url)
      .then(data => setProgresses(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedUserId]);

  const toggleRow = async (p: ProgressResponse) => {
    if (expandedId === p.id) { setExpandedId(null); return; }
    setExpandedId(p.id);
    if (!clipMap[p.lessonId]) {
      setClipsLoading(true);
      try {
        const clips = await api.get<AudioClip[]>(`/api/admin/lessons/${p.lessonId}/audio-clips`);
        setClipMap(prev => ({ ...prev, [p.lessonId]: clips ?? [] }));
      } catch { /* ignore */ }
      finally { setClipsLoading(false); }
    }
  };

  const filtered = progresses.filter(p =>
    p.lessonTitle?.toLowerCase().includes(search.toLowerCase()) ||
    p.userName?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, p) => s + (p.score ?? 0), 0) / filtered.length)
    : 0;
  const highScoreCount = filtered.filter(p => (p.score ?? 0) >= 80).length;

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Tiến độ học tập</h1>
      </AppPageHeader>

      <div className="app-content space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: 'assignment_turned_in', color: 'text-primary', label: 'Tổng lần làm bài', value: filtered.length },
            { icon: 'star', color: 'text-amber-500', label: 'Điểm trung bình', value: `${avgScore}%` },
            { icon: 'emoji_events', color: 'text-emerald-500', label: 'Điểm cao (≥80%)', value: highScoreCount },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-lg ${s.color}`}>{s.icon}</span>
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm học viên, bài học..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary w-64"
            />
          </div>
          <select
            value={selectedUserId}
            onChange={e => { setSelectedUserId(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Tất cả học viên</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Học viên</th>
                  <th className="px-6 py-4">Bài học</th>
                  <th className="px-6 py-4">Lần</th>
                  <th className="px-6 py-4">Điểm</th>
                  <th className="px-6 py-4">Hoàn thành</th>
                  <th className="px-6 py-4 w-10" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4].map(i => (
                    <tr key={i}><td colSpan={6} className="px-6 py-4">
                      <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    </td></tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">assignment</span>
                    Chưa có dữ liệu tiến độ.
                  </td></tr>
                ) : paginated.map(p => (
                  <React.Fragment key={p.id}>
                    <tr
                      onClick={() => toggleRow(p)}
                      className={`cursor-pointer border-b border-slate-100 dark:border-slate-800 transition-colors ${
                        expandedId === p.id
                          ? 'bg-slate-50 dark:bg-slate-800/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            {p.userName ?? p.userId.slice(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-400 text-base">menu_book</span>
                          <span className="text-slate-700 dark:text-slate-300">{p.lessonTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">#{p.attemptNumber ?? 1}</td>
                      <td className="px-6 py-4"><ScoreBadge score={p.score ?? 0} /></td>
                      <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                        {p.completedAt
                          ? new Date(p.completedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${expandedId === p.id ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </td>
                    </tr>

                    {expandedId === p.id && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                          <div className="px-6 py-5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                              Chi tiết câu trả lời — {p.lessonTitle} · Lần #{p.attemptNumber ?? 1}
                            </p>
                            <ProgressDetail
                              progress={p}
                              clips={clipMap[p.lessonId] ?? []}
                              clipsLoading={clipsLoading && !clipMap[p.lessonId]}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </div>
    </>
  );
}

AdminProgress.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

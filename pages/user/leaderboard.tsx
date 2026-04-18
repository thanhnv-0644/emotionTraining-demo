import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  xp: number;
  totalLessonsCompleted: number;
  avgScore: number;
}

const RANK_MEDAL: Record<number, { icon: string; color: string; bg: string }> = {
  1: { icon: 'emoji_events', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
  2: { icon: 'emoji_events', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  3: { icon: 'emoji_events', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<LeaderboardEntry[]>('/api/leaderboard?limit=20'),
      api.get<number>('/api/leaderboard/me'),
    ]).then(([list, rank]) => {
      const safeList = list ?? [];
      setEntries(safeList);
      setMyRank(typeof rank === 'number' && rank > 0 ? rank : null);
      const found = safeList.find(e => e.userId === user?.id) ?? null;
      setMyEntry(found);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
          Bảng xếp hạng
        </h1>
      </AppPageHeader>

      <div className="app-content">

        {/* My rank banner */}
        {!loading && myRank !== null && (
          <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-black">{user?.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="text-white/70 text-sm">Thứ hạng của bạn</p>
                  <p className="text-3xl font-black">#{myRank}</p>
                  <p className="text-white/80 text-sm font-medium">{user?.name}</p>
                </div>
              </div>
              {myEntry && (
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-white/60 text-xs">XP</p>
                    <p className="text-lg font-black text-amber-300">{myEntry.xp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Bài học</p>
                    <p className="text-lg font-black">{myEntry.totalLessonsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Điểm TB</p>
                    <p className="text-lg font-black">{myEntry.avgScore > 0 ? `${myEntry.avgScore}%` : '—'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">leaderboard</span>
            <p className="text-slate-500">Chưa có dữ liệu xếp hạng.</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-3">
              {/* Reorder: 2nd, 1st, 3rd */}
              {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                if (!entry) return <div key={podiumIdx} />;
                const isFirst = podiumIdx === 1;
                const medal = RANK_MEDAL[entry.rank];
                const isMe = entry.userId === user?.id;
                return (
                  <div
                    key={entry.userId}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 border transition-all ${
                      isFirst
                        ? 'bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-500/10 dark:to-slate-900 border-yellow-200 dark:border-yellow-500/30 shadow-lg'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    } ${isMe ? 'ring-2 ring-primary' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className={`rounded-full flex items-center justify-center font-black text-white text-xl overflow-hidden bg-gradient-to-br from-primary to-indigo-500 ${isFirst ? 'w-16 h-16' : 'w-12 h-12'}`}>
                        {entry.avatar ? (
                          <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                        ) : (
                          entry.name[0]?.toUpperCase()
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${medal?.bg}`}>
                        <span className={`material-symbols-outlined text-[14px] ${medal?.color}`}>{medal?.icon}</span>
                      </div>
                    </div>

                    <p className={`font-bold text-center truncate w-full text-slate-800 dark:text-slate-100 ${isFirst ? 'text-sm' : 'text-xs'}`}>
                      {entry.name}
                      {isMe && <span className="ml-1 text-primary text-[10px]">(bạn)</span>}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span className={`font-black ${isFirst ? 'text-base' : 'text-sm'}`}>{entry.xp.toLocaleString()}</span>
                    </div>
                    <div className={`w-full flex justify-center items-end rounded-lg py-2 mt-1 ${
                      isFirst ? 'h-16 bg-yellow-100 dark:bg-yellow-500/10' : podiumIdx === 0 ? 'h-10 bg-slate-100 dark:bg-slate-800' : 'h-8 bg-amber-50 dark:bg-amber-500/10'
                    }`}>
                      <span className={`text-xs font-black ${medal?.color}`}>#{entry.rank}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ranks 4+ */}
            {rest.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[40px_1fr_80px_80px_80px] text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3 border-b border-slate-100 dark:border-slate-800">
                  <span>#</span>
                  <span>Người dùng</span>
                  <span className="text-right">XP</span>
                  <span className="text-right">Bài học</span>
                  <span className="text-right">TB%</span>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {rest.map(entry => {
                    const isMe = entry.userId === user?.id;
                    return (
                      <div
                        key={entry.userId}
                        className={`grid grid-cols-[40px_1fr_80px_80px_80px] items-center px-5 py-3.5 transition-colors ${
                          isMe
                            ? 'bg-primary/5 dark:bg-primary/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-400">#{entry.rank}</span>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-indigo-500/60 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                            {entry.avatar ? (
                              <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                            ) : (
                              entry.name[0]?.toUpperCase()
                            )}
                          </div>
                          <span className={`text-sm font-semibold truncate ${isMe ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                            {entry.name}
                            {isMe && <span className="ml-1 text-[10px] text-primary font-bold">(bạn)</span>}
                          </span>
                        </div>
                        <span className="text-right text-sm font-bold text-amber-500">{entry.xp.toLocaleString()}</span>
                        <span className="text-right text-sm text-slate-500">{entry.totalLessonsCompleted}</span>
                        <span className={`text-right text-sm font-bold ${
                          entry.avgScore >= 80 ? 'text-green-600' : entry.avgScore >= 60 ? 'text-yellow-600' : 'text-red-500'
                        }`}>
                          {entry.avgScore > 0 ? `${entry.avgScore}%` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

Leaderboard.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

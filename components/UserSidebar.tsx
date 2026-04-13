'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function UserSidebar() {
  const { pathname } = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Tổng quan', icon: 'home', href: '/user/dashboard' },
    { name: 'Khoá học', icon: 'book_5', href: '/user/courses' },
    { name: 'Phân tích', icon: 'monitoring', href: '/user/analytics' },
    { name: 'Xếp hạng', icon: 'leaderboard', href: '/user/leaderboard' },
    { name: 'Thành tích', icon: 'emoji_events', href: '/user/achievements' },
    { name: 'Hồ sơ', icon: 'person', href: '/user/profile' },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/85 shadow-[4px_0_32px_-16px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-[4px_0_32px_-16px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3 p-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-primary/25">
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Emotion Training</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Học và luyện tập</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? 'bg-primary/12 font-semibold text-primary shadow-sm ring-1 ring-primary/15'
                  : 'font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-icon' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200/80 p-4 dark:border-slate-800/80">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/90 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img alt="Profile" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              <span className="material-symbols-outlined text-slate-500">person</span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name ?? '...'}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role ?? ''}</p>
          </div>
          <button onClick={logout} title="Đăng xuất" className="text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

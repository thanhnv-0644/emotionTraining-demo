'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: 'home', href: '/dashboard' },
    { name: 'Khoá học', icon: 'book_5', href: '/courses' },
    { name: 'Wishlist', icon: 'favorite', href: '/wishlist' },
    { name: 'Thanh toán', icon: 'receipt_long', href: '/payments' },
    { name: 'Analytics', icon: 'monitoring', href: '/analytics' },
    { name: 'Thành tích', icon: 'emoji_events', href: '/achievements' },
    { name: 'Hồ sơ', icon: 'person', href: '/profile' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">Emotion Training</h1>
          <p className="text-xs text-slate-500">Evaluation System</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
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

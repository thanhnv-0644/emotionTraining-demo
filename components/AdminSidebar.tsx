'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
  const { pathname } = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Tổng quan', icon: 'dashboard', href: '/admin' },
    { name: 'Khoá học', icon: 'school', href: '/admin/courses' },
    { name: 'Người dùng', icon: 'group', href: '/admin/users' },
    { name: 'Ghi danh', icon: 'how_to_reg', href: '/admin/enrollments' },
    { name: 'Thanh toán', icon: 'payments', href: '/admin/payments' },
    { name: 'Tiến độ', icon: 'assignment_turned_in', href: '/admin/progress' },
    { name: 'Đánh giá', icon: 'rate_review', href: '/admin/reviews' },
    { name: 'Phân tích', icon: 'analytics', href: '/admin/analytics' },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/85 shadow-[4px_0_32px_-16px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-[4px_0_32px_-16px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3 p-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-primary/25">
          <span className="material-symbols-outlined">psychology_alt</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold leading-none tracking-tight text-slate-900 dark:text-white">Emotion AI</h1>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">Quản trị</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? 'bg-primary/12 font-semibold text-primary shadow-sm ring-1 ring-primary/15'
                  : 'font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-current' : 'transition-colors group-hover:text-primary'}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
        <div className="my-3 border-t border-slate-100 dark:border-slate-800/80" />
        <Link href="/admin/settings" className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
          pathname === '/admin/settings' ? 'bg-primary/12 font-semibold text-primary shadow-sm ring-1 ring-primary/15' : 'font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80'
        }`}>
          <span className={`material-symbols-outlined text-[22px] ${pathname === '/admin/settings' ? 'fill-current' : 'transition-colors group-hover:text-primary'}`}>settings</span>
          <span>Cài đặt</span>
        </Link>
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img className="w-full h-full object-cover" src={user.avatar} alt="Admin" />
              ) : (
                <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <span className="text-xs font-bold truncate block">{user?.name ?? '...'}</span>
              <span className="text-[10px] text-slate-500">Quản trị viên</span>
            </div>
            <button onClick={logout} title="Đăng xuất" className="text-slate-400 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

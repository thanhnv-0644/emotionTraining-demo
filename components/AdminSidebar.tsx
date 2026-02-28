'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { name: 'Manage Courses', icon: 'school', href: '/admin/courses' },
    { name: 'User Management', icon: 'group', href: '/admin/users' },
    { name: 'Analytics', icon: 'analytics', href: '/admin/analytics' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">psychology_alt</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-tight uppercase text-slate-900 dark:text-white leading-none">Emotion AI</h1>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Admin System</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-current' : 'group-hover:text-primary transition-colors'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
        <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
          <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">settings</span>
          <span className="text-sm font-medium">System Settings</span>
        </Link>
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvpPvG3CR4cqnxOn9gGEjpIZ_-qsGvTMDY4s5befRK81PA2lZITvJtjk_W6JuvyXnx-9WhBqpKBnMcmhxjiWEgnVH2LXeQSB3oGGpYRNVa-d4pieEHo5bMmI5FH-EY58jtbhlmA_a_P48Zj3rOqp-1yLn5fag96KLeByzMo6BHhcPJi2DB3Ijq7p42s7qYyDrCLp3nMFGQaiBYjk1BA5s4ArEAiwda9JGlSWJyk36GKFvy3vyQiYIPYU6RN-xvebJt7tjnYnzhdqWD" alt="Admin" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">Alex Rivera</span>
              <span className="text-[10px] text-slate-500">Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

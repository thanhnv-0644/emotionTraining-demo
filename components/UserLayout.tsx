import { ReactNode } from 'react';
import UserSidebar from './UserSidebar';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-slate-100 text-slate-900 dark:bg-[#0a0e16] dark:text-slate-100 [background-image:radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(43,108,238,0.14),transparent_55%)] dark:[background-image:radial-gradient(ellipse_100%_70%_at_50%_-25%,rgba(59,130,246,0.18),transparent_50%)]">
      <UserSidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

import { ReactNode } from 'react';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';

export default function Achievements() {
  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Thành tích</h1>
      </AppPageHeader>

      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-8">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-slate-400">emoji_events</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Sắp ra mắt</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Hệ thống huy hiệu và thành tích đang được phát triển. Hãy tiếp tục học và hoàn thành các bài học để nhận phần thưởng sớm nhất!
          </p>
        </div>
      </div>
    </>
  );
}

Achievements.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

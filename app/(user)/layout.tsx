import UserSidebar from '@/components/UserSidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        {children}
      </main>
    </div>
  );
}

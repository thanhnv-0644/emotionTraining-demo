import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold">System Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Total Active Users</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">12,450</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+8.4% this month</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Total Courses</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">48</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+2 new this week</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Avg Completion Rate</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">64%</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+1.2% from last month</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">System Health</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">99.9%</h3>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>All services operational</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">User Growth</h3>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg focus:ring-primary focus:border-primary block p-2">
                <option>Last 6 months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 pb-6 relative">
              <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between text-xs text-slate-400 pointer-events-none">
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-8">15k</span></div>
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-8">10k</span></div>
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-8">5k</span></div>
                <div className="w-full flex-1 flex items-start"><span className="-mt-2 -ml-8">0</span></div>
              </div>
              {[40, 55, 60, 75, 85, 95].map((val, i) => (
                <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm relative group transition-colors" style={{ height: `${val}%` }}>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Link href="#" className="text-primary text-sm font-semibold hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {[
                { action: 'New course published', target: 'Advanced Micro-expressions', time: '10 mins ago', icon: 'school', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { action: 'System update', target: 'AI Model v4.2 deployed', time: '2 hours ago', icon: 'update', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                { action: 'User milestone', target: '10,000th certification issued', time: '5 hours ago', icon: 'workspace_premium', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { action: 'New user registration spike', target: '+500 users in 24h', time: '1 day ago', icon: 'trending_up', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { action: 'Content flagged', target: 'Audio sync issue in Module 2', time: '2 days ago', icon: 'flag', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.bg} ${activity.color}`}>
                    <span className="material-symbols-outlined">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{activity.action}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.target}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

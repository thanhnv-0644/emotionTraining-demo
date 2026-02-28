import Link from 'next/link';

export default function Analytics() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold">Performance Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <button className="p-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="text-sm font-bold hidden sm:block">Export Report</span>
          </button>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Total Training Time</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">42h 15m</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>12% from last month</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Average Accuracy</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">87.5%</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>4.2% from last month</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Avg Response Time</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">1.2s</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              <span>0.3s from last month</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10"></div>
            <p className="text-slate-500 text-sm font-medium">Modules Completed</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">24</h3>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mt-2">
              <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
              <span>Top 15% of users</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Accuracy Trend</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 pb-6 relative">
              <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between text-xs text-slate-400 pointer-events-none">
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-6">100%</span></div>
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-6">75%</span></div>
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-6">50%</span></div>
                <div className="border-b border-slate-100 dark:border-slate-800 w-full flex-1 flex items-start"><span className="-mt-2 -ml-6">25%</span></div>
                <div className="w-full flex-1 flex items-start"><span className="-mt-2 -ml-6">0%</span></div>
              </div>
              {[65, 70, 68, 75, 82, 80, 85, 88, 86, 90, 92, 87].map((val, i) => (
                <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm relative group transition-colors" style={{ height: `${val}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {val}%
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Emotion Proficiency</h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="space-y-5">
              {[
                { name: 'Happiness', value: 95, color: 'bg-yellow-400' },
                { name: 'Sadness', value: 88, color: 'bg-blue-400' },
                { name: 'Anger', value: 82, color: 'bg-red-400' },
                { name: 'Surprise', value: 76, color: 'bg-purple-400' },
                { name: 'Fear', value: 65, color: 'bg-indigo-400' },
                { name: 'Disgust', value: 58, color: 'bg-green-400' },
              ].map((emotion, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{emotion.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{emotion.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                    <div className={`${emotion.color} h-2.5 rounded-full`} style={{ width: `${emotion.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold">Detailed Assessment History</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input type="text" placeholder="Search assessments..." className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Assessment Name</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Time Taken</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { name: 'Micro-expression Final Exam', date: 'Oct 24, 2023', score: 92, time: '45m 12s', status: 'Passed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                  { name: 'Deception Detection Quiz 3', date: 'Oct 18, 2023', score: 78, time: '12m 05s', status: 'Passed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                  { name: 'Cultural Variations Midterm', date: 'Oct 10, 2023', score: 65, time: '38m 45s', status: 'Needs Review', statusColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
                  { name: 'Basic Emotions Baseline', date: 'Sep 05, 2023', score: 88, time: '22m 30s', status: 'Passed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                  { name: 'Initial Diagnostic Test', date: 'Aug 12, 2023', score: 42, time: '15m 20s', status: 'Failed', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4 font-bold">{item.score}%</td>
                    <td className="px-6 py-4">{item.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-semibold text-sm">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <span className="text-sm text-slate-500">Showing 1 to 5 of 24 entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-400 cursor-not-allowed">Prev</button>
              <button className="px-3 py-1 border border-primary bg-primary text-white rounded font-medium">1</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">2</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">3</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" placeholder="Search training modules..." className="w-full pl-10 pr-4 py-2 rounded-lg border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>
      <div className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Welcome back, Alex!</h2>
            <p className="text-slate-500">Track your emotional intelligence progress and training stats.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">stars</span>
              <span className="text-sm font-bold text-primary">Level 12 (Advanced)</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined">target</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +4.2%
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Overall Accuracy</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">87.5%</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                -0.3s
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Avg. Response Time</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">1.2s</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                <span className="material-symbols-outlined">local_fire_department</span>
              </div>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                Personal Best
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Current Streak</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">14 Days</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Continue Learning</h3>
              <Link href="/courses" className="text-primary text-sm font-semibold hover:underline">View all courses</Link>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 sm:h-auto relative bg-slate-100 dark:bg-slate-800">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98')" }}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">Module 4</div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] font-bold uppercase rounded">Micro-expressions</span>
                      <span className="text-slate-400 text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 15 mins left</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Detecting Deception via Facial Cues</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">Learn to identify the subtle, involuntary facial movements that occur when individuals attempt to conceal their true emotions.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
                        <span className="font-bold text-primary">65%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <Link href="/practice" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors whitespace-nowrap">
                      Resume
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Recent Practice Sessions</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Basic Emotions Recognition', date: 'Today, 10:30 AM', score: 92, time: '2.4s', icon: 'sentiment_satisfied' },
                  { name: 'Subtle Expressions Quiz', date: 'Yesterday, 2:15 PM', score: 78, time: '3.1s', icon: 'visibility' },
                  { name: 'Audio-Visual Integration', date: 'Oct 24, 2023', score: 85, time: '1.8s', icon: 'hearing' },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined">{session.icon}</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm">{session.name}</h5>
                        <p className="text-xs text-slate-500">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-500">Avg Time</p>
                        <p className="font-semibold text-sm">{session.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Score</p>
                        <p className={`font-bold text-sm ${session.score >= 90 ? 'text-emerald-600' : session.score >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>{session.score}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Emotion Mastery</h3>
              <div className="space-y-4">
                {[
                  { name: 'Happiness', value: 95, color: 'bg-yellow-400' },
                  { name: 'Sadness', value: 88, color: 'bg-blue-400' },
                  { name: 'Anger', value: 82, color: 'bg-red-400' },
                  { name: 'Surprise', value: 76, color: 'bg-purple-400' },
                  { name: 'Fear', value: 65, color: 'bg-indigo-400' },
                  { name: 'Disgust', value: 58, color: 'bg-green-400' },
                ].map((emotion, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{emotion.name}</span>
                      <span className="font-bold">{emotion.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className={`${emotion.color} h-1.5 rounded-full`} style={{ width: `${emotion.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                View Detailed Analysis
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Certification Exam</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">You are eligible to take the Level 1 Micro-expression Certification Exam.</p>
                <button className="w-full bg-white text-primary py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-slate-50 transition-colors">
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

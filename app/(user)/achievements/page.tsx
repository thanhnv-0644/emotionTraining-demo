import Link from 'next/link';

export default function Achievements() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold">Achievements & Certifications</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">toll</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">1,250 Points</span>
          </div>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 p-1 shadow-2xl shadow-amber-500/30 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                <span className="material-symbols-outlined text-7xl text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">military_tech</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm">star</span>
                Current Rank
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Master Analyst</h2>
              <p className="text-slate-300 text-lg max-w-xl mb-6 leading-relaxed">You are in the top 5% of all users. Complete 3 more advanced modules to reach Grandmaster rank.</p>
              
              <div className="w-full max-w-md bg-white/5 rounded-full h-3 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full relative" style={{ width: '85%' }}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                </div>
              </div>
              <div className="flex justify-between max-w-md mt-2 text-xs font-medium text-slate-400">
                <span>Master (Level 12)</span>
                <span>8,500 / 10,000 XP</span>
                <span>Grandmaster (Level 13)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Badges Earned</h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">14 / 42 Unlocked</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'First Steps', icon: 'directions_walk', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', date: 'Jan 15, 2023', unlocked: true },
              { name: 'Sharp Eye', icon: 'visibility', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', date: 'Feb 28, 2023', unlocked: true },
              { name: 'Speed Demon', icon: 'bolt', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', date: 'Apr 10, 2023', unlocked: true },
              { name: 'Perfect Score', icon: 'verified', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', date: 'Jun 05, 2023', unlocked: true },
              { name: '7-Day Streak', icon: 'local_fire_department', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', date: 'Aug 22, 2023', unlocked: true },
              { name: 'Empathy Master', icon: 'favorite', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', date: 'Oct 12, 2023', unlocked: true },
              { name: 'Lie Detector', icon: 'policy', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', date: 'Locked', unlocked: false },
              { name: '30-Day Streak', icon: 'calendar_month', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', date: 'Locked', unlocked: false },
              { name: 'Audio Expert', icon: 'graphic_eq', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', date: 'Locked', unlocked: false },
              { name: 'Global Mind', icon: 'public', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', date: 'Locked', unlocked: false },
              { name: 'Micro-Master', icon: 'zoom_in', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', date: 'Locked', unlocked: false },
              { name: 'Top 1%', icon: 'workspace_premium', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', date: 'Locked', unlocked: false },
            ].map((badge, i) => (
              <div key={i} className={`flex flex-col items-center text-center p-4 rounded-2xl border ${badge.border} ${badge.unlocked ? 'bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer' : 'bg-slate-50 dark:bg-slate-800/50 opacity-70 grayscale'}`}>
                <div className={`w-16 h-16 rounded-full ${badge.bg} flex items-center justify-center mb-3 ${badge.unlocked ? 'shadow-inner' : ''}`}>
                  <span className={`material-symbols-outlined text-3xl ${badge.color}`}>{badge.icon}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-tight">{badge.name}</h4>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{badge.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Official Certifications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:border-primary/50 transition-colors">
              <div className="w-full sm:w-40 bg-slate-100 dark:bg-slate-800 p-6 flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <span className="material-symbols-outlined text-5xl text-emerald-500 mb-2 drop-shadow-sm">verified</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Level 1</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Basic Emotion Recognition</h4>
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Certified proficiency in identifying the 7 universal facial expressions of emotion across diverse demographics.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    <span className="block font-medium">Issued: Sep 15, 2023</span>
                    <span className="block">ID: CERT-8492-A1</span>
                  </div>
                  <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">download</span> PDF
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:border-primary/50 transition-colors">
              <div className="w-full sm:w-40 bg-slate-100 dark:bg-slate-800 p-6 flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <span className="material-symbols-outlined text-5xl text-blue-500 mb-2 drop-shadow-sm">verified</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Level 2</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Micro-expression Analysis</h4>
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Certified ability to detect and interpret brief, involuntary facial expressions lasting less than 1/2 second.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    <span className="block font-medium">Issued: Nov 02, 2023</span>
                    <span className="block">ID: CERT-9104-M2</span>
                  </div>
                  <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">download</span> PDF
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-400">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Level 3: Deception Detection</h4>
              <p className="text-sm text-slate-500 max-w-sm mb-6">Complete Module 4 and pass the final assessment with &gt;90% accuracy to unlock this certification.</p>
              <Link href="/courses" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                View Requirements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

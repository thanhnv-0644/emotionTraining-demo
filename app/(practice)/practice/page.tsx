import Link from 'next/link';

export default function Practice() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <h1 className="text-sm font-bold">Detecting Deception via Facial Cues</h1>
            <p className="text-xs text-slate-500">Module 4 • Lesson 3 of 8</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Progress</span>
            <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '37.5%' }}></div>
            </div>
            <span className="text-xs font-bold text-primary">37%</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Help">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col relative bg-black">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Recording
            </div>
            <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              Eye Tracking Active
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98" alt="Subject Video" className="w-full h-full object-cover opacity-80" />
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[30%] left-[45%] w-16 h-16 border-2 border-primary/50 rounded-full animate-ping opacity-20"></div>
              <div className="absolute top-[32%] left-[47%] w-8 h-8 border-2 border-primary rounded-full"></div>
              <div className="absolute top-[32%] left-[47%] w-24 h-px bg-primary transform -rotate-45 origin-left"></div>
              <div className="absolute top-[20%] left-[55%] bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] border border-primary/30 font-mono">
                AU12: Zygomatic Major
              </div>
            </div>
          </div>
          
          <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">play_arrow</span>
              </button>
              <div className="text-white font-mono text-sm">00:14 / 01:30</div>
            </div>
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer">
                <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '15%' }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[15%] w-4 h-4 bg-white rounded-full shadow-md"></div>
                
                <div className="absolute top-0 left-[25%] w-1 h-full bg-red-500"></div>
                <div className="absolute top-0 left-[45%] w-1 h-full bg-yellow-500"></div>
                <div className="absolute top-0 left-[75%] w-1 h-full bg-blue-500"></div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">volume_up</span></button>
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">closed_caption</span></button>
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">fullscreen</span></button>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold mb-2">Analysis Task</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Identify the micro-expression that occurs at timestamp 00:14 when the subject discusses the project timeline.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Primary Emotion</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Happiness', 'Sadness', 'Fear', 'Disgust', 'Anger', 'Surprise'].map((emotion, i) => (
                  <button key={i} className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    i === 2 
                      ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}>
                    {emotion}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Action Units (AUs)</h3>
              <div className="space-y-3">
                {[
                  { id: 'AU1', name: 'Inner Brow Raiser', selected: true },
                  { id: 'AU2', name: 'Outer Brow Raiser', selected: true },
                  { id: 'AU4', name: 'Brow Lowerer', selected: false },
                  { id: 'AU5', name: 'Upper Lid Raiser', selected: true },
                  { id: 'AU20', name: 'Lip Stretcher', selected: false },
                ].map((au, i) => (
                  <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    au.selected 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}>
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" checked={au.selected} readOnly />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-500 mr-2">{au.id}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{au.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Confidence Level</h3>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="100" defaultValue="85" className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" />
                <span className="text-sm font-bold text-primary w-10 text-right">85%</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]">
              Submit Analysis
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

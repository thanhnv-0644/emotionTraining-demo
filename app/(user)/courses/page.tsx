import Link from 'next/link';

export default function Courses() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold">My Courses</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" placeholder="Search courses..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary text-sm" />
          </div>
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button className="px-4 py-3 text-sm font-bold text-primary border-b-2 border-primary">In Progress (3)</button>
          <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">Completed (12)</button>
          <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">Saved (5)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              title: 'Foundations of Emotion Recognition',
              module: 'Module 1',
              progress: 100,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Basics',
              lessons: 12,
              duration: '2h 30m',
              completed: true
            },
            {
              title: 'Detecting Deception via Facial Cues',
              module: 'Module 4',
              progress: 65,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Micro-expressions',
              lessons: 8,
              duration: '1h 45m',
              completed: false
            },
            {
              title: 'Cross-Cultural Emotion Variations',
              module: 'Module 5',
              progress: 20,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Advanced',
              lessons: 15,
              duration: '4h 15m',
              completed: false
            },
            {
              title: 'Vocal Nuances and Tone Analysis',
              module: 'Module 6',
              progress: 0,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Audio',
              lessons: 10,
              duration: '2h 00m',
              completed: false
            }
          ].map((course, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-48 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${course.image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                  {course.module}
                </div>
                {course.completed && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Completed
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase rounded tracking-wider">{course.category}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 mt-auto">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">menu_book</span> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {course.duration}</span>
                </div>
                
                {course.progress > 0 && !course.completed && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
                      <span className="font-bold text-primary">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                )}
                
                <Link href="/practice" className={`w-full py-2.5 rounded-lg text-sm font-bold text-center transition-colors ${
                  course.completed 
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' 
                    : course.progress > 0 
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}>
                  {course.completed ? 'Review Material' : course.progress > 0 ? 'Resume Course' : 'Start Course'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

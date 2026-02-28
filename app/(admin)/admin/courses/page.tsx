import Link from 'next/link';

export default function AdminCourses() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold">Course Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm font-bold hidden sm:block">Create Course</span>
          </button>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 w-full sm:w-auto">
            <button className="px-4 py-3 text-sm font-bold text-primary border-b-2 border-primary">Published (42)</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">Drafts (6)</button>
            <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">Archived (12)</button>
          </div>
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input type="text" placeholder="Search courses..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              title: 'Foundations of Emotion Recognition',
              module: 'Module 1',
              students: 12450,
              rating: 4.8,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Basics',
              lessons: 12,
              status: 'Published'
            },
            {
              title: 'Detecting Deception via Facial Cues',
              module: 'Module 4',
              students: 8230,
              rating: 4.9,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Micro-expressions',
              lessons: 8,
              status: 'Published'
            },
            {
              title: 'Cross-Cultural Emotion Variations',
              module: 'Module 5',
              students: 5120,
              rating: 4.7,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Advanced',
              lessons: 15,
              status: 'Published'
            },
            {
              title: 'Vocal Nuances and Tone Analysis',
              module: 'Module 6',
              students: 0,
              rating: 0,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98',
              category: 'Audio',
              lessons: 10,
              status: 'Draft'
            }
          ].map((course, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-40 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${course.image}')` }}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                  {course.module}
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${
                    course.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase rounded tracking-wider">{course.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{course.rating > 0 ? course.rating : 'N/A'}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-4 line-clamp-2">{course.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 mt-auto">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">menu_book</span> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> {course.students.toLocaleString()} students</span>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Edit
                  </button>
                  <Link href={`/admin/courses/course-${i}/lessons`} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">audio_file</span>
                    Lessons
                  </Link>
                  <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

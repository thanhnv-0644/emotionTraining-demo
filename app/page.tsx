import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-20 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight">ETES</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
          <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="#" className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:flex min-w-[90px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
            Login
          </Link>
          <Link href="/register" className="flex min-w-[90px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Register
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="px-6 md:px-20 py-12 md:py-24">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-8 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Powered by Neural Networks
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-slate-900 dark:text-slate-100 text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                  AI-driven Emotion <span className="text-primary">Recognition</span> Training
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
                  Master the subtle art of human expression with our advanced AI-driven evaluation system. Designed for professionals in psychology, medicine, and research.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-base font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                  Start Learning
                </Link>
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-[600px]">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-200 dark:bg-slate-800 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBli4ztgt2jf1CFIqvVhUS2ApjYj-bvD9jACDHcRxVtWKOrBwdke87hPtqp8nCT2SiwLfUsunyoO8r0Lz3V3skox6aocUUTzAvGjoE0_huIxaWyVSiR89JWQ35ySEuDThXL_3Xy1tDavbXSM8ltSB3GmhSHI3QBoMcBf0aznwePNYo41AG8ApaPR1sGQNoJA33WfGdMKgKqJRzxHbPdt15aKJIIJOHTaQfe1NPDf0bDPxepNIg4shTf-mU9uUC8lsIfvu9K9ZxxKE98')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                    <div className="flex items-center gap-4 text-white">
                      <div className="p-3 rounded-full bg-primary/80 backdrop-blur-sm">
                        <span className="material-symbols-outlined">play_arrow</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Training Module Preview</p>
                        <p className="text-xs text-slate-300 tracking-wide">Micro-expression analysis v4.2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-slate-100 dark:bg-slate-900/50 px-6 md:px-20 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">Methodology</h2>
                <h3 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold leading-tight">Streamlined Emotion Mastery</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">Our system combines cutting-edge computer vision with pedagogical excellence to provide a comprehensive scientific learning experience.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">biotech</span>
                </div>
                <h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-3">Analyze</h4>
                <p className="text-slate-600 dark:text-slate-400">Study high-resolution expressions across diverse demographics using our patented facial landmark mapping system.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">model_training</span>
                </div>
                <h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-3">Practice</h4>
                <p className="text-slate-600 dark:text-slate-400">Engage in real-time training sessions with instant AI feedback on your recognition accuracy and speed.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <h4 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-3">Evaluate</h4>
                <p className="text-slate-600 dark:text-slate-400">Take standardized assessments to measure your proficiency and earn certifications recognized in clinical psychology.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-6 md:px-20 py-20 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold">Core Platform Features</h2>
              <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">face</span>
                </div>
                <h5 className="text-slate-900 dark:text-slate-100 font-bold mb-2">AI Emotion Recognition</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Detect 20+ distinct micro-expressions with our state-of-the-art vision models.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">auto_fix_high</span>
                </div>
                <h5 className="text-slate-900 dark:text-slate-100 font-bold mb-2">Adaptive Learning</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Content adjusts in real-time based on your specific strengths and weaknesses.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">analytics</span>
                </div>
                <h5 className="text-slate-900 dark:text-slate-100 font-bold mb-2">Personal Analytics</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Deep dive into your performance data with detailed visualization reports.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">trending_up</span>
                </div>
                <h5 className="text-slate-900 dark:text-slate-100 font-bold mb-2">Progress Tracking</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Monitor your growth from novice to expert with chronological bench-marking.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-6 md:px-20 py-20">
          <div className="max-w-5xl mx-auto relative overflow-hidden bg-primary rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-primary/40">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-white text-3xl md:text-5xl font-black max-w-2xl leading-tight">Ready to master the language of emotions?</h2>
              <p className="text-white/80 text-lg md:text-xl max-w-xl">Join 5,000+ professionals already using ETES to enhance their diagnostic and interpersonal skills.</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg">Create Free Account</Link>
                <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">Request Institutional License</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 md:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">psychology</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-xl uppercase tracking-tighter">ETES</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Advanced emotional intelligence training powered by cutting-edge AI for the modern practitioner.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <h6 className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase">Platform</h6>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Curriculum</Link>
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Certification</Link>
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h6 className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase">Company</h6>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">About Us</Link>
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Research</Link>
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Contact</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h6 className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase">Legal</h6>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Privacy</Link>
                <Link href="#" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary transition-colors">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center md:text-left">
          <p className="text-slate-400 text-xs">© 2024 Emotion Training & Evaluation System. All rights reserved. Designed for academic and professional use.</p>
        </div>
      </footer>
    </div>
  );
}

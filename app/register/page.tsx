import Link from 'next/link';

export default function Register() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background-light dark:bg-background-dark">
      <div className="relative hidden w-full flex-col justify-between bg-primary p-12 lg:flex lg:w-1/2 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
            <span className="material-symbols-outlined font-bold">psychology</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">ETES</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-6">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Master your emotional intelligence.
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Join a community of professionals using advanced evaluation tools to understand and improve emotional responses.
          </p>
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-3 text-white/90">
              <span className="material-symbols-outlined text-white">check_circle</span>
              <span className="text-sm font-medium">Professional assessment frameworks</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <span className="material-symbols-outlined text-white">check_circle</span>
              <span className="text-sm font-medium">Real-time emotional tracking data</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <span className="material-symbols-outlined text-white">check_circle</span>
              <span className="text-sm font-medium">Customized training modules</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 Emotion Training & Evaluation System. All rights reserved.
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="w-full max-w-[480px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create your account</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Start your journey with our professional dashboard today.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" title="Sign in with Google">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" title="Sign in with Facebook">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" title="Sign in with Apple ID">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform fill-slate-900 dark:fill-slate-100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{transform: 'scale(1.2) translateY(0.5px)'}}><path d="M349.13,136.86c-40.32,0-57.36,19.24-85.44,19.24C234.9,156.1,212.94,137,178,137c-34.2,0-70.67,20.88-93.83,56.45-32.52,50.16-27,144.63,25.67,225.11,18.84,28.81,44,61.12,77,61.47h.6c28.68,0,37.2-18.78,76.67-19h.6c38.88,0,46.68,18.89,75.24,18.89h.6c33-.35,59.51-36.15,78.35-64.85,13.56-20.64,18.6-31,29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48Z"/><path d="M340.25,32c-24,1.63-52,16.91-68.4,36.86-14.88,18.08-27.12,44.9-22.32,70.91h1.92c25.56,0,51.72-15.39,67-35.11C333.17,85.89,344.33,59.29,340.25,32Z"/></svg>
            </button>
          </div>
          <div className="relative mb-8">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background-light dark:bg-background-dark px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full-name">Full Name</label>
              <input id="full-name" name="full-name" type="text" required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all outline-none" placeholder="name@company.com" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all outline-none" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirm-password">Confirm Password</label>
                <input id="confirm-password" name="confirm-password" type="password" required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary/20 transition-all outline-none" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <div className="flex h-5 items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30" />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="font-normal text-slate-600 dark:text-slate-400">
                  I agree to the <Link href="#" className="font-semibold text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
                </label>
              </div>
            </div>
            <Link href="/dashboard" className="w-full flex justify-center rounded-lg bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50">
              Create Account
            </Link>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

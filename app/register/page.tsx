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
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img alt="Google" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWw21YuDrUZ3_eDItc4COCS7nw9U9idQlt-B8n8R838v8T9KVDxI6pL9ZTiBMsGVdjpgZWHOqsW_OeZ6IjQ2zDOVBQInUkh3ZYapBf2SZ-K_JHLe769YvOrpKVBe9YviU3qXtyu1RKJCm9pQXcBhlRAnBu0Ql1pbg9ZQS1XOZGESs4Yhn77OEzVjMg-XT-siF1fCtFQ5X3fpXPq__PXJwM9UW9HEp_kPnKV0YJXbltFQEfwEy1w_O_WFLPylPxbYKLtq58coYcrDgh" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img alt="Microsoft" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAohPIKJCsUshC0iccRyIKxI7RyT0BwLpMvT1FUQekk04E9P8YYaP1hyEROJ3rALU5z8aODIfidTJ5iegCA3gQp_tYbCgwtlKxwDoixYjpuoYbaqvWVFVjwtiV4ftBdvV7VsW6kr3ZE0KoHS7C5icM_rYpoUYrHxjHtRGy8XBfxqIztbQ8A9ugR1VwyWi5wN-Qf_02xL1fozafKvm4GIMA1uCDRYPRouyyprOKPoQVLz-7-aaXM2qAvkrkO-EhaWnQKEQtY32wULsW8" />
            </button>
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img alt="Apple" className="h-5 w-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcQrgWgxE6XAOxeemUCx9wMk6bv-JTZpXpXyT31EfxfIZOMIef6WkUp0OhYbe3aAZKZs5Khj1d3EDt9FPqFI7vq0QAVcCRZYKyqSee5PRneJZK6NUtBYF3KsUupL4REK5Szujeh6jhavkBuhXCPe8ReeD3s_b_JM9UxHBTNeoCI952TOUcwAY_oINCyRfZYhuWfcFKFd8tl-REyNsmeZmlkxmr_wrD0EaLaq53z_MFM2QuXCtJr3Eq05YSHFGthNB3Wj9V30lovw65" />
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

import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary via-indigo-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-3xl">psychology</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Emotion AI</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-white text-5xl font-extrabold leading-tight">
              Master your <span className="text-white/80">emotional</span> landscape.
            </h1>
            <p className="text-indigo-100 text-xl leading-relaxed font-light italic">
              "Emotional intelligence is the ability to sense, understand, and effectively apply the power and acumen of emotions as a source of human energy, information, connection, and influence."
            </p>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md" title="Google">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md" title="Facebook">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md" title="Apple">
                  <svg className="h-6 w-6 fill-slate-900" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{transform: 'scale(1.2) translateY(0.5px)'}}><path d="M349.13,136.86c-40.32,0-57.36,19.24-85.44,19.24C234.9,156.1,212.94,137,178,137c-34.2,0-70.67,20.88-93.83,56.45-32.52,50.16-27,144.63,25.67,225.11,18.84,28.81,44,61.12,77,61.47h.6c28.68,0,37.2-18.78,76.67-19h.6c38.88,0,46.68,18.89,75.24,18.89h.6c33-.35,59.51-36.15,78.35-64.85,13.56-20.64,18.6-31,29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48Z"/><path d="M340.25,32c-24,1.63-52,16.91-68.4,36.86-14.88,18.08-27.12,44.9-22.32,70.91h1.92c25.56,0,51.72-15.39,67-35.11C333.17,85.89,344.33,59.29,340.25,32Z"/></svg>
                </div>
              </div>
              <span className="text-indigo-100 text-sm font-medium">Joined by 10,000+ professionals</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Welcome Back</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Please enter your details to sign in.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" title="Sign in with Google">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" title="Sign in with Facebook">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" title="Sign in with Apple ID">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform fill-slate-900 dark:fill-slate-100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{transform: 'scale(1.2) translateY(0.5px)'}}><path d="M349.13,136.86c-40.32,0-57.36,19.24-85.44,19.24C234.9,156.1,212.94,137,178,137c-34.2,0-70.67,20.88-93.83,56.45-32.52,50.16-27,144.63,25.67,225.11,18.84,28.81,44,61.12,77,61.47h.6c28.68,0,37.2-18.78,76.67-19h.6c38.88,0,46.68,18.89,75.24,18.89h.6c33-.35,59.51-36.15,78.35-64.85,13.56-20.64,18.6-31,29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48Z"/><path d="M340.25,32c-24,1.63-52,16.91-68.4,36.86-14.88,18.08-27.12,44.9-22.32,70.91h1.92c25.56,0,51.72-15.39,67-35.11C333.17,85.89,344.33,59.29,340.25,32Z"/></svg>
            </button>
          </div>
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-light dark:bg-background-dark text-slate-500">Or continue with email</span>
            </div>
          </div>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
              <div className="mt-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input id="email" name="email" type="email" required className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm" placeholder="name@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
              <div className="mt-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input id="password" name="password" type="password" required className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm" placeholder="••••••••" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded transition-all" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Remember me</label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">Forgot password?</a>
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all">Sign In</button>
          </form>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account? <Link href="/register" className="text-primary hover:text-primary/80 font-bold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

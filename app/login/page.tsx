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
              <div className="flex -space-x-2">
                <img alt="User" className="h-10 w-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-0TEJ-hmIA8Dgtn0Wxvav-KNn9dAwEtVsZ_0qSyZp88u0Mg4hDaVHHPUx7eogFHC6xy6T7yVviUtMdlfzfWDoUY7HCXTq6ehU9jjDXHY2OB1Mp0d4FhAhCxxqM2S30XM1_c16Idkmh9zk1vBQWuOsqOLHOUotVxIO3EpUuXQCZIIaMRwKLKj1eyoCZx-rY_37LQyp_dWNL_hZUTMmpgNDk9_mIQzQcElJ7HdkhDSk6x9QiCYQgrlZMNVdgfsr1JBvtUzypH8-YWuQ" />
                <img alt="User" className="h-10 w-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWZwiftgu4AMhbzaLfq4zDAip5gXzPW3qNmE8lWEZBNFHeHJhf5eJdHmOsjI8fwVquHEZxhvGcChIKIetJDH6r3_k1r0ulDfMvglis8QVkCpB_lhPxI2JqSSczOh4QEoPb6puB6f26-TS7aiVkoXWVV5ejvWJSRUc9yePGjKZfAj9cH8qiTu0D41JZefEr20nyCHPTg8w4afgS57EhFq1Xa0mAzpEU2-At_8f1x9C0E090pTq1QEBIz8fPOH1NOt5_NBScrdI66iit" />
                <img alt="User" className="h-10 w-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWdblADvkaffefr_QT-n86mCM8htbLs9w9ujQ1TnBUmsOEj_Jk4kIH-4yqDVST6t6kq-x46uIe3rmlh_tueJkDhWdh48ud5zVdlDibRySMKp-HO0qu41Fsyy_Fa48Ng1qNedSP0U9YrE1dmfuaEqrIzt4LCTtTZElGJZwKkSqn8dRcfmkYjla7dVpKxJiBpamDh_5f3P5d0pg9u_nMSBLV5fHCR0jjYDTFHWOos9Z_JVQIYBt0MIk7kkHzsCOszP1dtIwX5oOwlF8J" />
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
            <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img alt="Google" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7eVYtO9txidGD6JOptJ2uX2YXky0xhppKIHIgzwPTC-0GYDrt5M4JxIJx00ZfhuXvIGE6ydWvaWPwmV2M-uXAQ0KvQz_RTPwtBKlhQdzao4vN58S7lmse9c9OW8REuxztPssWoKmGvHICxOdszmms9ivZyxpVdraqn1NIJepEwchfNqGcWmy2pfc6M0zf7POHZKKGw0MXZecfOIcNU2fXHXEWKcxFJCkLA1vVScwFWNPRIOw7G4FuPZmc1JR1YPj4mjMBZbwXLsij" />
            </button>
            <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img alt="Microsoft" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeP0SAAI6sM4vtIhvBuC77NjCdxa473pWwpuCkm5YKeqtfVAsEcS7enGyE8glqcxypYUJ131jVn--IBsh4kGyDzUODb3e51_iYNfzfLQMUZYsvXLJ0mbNgeWjwGyj1CFerV0xc-a7iURRTCvM80rZJvJ1jvJkzvPeJ_-1L8O50cIVzGkPHDQsfJ2Tvef4H3LApaL5hxbWBKg2y2iOIDEyiijsI1_pWXh6Mg3Hx7sJVcx3Z0i6YQn3IW6UKX2MPEiNdYwwyz_TuVn44" />
            </button>
            <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img alt="Apple" className="h-5 w-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCii6_ByqejvmrSNrayA74Y2nkYI72Ddrnuqza8PPagSNxaN0nRgDufxkOXbofkv73opFHE2nS9YsTCWcGTrYoE0tSTfGeJ98r2wKbcLfVPf8Z4Rg29L-6lPHbNLb_DRLyHwvWpvR6N-puvZGTi_BRud9DOgedNm2WNwfBaKUzynkc-jMRESZUmsd5SynTMxMO2ZXk4iFPbwl36rZyiIrcv4PXPXO-5PHBQf5DsKTXfR2VYfdH3Ep_5vb5qyA31alQLf8mQRpxMwmhj" />
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
              <div className="text-sm">
                <Link href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">Forgot your password?</Link>
              </div>
            </div>
            <div>
              <Link href="/dashboard" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all">
                Sign in to Dashboard
              </Link>
            </div>
          </form>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">Start your 14-day free trial</Link>
          </p>
          <div className="pt-8 flex justify-center space-x-6 text-xs text-slate-400">
            <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

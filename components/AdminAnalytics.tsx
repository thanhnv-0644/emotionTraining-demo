'use client';

export default function AdminAnalytics() {
  return (
    <>
      {/* Main Content Area */}
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-lg font-bold">Global Analytics Overview</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50"
                placeholder="Search data points..."
                type="text"
              />
            </div>
            <button className="size-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold">
              <span className="material-symbols-outlined text-sm">download</span>
              Export Report
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Sessions"
              value="12,840"
              trend="12%"
              trendType="up"
            />
            <KPICard
              title="Avg. Accuracy"
              value="84.2%"
              trend="3.1%"
              trendType="up"
            />
            <KPICard
              title="Mean Reaction Time"
              value="1.24s"
              trend="5.2%"
              trendType="down"
            />
            <KPICard
              title="Active Modules"
              value="24"
              trend="Static"
              trendType="static"
            />
          </div>

          {/* Row 1: Line Chart and Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Global Emotion Accuracy Trends</h4>
                <select className="text-xs border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:ring-2 focus:ring-primary p-1.5">
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                </select>
              </div>
              <div className="h-64 bg-gradient-to-b from-primary/5 to-primary/0 relative rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-end justify-center px-4 pb-4">
                {/* Simulated Line Chart */}
                <svg
                  className="w-full h-full absolute"
                  preserveAspectRatio="none"
                  viewBox="0 0 400 100"
                >
                  <path
                    d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,20"
                    fill="none"
                    stroke="#2b6cee"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,20 V100 H0 Z"
                    fill="url(#grad1)"
                    vectorEffect="non-scaling-stroke"
                  />
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      x2="0%"
                      y1="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: 'rgba(43, 108, 238, 0.2)',
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: 'rgba(43, 108, 238, 0)',
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-4 left-0 w-full flex justify-between px-8 text-[10px] text-slate-400 font-medium z-10">
                  <span>01 OCT</span>
                  <span>07 OCT</span>
                  <span>14 OCT</span>
                  <span>21 OCT</span>
                  <span>28 OCT</span>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/20 flex flex-col">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">lightbulb</span>
                Performance Insights
              </h4>
              <div className="space-y-4 flex-1">
                <InsightCard
                  title="Peak Accuracy Window"
                  description="System performance peaks between 09:00 - 11:00 UTC, correlating with fresh user attention spans."
                />
                <InsightCard
                  title="Emotion Fatigue"
                  description="Sessions exceeding 15 mins show a 22% drop in accuracy for subtle micro-expressions."
                />
                <InsightCard
                  title="Adaptive Success"
                  description="Version 2.4 adaptive algorithms improved accuracy for Disgust recognition by 14%."
                />
              </div>
              <button className="mt-4 text-xs font-bold text-primary hover:underline">
                View Detailed Diagnostics →
              </button>
            </div>
          </div>

          {/* Row 2: Heatmap and Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emotion Confusion Heatmap */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <h4 className="font-bold">Emotion Confusion Heatmap</h4>
                <p className="text-xs text-slate-500">
                  Correlation between target emotion vs. predicted response
                </p>
              </div>
              <div className="grid grid-cols-6 grid-rows-6 gap-1 aspect-square max-w-[300px] mx-auto">
                {[90, 10, 5, 10, 5, 5, 5, 80, 20, 5, 5, 10, 10, 20, 90, 10, 10, 5, 5, 10, 5, 70, 40, 20, 10, 5, 10, 30, 80, 5, 5, 5, 5, 10, 10, 90].map((opacity, idx) => (
                  <div
                    key={idx}
                    className="rounded-sm"
                    style={{
                      backgroundColor: `rgba(43, 108, 238, ${opacity / 100})`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
                <span>Anger</span>
                <span>Joy</span>
                <span>Fear</span>
                <span>Surprise</span>
                <span>Sadness</span>
                <span>Disgust</span>
              </div>
            </div>

            {/* Reaction Time Histogram */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <h4 className="font-bold">Reaction Time Distribution</h4>
                <p className="text-xs text-slate-500">
                  Frequency distribution of response latency (seconds)
                </p>
              </div>
              <div className="h-64 flex items-end gap-1 px-2 pb-8 border-b border-l border-slate-100 dark:border-slate-800">
                {[15, 30, 55, 85, 95, 70, 45, 25, 10, 5].map((height, idx) => (
                  <div
                    key={idx}
                    className="bg-primary w-full rounded-t-sm"
                    style={{
                      height: `${height}%`,
                      opacity: 1 - idx * 0.1,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400 px-1 font-medium">
                <span>0.2s</span>
                <span>0.8s</span>
                <span>1.4s</span>
                <span>2.0s</span>
                <span>2.6s</span>
              </div>
            </div>
          </div>

          {/* Row 3: Learning Performance Comparison */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-8">
              <h4 className="font-bold">
                Adaptive Learning Performance Comparison
              </h4>
              <p className="text-xs text-slate-500">
                Comparing Standard Curriculum vs. AI-Driven Adaptive Paths
              </p>
            </div>
            <div className="space-y-6">
              <ProgressBar
                label="Adaptive Path (AI-Enabled)"
                value={91}
                color="primary"
              />
              <ProgressBar
                label="Standard Linear Path"
                value={74}
                color="slate"
              />
              <ProgressBar
                label="Reference Benchmark (Industry)"
                value={68}
                color="slate"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-slate-200 dark:border-slate-800 mt-auto flex items-center justify-between text-[10px] text-slate-500 font-medium uppercase tracking-widest">
          <p>
            © 2024 Emotion Training & Evaluation System - Research Division
          </p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">
              Documentation
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              API Reference
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
          </div>
        </footer>
    </>
  );
}

// Sub-components
function KPICard({
  title,
  value,
  trend,
  trendType,
}: {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'static';
}) {
  const trendColor =
    trendType === 'up'
      ? 'text-emerald-500 bg-emerald-500/10'
      : trendType === 'down'
        ? 'text-orange-500 bg-orange-500/10'
        : 'text-slate-500 bg-slate-500/10';

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {title}
      </p>
      <div className="mt-2 flex items-end justify-between">
        <h3 className="text-2xl font-bold">{value}</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendColor}`}>
          {trendType !== 'static' && (
            <span className="material-symbols-outlined text-xs">
              {trendType === 'up' ? 'trending_up' : 'trending_down'}
            </span>
          )}
          {trend}
        </span>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg border border-primary/10">
      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const barColor = color === 'primary' ? 'bg-primary' : 'bg-slate-400';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span className={color === 'primary' ? 'text-primary' : 'text-slate-500'}>
          {value}% Mastery
        </span>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

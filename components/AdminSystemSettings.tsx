'use client';

import { useState } from 'react';

export default function AdminSystemSettings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  return (
    <>
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          System Settings
        </h2>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Discard
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* General Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">language</span>
              General Settings
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage the core identity of the platform.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Platform Name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary px-3 py-2"
                  type="text"
                  defaultValue="Emotion Training & Evaluation System"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Default Language
                </label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary px-3 py-2">
                  <option>English (US)</option>
                  <option>German</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                <span className="material-symbols-outlined text-slate-400">image</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Platform Logo
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  SVG, PNG, JPG or GIF (max. 3MB). Recommended size 512x512px.
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                    Upload New
                  </button>
                  <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              AI Configuration
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tune the emotion recognition engine and analysis tools.
            </p>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Analysis Model Version
                </label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary px-3 py-2">
                  <option>EmoSense v4.2 (Latest - Stable)</option>
                  <option>EmoSense v4.1 (Legacy)</option>
                  <option>NeuralFlow v2.0 (Experimental)</option>
                </select>
                <p className="text-[11px] text-primary bg-primary/5 p-2 rounded border border-primary/20">
                  Using the latest stable model provides 14% higher accuracy for micro-expressions.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confidence Threshold
                  </label>
                  <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
                    {confidenceThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-slate-500 italic">
                  Determines the minimum certainty required for emotion classification.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Real-time Feedback Analysis
                </p>
                <p className="text-xs text-slate-500">
                  Enable processing of audio streams during live training sessions for instant feedback.
                </p>
              </div>
              <Toggle defaultChecked />
            </div>
          </div>
        </section>

        {/* User Management Defaults */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_add</span>
              User Management Defaults
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure global rules for new and existing student accounts.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Default XP for New Users
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary pl-10 px-3 py-2"
                    type="number"
                    defaultValue="500"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
                    stars
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <input defaultChecked className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Auto-assign focus areas based on profile
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-7">
                  System will suggest initial modules based on student's occupation and goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Maintenance */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">terminal</span>
              System Maintenance
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Critical infrastructure management and security settings.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MaintenanceButton icon="database" title="Backup Database" description="Manual full-system backup to secure cloud storage." />
            <MaintenanceButton icon="assignment_late" title="View Error Logs" description="Check system-wide exceptions and performance warnings." />
            <MaintenanceButton icon="key" title="API Key Management" description="Generate and revoke keys for external integrations." />
          </div>
          <div className="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start gap-4">
            <span className="material-symbols-outlined text-red-600">warning</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 dark:text-red-400">
                Danger Zone
              </p>
              <p className="text-xs text-red-800 dark:text-red-500/80 mb-3">
                Resetting the system will purge all training data and logs. This action cannot be undone.
              </p>
              <button className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Factory Reset System
              </button>
            </div>
          </div>
        </section>

        <div className="h-10"></div>
      </div>
    </>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input defaultChecked={defaultChecked} className="sr-only peer" type="checkbox" />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
    </label>
  );
}

function MaintenanceButton({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <button className="flex flex-col items-start p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left">
      <span className="material-symbols-outlined text-primary mb-2">{icon}</span>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{title}</span>
      <span className="text-xs text-slate-500 mt-1">{description}</span>
    </button>
  );
}

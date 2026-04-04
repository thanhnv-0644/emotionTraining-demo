"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  xp: number;
  status: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await api.get<User>("/api/users/me");
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-slate-500">{error || "Không thể tải hồ sơ"}</p>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-8 pt-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-200">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src={user.avatar || "https://via.placeholder.com/96"}
              />
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-sm">
                photo_camera
              </span>
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                XP: {user.xp.toLocaleString()}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.status === "active"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-shadow shadow-md">
          <span className="material-symbols-outlined text-lg">edit</span>
          Edit Profile
        </button>
      </header>

      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {/* Personal Information */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">badge</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Personal Information
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Role
                </label>
                <p className="text-sm font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Total XP
                </label>
                <p className="text-sm font-medium">
                  {user.xp.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Account Security */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">security</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Account Security
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Change Password</p>
                  <p className="text-xs text-slate-500">
                    Update your security credentials
                  </p>
                </div>
                <button className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  UPDATE
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-slate-500">
                    Add an extra layer of security
                  </p>
                </div>
                <Toggle defaultChecked />
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 italic">
                  User ID: {user.id}
                </p>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-secondary">
              <span className="material-symbols-outlined">
                notifications_active
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Notification Settings
              </h3>
            </div>
            <div className="space-y-5">
              <NotificationToggle
                icon="trending_up"
                label="Email alerts for progress"
                defaultChecked
              />
              <NotificationToggle
                icon="calendar_month"
                label="Weekly reports"
                defaultChecked
              />
              <NotificationToggle icon="volume_up" label="Achievement sounds" />
            </div>
          </section>

          {/* Privacy & Profile Appearance */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-secondary">
              <span className="material-symbols-outlined">visibility</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Privacy & Profile
              </h3>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-slate-600">
                        public
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Public Profile</p>
                      <p className="text-xs text-slate-500">
                        Allow others to see your achievements
                      </p>
                    </div>
                  </div>
                  <Toggle defaultChecked />
                </div>
              </div>
              <div className="space-y-3 px-1">
                <p className="text-sm font-semibold">
                  Profile Visibility Settings
                </p>
                <div className="flex items-center gap-2">
                  <input
                    defaultChecked
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    Show current level on leaderboard
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    Share course progress with mentors
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Action Bar */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 max-w-5xl">
          <button className="px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Discard Changes
          </button>
          <button className="px-8 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Save Changes
          </button>
        </footer>
      </div>
    </>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        defaultChecked={defaultChecked}
        className="sr-only peer"
        type="checkbox"
      />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
    </label>
  );
}

function NotificationToggle({
  icon,
  label,
  defaultChecked = false,
}: {
  icon: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-slate-400">{icon}</span>
        <p className="text-sm font-medium">{label}</p>
      </div>
      <Toggle defaultChecked={defaultChecked} />
    </div>
  );
}

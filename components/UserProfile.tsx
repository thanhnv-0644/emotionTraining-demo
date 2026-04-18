"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AppPageHeader from "@/components/AppPageHeader";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

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

  function startEdit() {
    if (!user) return;
    setEditName(user.name);
    setSaveError("");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setSaveError("");
  }

  async function saveProfile() {
    if (!user || !editName.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const updated = await api.put<User>("/api/users/me", { name: editName.trim() });
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  }

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
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Hồ sơ</h1>
      </AppPageHeader>

      <div className="app-content">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg dark:border-slate-800">
                <img
                  alt="Profile"
                  className="h-full w-full object-cover"
                  src={user.avatar || "https://via.placeholder.com/96"}
                />
              </div>
              <button type="button" className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white shadow-md transition-colors hover:bg-primary/90">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <div className="mt-1 flex items-center gap-3">
                <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-secondary">
                  XP: {user.xp.toLocaleString()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
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
          {isEditing ? (
            <button type="button" onClick={cancelEdit} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-2.5 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Huỷ
            </button>
          ) : (
            <button type="button" onClick={startEdit} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition-shadow hover:bg-primary/90">
              <span className="material-symbols-outlined text-lg">edit</span>
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Personal Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">badge</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Thông tin cá nhân
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                ) : (
                  <p className="text-sm font-medium">{user.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </label>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Vai trò
                </label>
                <p className="text-sm font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Tổng XP
                </label>
                <p className="text-sm font-medium">
                  {user.xp.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Account Security */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">security</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Bảo mật tài khoản
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Đổi mật khẩu</p>
                  <p className="text-xs text-slate-500">
                    Cập nhật thông tin đăng nhập
                  </p>
                </div>
                <button type="button" className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  CẬP NHẬT
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Xác thực hai lớp
                  </p>
                  <p className="text-xs text-slate-500">
                    Tăng cường bảo vệ tài khoản
                  </p>
                </div>
                <Toggle defaultChecked />
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 italic">
                  Mã người dùng: {user.id}
                </p>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-6 text-secondary">
              <span className="material-symbols-outlined">
                notifications_active
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Thông báo
              </h3>
            </div>
            <div className="space-y-5">
              <NotificationToggle
                icon="trending_up"
                label="Email nhắc tiến độ"
                defaultChecked
              />
              <NotificationToggle
                icon="calendar_month"
                label="Báo cáo hàng tuần"
                defaultChecked
              />
              <NotificationToggle icon="volume_up" label="Âm thanh thành tích" />
            </div>
          </section>

          {/* Privacy & Profile Appearance */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-6 text-secondary">
              <span className="material-symbols-outlined">visibility</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Riêng tư và hiển thị
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
                      <p className="text-sm font-bold">Hồ sơ công khai</p>
                      <p className="text-xs text-slate-500">
                        Cho phép người khác xem thành tích
                      </p>
                    </div>
                  </div>
                  <Toggle defaultChecked />
                </div>
              </div>
              <div className="space-y-3 px-1">
                <p className="text-sm font-semibold">
                  Ai được xem thông tin
                </p>
                <div className="flex items-center gap-2">
                  <input
                    defaultChecked
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    Hiển thị cấp độ trên bảng xếp hạng
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    Chia sẻ tiến độ khoá học với mentor
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Action Bar */}
        {isEditing && (
          <footer className="mx-auto mt-12 flex max-w-5xl flex-col items-end gap-3 border-t border-slate-200 pt-8 dark:border-slate-800">
            {saveError && (
              <p className="text-sm text-red-500">{saveError}</p>
            )}
            <div className="flex gap-4">
              <button onClick={cancelEdit} className="px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                Huỷ thay đổi
              </button>
              <button type="button" onClick={saveProfile} disabled={saving || !editName.trim()} className="px-8 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </footer>
        )}
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

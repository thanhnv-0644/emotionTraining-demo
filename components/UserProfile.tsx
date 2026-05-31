"use client";

import { useEffect, useRef, useState } from "react";
import { api, BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
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

const XP_LEVELS = [
  { xp: 0,    label: 'Người mới',       icon: 'emoji_nature',      color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800' },
  { xp: 100,  label: 'Người học',       icon: 'school',            color: 'text-green-600',   bg: 'bg-green-100 dark:bg-green-900/30' },
  { xp: 300,  label: 'Người thực hành', icon: 'psychology',        color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { xp: 700,  label: 'Chuyên gia',      icon: 'workspace_premium', color: 'text-purple-600',  bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { xp: 1500, label: 'Bậc thầy',        icon: 'military_tech',     color: 'text-yellow-600',  bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { xp: 3000, label: 'Huyền thoại',     icon: 'stars',             color: 'text-orange-600',  bg: 'bg-orange-100 dark:bg-orange-900/30' },
];

const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshUser } = useAuth();

  // Edit name
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Avatar
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Change password
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    api.get<User>("/api/users/me")
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    if (!user || !editName.trim()) return;
    setSaving(true); setSaveError("");
    try {
      const updated = await api.put<User>("/api/users/me", { name: editName.trim() });
      setUser(updated);
      setIsEditing(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Lưu thất bại.");
    } finally { setSaving(false); }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const res = await fetch(`${BASE_URL}/api/users/me/avatar`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload thất bại");
      const json = await res.json();
      setUser(json.data);
      await refreshUser();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload ảnh thất bại");
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  async function handleChangePassword() {
    setPwError(""); setPwSuccess(false);
    if (!pwForm.current) { setPwError("Vui lòng nhập mật khẩu hiện tại"); return; }
    if (pwForm.next.length < 6) { setPwError("Mật khẩu mới phải có ít nhất 6 ký tự"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Mật khẩu xác nhận không khớp"); return; }
    setPwSaving(true);
    try {
      await api.put("/api/users/me/password", { currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwSuccess(true);
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (e) {
      setPwError(e instanceof Error ? e.message : "Đổi mật khẩu thất bại");
    } finally { setPwSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const xp = user.xp ?? 0;
  const levelIdx = XP_LEVELS.reduce((acc, l, i) => xp >= l.xp ? i : acc, 0);
  const currentLevel = XP_LEVELS[levelIdx];
  const nextLevel = XP_LEVELS[levelIdx + 1] ?? null;
  const xpProgress = nextLevel ? Math.round(((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100) : 100;

  const avatarSrc = user.avatar
    ? `${BASE_URL}${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`;

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Hồ sơ</h1>
      </AppPageHeader>

      <div className="app-content space-y-6">

        {/* ── Header card ── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Banner gradient */}
          <div className="h-24 bg-gradient-to-r from-primary/30 via-indigo-400/20 to-purple-400/20" />

          <div className="px-6 pb-6 -mt-12">
            <div className="flex items-end justify-between gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-lg bg-slate-200">
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {avatarUploading
                    ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-[12px]">photo_camera</span>}
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Edit button */}
              {!isEditing && (
                <button onClick={() => { setEditName(user.name); setSaveError(""); setIsEditing(true); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-base">edit</span>
                  Chỉnh sửa
                </button>
              )}
            </div>

            <div className="mt-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input className="flex-1 text-xl font-bold px-2 py-1 rounded-lg border border-primary/50 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30"
                    value={editName} onChange={e => setEditName(e.target.value)} />
                  <button onClick={saveProfile} disabled={saving || !editName.trim()}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1">
                    {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    Lưu
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Huỷ
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
              )}
              {saveError && <p className="text-red-500 text-xs mt-1">{saveError}</p>}
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>

            {/* XP level + progress */}
            <div className="mt-4 flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${currentLevel.bg} ${currentLevel.color}`}>
                <span className="material-symbols-outlined text-[14px]">{currentLevel.icon}</span>
                {currentLevel.label}
              </span>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 font-medium">
                  {xp.toLocaleString()} {nextLevel ? `/ ${nextLevel.xp.toLocaleString()} XP` : 'XP'}
                </span>
              </div>
              {nextLevel && (
                <span className="text-xs text-slate-400 flex-shrink-0">→ {nextLevel.label}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Info + Password ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin tài khoản */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-base">badge</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Thông tin tài khoản</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { label: 'Email', value: user.email, icon: 'mail' },
                { label: 'Vai trò', value: user.role === 'student' ? 'Học viên' : user.role === 'admin' ? 'Quản trị viên' : user.role, icon: 'person' },
                { label: 'Trạng thái', value: user.status === 'active' ? 'Đang hoạt động' : user.status, icon: 'radio_button_checked', highlight: user.status === 'active' },
                { label: 'Tổng XP', value: `${(user.xp ?? 0).toLocaleString()} XP`, icon: 'star' },
                { label: 'Mã người dùng', value: user.id, icon: 'fingerprint', mono: true },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">{row.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{row.label}</p>
                    <p className={`text-sm font-medium truncate ${row.mono ? 'font-mono text-xs text-slate-500' : 'text-slate-800 dark:text-slate-200'} ${row.highlight ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Đổi mật khẩu */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-base">lock</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Đổi mật khẩu</h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mật khẩu hiện tại</label>
              <input type="password" className={inputCls} value={pwForm.current}
                onChange={e => { setPwForm(f => ({ ...f, current: e.target.value })); setPwError(""); setPwSuccess(false); }}
                placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mật khẩu mới</label>
              <input type="password" className={inputCls} value={pwForm.next}
                onChange={e => { setPwForm(f => ({ ...f, next: e.target.value })); setPwError(""); setPwSuccess(false); }}
                placeholder="Tối thiểu 6 ký tự" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
              <input type="password" className={inputCls} value={pwForm.confirm}
                onChange={e => { setPwForm(f => ({ ...f, confirm: e.target.value })); setPwError(""); setPwSuccess(false); }}
                placeholder="••••••••" />
            </div>
            {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
            {pwSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Đổi mật khẩu thành công!
              </div>
            )}
            <button onClick={handleChangePassword} disabled={pwSaving}
              className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {pwSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Cập nhật mật khẩu
            </button>
          </section>
        </div>

      </div>
    </>
  );
}

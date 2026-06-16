'use client';

import { useEffect, useState, useCallback } from 'react';
import AppPageHeader from '@/components/AppPageHeader';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SystemHealth {
  aiServiceOnline: boolean;
  aiServiceUrl: string;
  aiModelName: string;
  uptimeSeconds: number;
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalProgress: number;
  totalPayments: number;
}

interface CleanupPreview {
  paymentsToDelete: number;
  daysThreshold: number;
}

interface XpLevel {
  xp: number;
  label: string;
  icon: string;
  color: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}n ${h}g ${m}p`;
  if (h > 0) return `${h}g ${m}p ${s}s`;
  if (m > 0) return `${m}p ${s}s`;
  return `${s}s`;
}

function StatCard({ icon, label, value, color = 'text-primary' }: {
  icon: string; label: string; value: string | number; color?: string;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
      <span className={`material-symbols-outlined text-2xl ${color}`}>{icon}</span>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, description, children }: {
  icon: string; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
          {title}
        </h3>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminSystemSettings() {
  // Health
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  // Cleanup
  const [preview, setPreview] = useState<CleanupPreview | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleanMsg, setCleanMsg] = useState('');

  // XP Config
  const [xpLevels, setXpLevels] = useState<XpLevel[]>([]);
  const [xpLoading, setXpLoading] = useState(true);
  const [xpSaving, setXpSaving] = useState(false);
  const [xpMsg, setXpMsg] = useState('');

  // ── Fetch health ────────────────────────────────────────────────────────────
  const fetchHealth = useCallback(() => {
    setHealthLoading(true);
    api.get<SystemHealth>('/api/admin/system/health')
      .then(d => { if (d) setHealth(d); })
      .catch(() => {})
      .finally(() => setHealthLoading(false));
  }, []);

  // ── Fetch cleanup preview ───────────────────────────────────────────────────
  const fetchPreview = useCallback(() => {
    api.get<CleanupPreview>('/api/admin/system/cleanup/preview')
      .then(d => { if (d) setPreview(d); })
      .catch(() => {});
  }, []);

  // ── Fetch XP config ─────────────────────────────────────────────────────────
  const fetchXpConfig = useCallback(() => {
    setXpLoading(true);
    api.get<XpLevel[]>('/api/admin/system/config/xp')
      .then(d => { if (d) setXpLevels(d); })
      .catch(() => {})
      .finally(() => setXpLoading(false));
  }, []);

  useEffect(() => {
    fetchHealth();
    fetchPreview();
    fetchXpConfig();

    // Auto-refresh health mỗi 30 giây
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth, fetchPreview, fetchXpConfig]);

  // ── Execute cleanup ─────────────────────────────────────────────────────────
  async function executeCleanup() {
    if (!confirm(`Xác nhận xoá ${preview?.paymentsToDelete ?? 0} payment cũ (> ${preview?.daysThreshold ?? 3} ngày)?`)) return;
    setCleaning(true); setCleanMsg('');
    try {
      const res = await api.post<{ deleted: number; message: string }>('/api/admin/system/cleanup/payments', {});
      setCleanMsg(res?.message ?? 'Hoàn tất');
      fetchPreview();
    } catch {
      setCleanMsg('Dọn dẹp thất bại.');
    } finally { setCleaning(false); }
  }

  // ── Save XP config ──────────────────────────────────────────────────────────
  async function saveXpConfig() {
    setXpSaving(true); setXpMsg('');
    try {
      await api.put('/api/admin/system/config/xp', xpLevels);
      setXpMsg('Đã lưu cấu hình XP.');
    } catch {
      setXpMsg('Lưu thất bại.');
    } finally { setXpSaving(false); }
  }

  function updateLevel(idx: number, field: keyof XpLevel, value: string | number) {
    setXpLevels(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
    setXpMsg('');
  }

  function addLevel() {
    setXpLevels(prev => [...prev, { xp: 0, label: 'Cấp mới', icon: 'star', color: 'text-slate-500' }]);
  }

  function removeLevel(idx: number) {
    setXpLevels(prev => prev.filter((_, i) => i !== idx));
    setXpMsg('');
  }

  return (
    <>
      <AppPageHeader>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Cài đặt hệ thống</h2>
      </AppPageHeader>

      <div className="mx-auto max-w-4xl space-y-6 p-6">

        {/* ── Trạng thái hệ thống ─────────────────────────────────────────── */}
        <SectionCard icon="monitor_heart" title="Trạng thái hệ thống"
          description="Thông tin live về các dịch vụ và cơ sở dữ liệu.">
          {healthLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : health ? (
            <div className="space-y-4">
              {/* Services status */}
              <div className="flex flex-wrap gap-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border ${health.aiServiceOnline ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${health.aiServiceOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  AI Service — {health.aiServiceOnline ? 'Online' : 'Offline'}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Backend — Online
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  Uptime: <span className="font-semibold text-slate-600 dark:text-slate-300">{formatUptime(health.uptimeSeconds)}</span>
                </div>
              </div>

              {/* DB Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard icon="group" label="Người dùng" value={health.totalUsers.toLocaleString()} color="text-blue-500" />
                <StatCard icon="school" label="Khoá học" value={health.totalCourses.toLocaleString()} color="text-purple-500" />
                <StatCard icon="menu_book" label="Bài học" value={health.totalLessons.toLocaleString()} color="text-indigo-500" />
                <StatCard icon="task_alt" label="Tiến độ" value={health.totalProgress.toLocaleString()} color="text-emerald-500" />
                <StatCard icon="payments" label="Thanh toán" value={health.totalPayments.toLocaleString()} color="text-amber-500" />
              </div>

              {/* Tech info */}
              <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><span className="font-semibold text-slate-500">AI Model:</span> {health.aiModelName}</p>
                <p><span className="font-semibold text-slate-500">AI URL:</span> {health.aiServiceUrl}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Không thể tải thông tin hệ thống.</p>
          )}

          <button onClick={fetchHealth} disabled={healthLoading}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50">
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Làm mới
          </button>
        </SectionCard>

        {/* ── Dọn dẹp dữ liệu ────────────────────────────────────────────── */}
        <SectionCard icon="cleaning_services" title="Dọn dẹp dữ liệu"
          description={`Xoá các payment expired/failed/cancelled quá ${preview?.daysThreshold ?? 3} ngày.`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${(preview?.paymentsToDelete ?? 0) > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <span className={`material-symbols-outlined text-2xl ${(preview?.paymentsToDelete ?? 0) > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {(preview?.paymentsToDelete ?? 0) > 0 ? 'warning' : 'check_circle'}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {preview === null ? '...' : preview.paymentsToDelete > 0
                    ? `${preview.paymentsToDelete} payment sẽ bị xoá`
                    : 'Không có gì cần dọn'}
                </p>
                <p className="text-xs text-slate-500">
                  {(preview?.paymentsToDelete ?? 0) > 0
                    ? 'Các giao dịch cũ chiếm dữ liệu không cần thiết'
                    : 'Cơ sở dữ liệu đang sạch'}
                </p>
              </div>
            </div>
            <button
              onClick={executeCleanup}
              disabled={cleaning || (preview?.paymentsToDelete ?? 0) === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {cleaning
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xoá...</>
                : <><span className="material-symbols-outlined text-[16px]">delete_sweep</span>Dọn dẹp ngay</>}
            </button>
          </div>
          {cleanMsg && (
            <p className={`mt-3 text-sm font-semibold flex items-center gap-1.5 ${cleanMsg.includes('thất bại') ? 'text-red-500' : 'text-emerald-600'}`}>
              <span className="material-symbols-outlined text-[16px]">{cleanMsg.includes('thất bại') ? 'error' : 'check_circle'}</span>
              {cleanMsg}
            </p>
          )}
        </SectionCard>

        {/* ── Cấu hình cấp độ XP ─────────────────────────────────────────── */}
        <SectionCard icon="military_tech" title="Cấu hình cấp độ XP"
          description="Điều chỉnh ngưỡng XP và tên cho từng cấp bậc học viên.">
          {xpLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span className="col-span-2">XP tối thiểu</span>
                <span className="col-span-4">Tên cấp độ</span>
                <span className="col-span-3">Icon</span>
                <span className="col-span-2">Màu chữ</span>
                <span className="col-span-1" />
              </div>

              {xpLevels.map((level, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="number" min={0} value={level.xp}
                    onChange={e => updateLevel(idx, 'xp', Number(e.target.value))}
                    className="col-span-2 px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="text" value={level.label}
                    onChange={e => updateLevel(idx, 'label', e.target.value)}
                    className="col-span-4 px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="text" value={level.icon}
                    onChange={e => updateLevel(idx, 'icon', e.target.value)}
                    className="col-span-3 px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                    placeholder="material icon name"
                  />
                  <input
                    type="text" value={level.color}
                    onChange={e => updateLevel(idx, 'color', e.target.value)}
                    className="col-span-2 px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                    placeholder="text-green-600"
                  />
                  <button onClick={() => removeLevel(idx)} disabled={xpLevels.length <= 1}
                    className="col-span-1 flex items-center justify-center text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button onClick={addLevel}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[16px]">add</span>Thêm cấp
                </button>
                <div className="flex items-center gap-3">
                  {xpMsg && (
                    <span className={`text-sm font-semibold ${xpMsg.includes('thất bại') ? 'text-red-500' : 'text-emerald-600'}`}>
                      {xpMsg}
                    </span>
                  )}
                  <button onClick={saveXpConfig} disabled={xpSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {xpSaving
                      ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu...</>
                      : <><span className="material-symbols-outlined text-[16px]">save</span>Lưu cấu hình</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

      </div>
    </>
  );
}

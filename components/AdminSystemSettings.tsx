'use client';

import { useState } from 'react';
import AppPageHeader from '@/components/AppPageHeader';

export default function AdminSystemSettings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  return (
    <>
      <AppPageHeader>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
          Cài đặt hệ thống
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            Huỷ
          </button>
          <button type="button" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90">
            Lưu thay đổi
          </button>
        </div>
      </AppPageHeader>

      <div className="mx-auto max-w-5xl space-y-8 p-6 sm:p-8 lg:p-10">
        {/* General Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">language</span>
              Cài đặt chung
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Thông tin nhận diện và ngôn ngữ mặc định của nền tảng.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tên nền tảng
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary px-3 py-2"
                  type="text"
                  defaultValue="Emotion Training & Evaluation System"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ngôn ngữ mặc định
                </label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary px-3 py-2">
                  <option>Tiếng Việt</option>
                  <option>English (US)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                <span className="material-symbols-outlined text-slate-400">image</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Logo nền tảng
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  SVG, PNG, JPG hoặc GIF (tối đa 3MB). Khuyến nghị 512×512px.
                </p>
                <div className="flex gap-2">
                  <button type="button" className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                    Tải lên
                  </button>
                  <button type="button" className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors">
                    Xoá
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
              Cấu hình AI
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Điều chỉnh mô hình nhận diện cảm xúc và phân tích.
            </p>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phiên bản mô hình
                </label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary px-3 py-2">
                  <option>EmoSense v4.2 (Latest - Stable)</option>
                  <option>EmoSense v4.1 (Legacy)</option>
                  <option>NeuralFlow v2.0 (Experimental)</option>
                </select>
                <p className="text-[11px] text-primary bg-primary/5 p-2 rounded border border-primary/20">
                  Phiên bản ổn định mới nhất thường cho độ chính xác cao hơn với biểu cảc nhỏ.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ngưỡng tin cậy
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
                  Mức tin cậy tối thiểu để gán nhãn cảm xúc.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Phân tích phản hồi thời gian thực
                </p>
                <p className="text-xs text-slate-500">
                  Bật xử lý luồng âm thanh trong buổi luyện để phản hồi tức thì.
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
              Mặc định người dùng
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quy tắc chung cho tài khoản học viên mới và hiện có.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  XP mặc định cho người mới
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
                    Gợi ý lộ trình theo hồ sơ
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-7">
                  Hệ thống gợi ý module ban đầu theo nghề nghiệp và mục tiêu.
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
              Bảo trì hệ thống
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sao lưu, nhật ký và thao tác nhạy cảm.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MaintenanceButton icon="database" title="Sao lưu cơ sở dữ liệu" description="Sao lưu thủ công toàn hệ thống." />
            <MaintenanceButton icon="assignment_late" title="Xem nhật ký lỗi" description="Kiểm tra ngoại lệ và cảnh báo hiệu năng." />
            <MaintenanceButton icon="key" title="Quản lý API key" description="Tạo và thu hồi khoá tích hợp bên ngoài." />
          </div>
          <div className="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex items-start gap-4">
            <span className="material-symbols-outlined text-red-600">warning</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 dark:text-red-400">
                Vùng nguy hiểm
              </p>
              <p className="text-xs text-red-800 dark:text-red-500/80 mb-3">
                Khôi phục cài đặt gốc sẽ xoá dữ liệu luyện tập và nhật ký. Không thể hoàn tác.
              </p>
              <button type="button" className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Khôi phục nhà máy
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

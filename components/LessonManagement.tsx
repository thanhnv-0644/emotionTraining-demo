"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { api, BASE_URL } from "@/lib/api";
import AppPageHeader from "@/components/AppPageHeader";
import Pagination from "@/components/Pagination";

const LESSON_PAGE_SIZE = 10;
const CLIP_PAGE_SIZE = 10;

interface CourseInfo {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  lessonCount: number;
  status: string;
  isFree: boolean;
  price: number;
}

interface LessonResponse {
  id: string;
  courseId: string;
  title: string;
  order: number;
  level: string;
  duration: number;
  status: string;
  audioClipCount: number;
}

interface AudioClipResponse {
  id: string;
  lessonId: string;
  subject: string;
  audioUrl: string;
  duration: number;
  targetEmotion: string;
  order: number;
}

const EMOTION_COLORS: Record<string, { bg: string; text: string }> = {
  happiness: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400" },
  sadness:   { bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-700 dark:text-blue-400" },
  anger:     { bg: "bg-red-100 dark:bg-red-900/30",     text: "text-red-700 dark:text-red-400" },
  neutral:   { bg: "bg-slate-100 dark:bg-slate-800",    text: "text-slate-700 dark:text-slate-300" },
  surprise:  { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  fear:      { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  disgust:   { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
};

const EMOTIONS = Object.keys(EMOTION_COLORS);
const LEVELS = ["beginner", "intermediate", "advanced"];

const LEVEL_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  beginner:     { label: "Cơ bản",    bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  intermediate: { label: "Trung bình", bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-400",   dot: "bg-amber-500"   },
  advanced:     { label: "Nâng cao",  bg: "bg-red-100 dark:bg-red-900/30",        text: "text-red-700 dark:text-red-400",        dot: "bg-red-500"     },
};

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_CONFIG[level] ?? { label: level, bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function LessonManagement({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [clips, setClips] = useState<AudioClipResponse[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Lesson search & filter
  const [lessonSearch, setLessonSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [lessonPage, setLessonPage] = useState(1);
  const [clipPage, setClipPage] = useState(1);

  // Upload form
  const [uploadSubject, setUploadSubject] = useState("");
  const [uploadEmotion, setUploadEmotion] = useState("happiness");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create lesson modal
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", level: "beginner", duration: "" });
  const [lessonSaving, setLessonSaving] = useState(false);
  const [lessonError, setLessonError] = useState("");

  // Edit lesson modal
  const [editLesson, setEditLesson] = useState<LessonResponse | null>(null);
  const [editLessonForm, setEditLessonForm] = useState({ title: "", level: "beginner", duration: "", status: "active", order: "" });
  const [editLessonSaving, setEditLessonSaving] = useState(false);
  const [editLessonError, setEditLessonError] = useState("");

  // Edit clip modal
  const [editClip, setEditClip] = useState<AudioClipResponse | null>(null);
  const [editClipForm, setEditClipForm] = useState({ subject: "", targetEmotion: "happiness", order: "" });
  const [editClipSaving, setEditClipSaving] = useState(false);
  const [editClipError, setEditClipError] = useState("");

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      api.get<CourseInfo[]>('/api/admin/courses'),
      api.get<LessonResponse[]>(`/api/admin/courses/${courseId}/lessons`),
    ]).then(([courses, lessons]) => {
      setCourse(courses?.find(c => c.id === courseId) ?? null);
      setLessons(lessons ?? []);
    }).catch(() => setError("Không thể tải dữ liệu."))
      .finally(() => setLoading(false));
  }, [courseId]);

  const loadClips = (lesson: LessonResponse) => {
    setSelectedLesson(lesson);
    setClipPage(1);
    setClipsLoading(true);
    api.get<AudioClipResponse[]>(`/api/admin/lessons/${lesson.id}/audio-clips`)
      .then(data => setClips(data ?? []))
      .catch(() => {})
      .finally(() => setClipsLoading(false));
  };

  // ── Create lesson ──────────────────────────────────────────────
  const handleCreateLesson = async () => {
    if (!lessonForm.title.trim()) { setLessonError("Vui lòng nhập tên bài học"); return; }
    setLessonSaving(true); setLessonError("");
    try {
      const created = await api.post<LessonResponse>(`/api/admin/courses/${courseId}/lessons`, {
        title: lessonForm.title,
        level: lessonForm.level,
        duration: parseInt(lessonForm.duration) || 0,
      });
      setLessons(prev => [...prev, created]);
      setShowCreateLesson(false);
      setLessonForm({ title: "", level: "beginner", duration: "" });
    } catch (e: unknown) {
      setLessonError(e instanceof Error ? e.message : "Tạo thất bại");
    } finally { setLessonSaving(false); }
  };

  // ── Edit lesson ────────────────────────────────────────────────
  const openEditLesson = (lesson: LessonResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditLesson(lesson);
    setEditLessonForm({
      title: lesson.title,
      level: lesson.level ?? "beginner",
      duration: String(lesson.duration ?? ""),
      status: lesson.status ?? "active",
      order: String(lesson.order ?? ""),
    });
    setEditLessonError("");
  };

  const handleUpdateLesson = async () => {
    if (!editLesson) return;
    setEditLessonSaving(true); setEditLessonError("");
    try {
      const updated = await api.put<LessonResponse>(`/api/admin/lessons/${editLesson.id}`, {
        title: editLessonForm.title,
        level: editLessonForm.level,
        duration: parseInt(editLessonForm.duration) || 0,
        status: editLessonForm.status,
        order: parseInt(editLessonForm.order) || editLesson.order,
      });
      setLessons(prev => prev.map(l => l.id === editLesson.id ? updated : l));
      setEditLesson(null);
    } catch (e: unknown) {
      setEditLessonError(e instanceof Error ? e.message : "Cập nhật thất bại");
    } finally { setEditLessonSaving(false); }
  };

  // ── Delete lesson ──────────────────────────────────────────────
  const handleDeleteLesson = async (lesson: LessonResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Xóa bài học "${lesson.title}"?`)) return;
    try {
      await api.delete(`/api/admin/lessons/${lesson.id}`);
      setLessons(prev => prev.filter(l => l.id !== lesson.id));
      if (selectedLesson?.id === lesson.id) { setSelectedLesson(null); setClips([]); }
    } catch {
      alert("Xóa thất bại.");
    }
  };

  // ── Delete clip ────────────────────────────────────────────────
  const handleDeleteClip = async (clipId: string) => {
    if (!confirm("Xóa audio clip này?")) return;
    try {
      await api.delete(`/api/admin/audio-clips/${clipId}`);
      setClips(prev => prev.filter(c => c.id !== clipId));
    } catch {
      alert("Xóa thất bại.");
    }
  };

  // ── Edit clip ──────────────────────────────────────────────────
  const openEditClip = (clip: AudioClipResponse) => {
    setEditClip(clip);
    setEditClipForm({ subject: clip.subject, targetEmotion: clip.targetEmotion, order: String(clip.order) });
    setEditClipError("");
  };

  const handleUpdateClip = async () => {
    if (!editClip) return;
    setEditClipSaving(true); setEditClipError("");
    try {
      const updated = await api.put<AudioClipResponse>(`/api/admin/audio-clips/${editClip.id}`, {
        subject: editClipForm.subject,
        targetEmotion: editClipForm.targetEmotion,
        order: parseInt(editClipForm.order) || editClip.order,
        audioUrl: editClip.audioUrl,
        duration: editClip.duration,
      });
      setClips(prev => prev.map(c => c.id === editClip.id ? updated : c));
      setEditClip(null);
    } catch (e: unknown) {
      setEditClipError(e instanceof Error ? e.message : "Cập nhật thất bại");
    } finally { setEditClipSaving(false); }
  };

  // ── Upload clip ────────────────────────────────────────────────
  const handleUpload = async (lessonId: string) => {
    if (!uploadFile || !uploadSubject) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("subject", uploadSubject);
      formData.append("targetEmotion", uploadEmotion);
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const res = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/audio-clips`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload thất bại");
      const json = await res.json();
      setClips(prev => [...prev, json.data]);
      setUploadSubject("");
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      alert("Upload thất bại.");
    } finally { setUploading(false); }
  };

  const displayedLessons = lessons.filter(l =>
    (!lessonSearch || l.title.toLowerCase().includes(lessonSearch.toLowerCase())) &&
    (!levelFilter || l.level === levelFilter)
  );
  const paginatedLessons = displayedLessons.slice((lessonPage - 1) * LESSON_PAGE_SIZE, lessonPage * LESSON_PAGE_SIZE);
  const paginatedClips = clips.slice((clipPage - 1) * CLIP_PAGE_SIZE, clipPage * CLIP_PAGE_SIZE);

  return (
    <>
      <AppPageHeader className="justify-start">
        {/* Breadcrumb kiểu Drive */}
        <nav className="flex items-center gap-1 min-w-0 flex-1 text-sm">
          <button
            onClick={() => router.push('/admin/courses')}
            className="font-semibold text-slate-500 hover:text-primary transition-colors whitespace-nowrap"
          >
            Quản lý khoá học
          </button>
          <span className="material-symbols-outlined text-slate-300 text-base flex-shrink-0">chevron_right</span>
          {course ? (
            <button
              onClick={() => { setSelectedLesson(null); setClips([]); }}
              className={`font-semibold truncate transition-colors ${selectedLesson ? 'text-slate-500 hover:text-primary' : 'text-slate-900 dark:text-white'}`}
            >
              {course.title}
            </button>
          ) : (
            <span className="font-semibold text-slate-900 dark:text-white truncate">...</span>
          )}
          {selectedLesson && (
            <>
              <span className="material-symbols-outlined text-slate-300 text-base flex-shrink-0">chevron_right</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">{selectedLesson.title}</span>
            </>
          )}
        </nav>

        {/* Action button */}
        {!selectedLesson && (
          <button
            onClick={() => { setShowCreateLesson(true); setLessonForm({ title: "", level: "beginner", duration: "" }); setLessonError(""); }}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tạo bài học
          </button>
        )}
      </AppPageHeader>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}

        {!selectedLesson ? (
          // ── Danh sách bài học ──────────────────────────────────
          <div className="space-y-6">
            {/* Course header card */}
            {course && (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="h-32 relative bg-gradient-to-br from-primary/20 to-indigo-400/20">
                  {course.image && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-slate-900/80 to-transparent" />
                </div>
                <div className="px-6 pb-6 -mt-8 relative">
                  <div className="flex items-end gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg flex-shrink-0 border-4 border-white dark:border-slate-900">
                      <span className="material-symbols-outlined text-white text-3xl">psychology</span>
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">{course.title}</h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="capitalize text-xs font-medium text-slate-500">{course.category}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          course.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : course.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {course.status === 'published' ? 'Xuất bản' : course.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-medium text-slate-500">{course.isFree ? 'Miễn phí' : `${(course.price ?? 0).toLocaleString('vi-VN')}đ`}</span>
                      </div>
                    </div>
                  </div>
                  {course.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                  )}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{lessons.length}</p>
                      <p className="text-xs text-slate-500">Bài học</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {lessons.reduce((s, l) => s + (l.audioClipCount ?? 0), 0)}
                      </p>
                      <p className="text-xs text-slate-500">Audio clip</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatDuration(lessons.reduce((s, l) => s + (l.duration ?? 0), 0))}
                      </p>
                      <p className="text-xs text-slate-500">Tổng thời lượng</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search & filter */}
            {!loading && lessons.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={e => { setLessonSearch(e.target.value); setLessonPage(1); }}
                    placeholder="Tìm bài học..."
                    className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-56"
                  />
                </div>
                <select
                  value={levelFilter}
                  onChange={e => { setLevelFilter(e.target.value); setLessonPage(1); }}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Tất cả cấp độ</option>
                  {LEVELS.map(l => <option key={l} value={l}>{LEVEL_CONFIG[l].label}</option>)}
                </select>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">library_books</span>
                <p className="text-slate-500 mb-4">Khoá học này chưa có bài học nào.</p>
                <button
                  onClick={() => setShowCreateLesson(true)}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90"
                >
                  Tạo bài học đầu tiên
                </button>
              </div>
            ) : displayedLessons.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">search_off</span>
                <p className="text-slate-500 text-sm">Không tìm thấy bài học nào.</p>
              </div>
            ) : (
              <>
              <div className="grid gap-3">
                {paginatedLessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all group"
                    >
                      <button onClick={() => loadClips(lesson)} className="flex items-center gap-4 flex-1 text-left min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {lesson.order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors truncate">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <LevelBadge level={lesson.level} />
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{lesson.audioClipCount} clip</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{formatDuration(lesson.duration)}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                          lesson.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {lesson.status === "active" ? "Hoạt động" : lesson.status}
                        </span>
                      </button>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={e => openEditLesson(lesson, e)}
                          className="w-8 h-8 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                          title="Sửa bài học"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={e => handleDeleteLesson(lesson, e)}
                          className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                          title="Xóa bài học"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination page={lessonPage} total={displayedLessons.length} pageSize={LESSON_PAGE_SIZE} onChange={setLessonPage} />
              </>
            )}
          </div>
        ) : (
          // ── Chi tiết audio clips ───────────────────────────────
          <div className="space-y-6">
            {/* Lesson info bar */}
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                {selectedLesson.order}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-900 dark:text-white truncate">{selectedLesson.title}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <LevelBadge level={selectedLesson.level} />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{formatDuration(selectedLesson.duration)}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{clips.length} clip</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                selectedLesson.status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {selectedLesson.status === "active" ? "Hoạt động" : selectedLesson.status}
              </span>
            </div>

            {/* Upload form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">cloud_upload</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Thêm audio clip mới</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Drop zone */}
                <label className={`flex flex-col items-center justify-center gap-3 w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  uploadFile
                    ? "border-primary/50 bg-primary/5"
                    : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5"
                }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={e => setUploadFile(e.target.files?.[0] ?? null)}
                  />
                  {uploadFile ? (
                    <>
                      <span className="material-symbols-outlined text-4xl text-primary">audio_file</span>
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary">{uploadFile.name}</p>
                        <p className="text-xs text-slate-500">{(uploadFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={e => { e.preventDefault(); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Xoá file
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-slate-300">cloud_upload</span>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Kéo thả hoặc <span className="text-primary">chọn file</span></p>
                        <p className="text-xs text-slate-400 mt-1">MP3, WAV, OGG, M4A...</p>
                      </div>
                    </>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tên / Chủ đề clip *</label>
                    <input
                      type="text"
                      placeholder="VD: Người phụ nữ đang khóc"
                      value={uploadSubject}
                      onChange={e => setUploadSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Cảm xúc mục tiêu *</label>
                    <select
                      value={uploadEmotion}
                      onChange={e => setUploadEmotion(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                      {EMOTIONS.map(e => {
                        const EMOTION_VI: Record<string, string> = { happiness: "Hạnh phúc", sadness: "Buồn bã", anger: "Tức giận", surprise: "Ngạc nhiên", fear: "Sợ hãi", disgust: "Ghê tởm", neutral: "Bình thản" };
                        return <option key={e} value={e}>{EMOTION_VI[e] ?? e}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleUpload(selectedLesson.id)}
                  disabled={uploading || !uploadFile || !uploadSubject}
                  className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang upload...</>
                  ) : (
                    <><span className="material-symbols-outlined text-base">cloud_upload</span>Tải lên</>
                  )}
                </button>
              </div>
            </div>

            {/* Danh sách clips */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {clipsLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
                </div>
              ) : clips.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">audio_file</span>
                  <p className="text-slate-500 text-sm">Chưa có audio clip nào.</p>
                </div>
              ) : (
                <>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3">STT</th>
                      <th className="px-6 py-3">Chủ đề</th>
                      <th className="px-6 py-3">Cảm xúc</th>
                      <th className="px-6 py-3">Thời lượng</th>
                      <th className="px-6 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedClips.map(clip => {
                      const colors = EMOTION_COLORS[clip.targetEmotion] ?? EMOTION_COLORS.neutral;
                      return (
                        <tr key={clip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 group">
                          <td className="px-6 py-4 text-slate-500">{clip.order}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <span className="material-symbols-outlined text-base">graphic_eq</span>
                              </div>
                              <span className="font-medium text-slate-900 dark:text-slate-100">{clip.subject}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                              {clip.targetEmotion}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{formatDuration(clip.duration)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={`${BASE_URL}${clip.audioUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400"
                                title="Nghe thử"
                              >
                                <span className="material-symbols-outlined text-base">play_circle</span>
                              </a>
                              <button
                                onClick={() => openEditClip(clip)}
                                className="w-8 h-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                title="Sửa clip"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteClip(clip.id)}
                                className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                                title="Xóa"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Pagination page={clipPage} total={clips.length} pageSize={CLIP_PAGE_SIZE} onChange={setClipPage} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal tạo bài học */}
      {showCreateLesson && (
        <Modal title="Tạo bài học mới" onClose={() => setShowCreateLesson(false)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên bài học *</label>
              <input className={inputCls} value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Nhận diện niềm vui" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cấp độ</label>
                <select className={inputCls} value={lessonForm.level} onChange={e => setLessonForm(f => ({ ...f, level: e.target.value }))}>
                  {LEVELS.map(l => <option key={l} value={l}>{l === "beginner" ? "Cơ bản" : l === "intermediate" ? "Trung cấp" : "Nâng cao"}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thời lượng (giây)</label>
                <input className={inputCls} type="number" min="0" value={lessonForm.duration} onChange={e => setLessonForm(f => ({ ...f, duration: e.target.value }))} placeholder="VD: 600" />
              </div>
            </div>
            {lessonError && <p className="text-red-500 text-sm">{lessonError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreateLesson(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Huỷ</button>
              <button onClick={handleCreateLesson} disabled={lessonSaving} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {lessonSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Tạo bài học
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal sửa bài học */}
      {editLesson && (
        <Modal title={`Sửa — ${editLesson.title}`} onClose={() => setEditLesson(null)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên bài học</label>
              <input className={inputCls} value={editLessonForm.title} onChange={e => setEditLessonForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cấp độ</label>
                <select className={inputCls} value={editLessonForm.level} onChange={e => setEditLessonForm(f => ({ ...f, level: e.target.value }))}>
                  {LEVELS.map(l => <option key={l} value={l}>{l === "beginner" ? "Cơ bản" : l === "intermediate" ? "Trung cấp" : "Nâng cao"}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thứ tự</label>
                <input className={inputCls} type="number" min="1" value={editLessonForm.order} onChange={e => setEditLessonForm(f => ({ ...f, order: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thời lượng (giây)</label>
                <input className={inputCls} type="number" min="0" value={editLessonForm.duration} onChange={e => setEditLessonForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trạng thái</label>
                <select className={inputCls} value={editLessonForm.status} onChange={e => setEditLessonForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu</option>
                </select>
              </div>
            </div>
            {editLessonError && <p className="text-red-500 text-sm">{editLessonError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditLesson(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Huỷ</button>
              <button onClick={handleUpdateLesson} disabled={editLessonSaving} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {editLessonSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal sửa audio clip */}
      {editClip && (
        <Modal title={`Sửa clip — ${editClip.subject}`} onClose={() => setEditClip(null)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chủ đề</label>
              <input className={inputCls} value={editClipForm.subject} onChange={e => setEditClipForm(f => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cảm xúc mục tiêu</label>
                <select className={inputCls} value={editClipForm.targetEmotion} onChange={e => setEditClipForm(f => ({ ...f, targetEmotion: e.target.value }))}>
                  {EMOTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thứ tự</label>
                <input className={inputCls} type="number" min="1" value={editClipForm.order} onChange={e => setEditClipForm(f => ({ ...f, order: e.target.value }))} />
              </div>
            </div>
            {editClipError && <p className="text-red-500 text-sm">{editClipError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditClip(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Huỷ</button>
              <button onClick={handleUpdateClip} disabled={editClipSaving} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {editClipSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

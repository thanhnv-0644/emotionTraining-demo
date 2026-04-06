import Link from 'next/link';
import { useEffect, useState, ReactNode } from 'react';
import { api, BASE_URL } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 9;

interface CourseResponse {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  lessonCount: number;
  isFree: boolean;
  price: number;
  status: string;
}

interface CourseForm {
  title: string;
  description: string;
  category: string;
  price: string;
  status: string;
}

const EMPTY_FORM: CourseForm = { title: '', description: '', category: 'easy', price: '0', status: 'draft' };

const LEVELS = ['easy', 'medium', 'advanced'] as const;
const STATUS_OPTIONS = ['draft', 'published', 'archived'];

const LEVEL_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  easy:     { label: 'Cơ bản',     bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  medium:   { label: 'Trung bình', bg: 'bg-amber-100 dark:bg-amber-900/30',    text: 'text-amber-700 dark:text-amber-400',    dot: 'bg-amber-500'   },
  advanced: { label: 'Nâng cao',   bg: 'bg-red-100 dark:bg-red-900/30',        text: 'text-red-700 dark:text-red-400',        dot: 'bg-red-500'     },
};

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_CONFIG[level] ?? { label: level, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'published' | 'draft' | 'archived'>('published');

  // Search, filter & sort
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    api.get<CourseResponse[]>('/api/admin/courses')
      .then(data => setCourses(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = (() => {
    let list = courses.filter(c =>
      c.status?.toLowerCase() === tab &&
      (!search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())) &&
      (!levelFilter || c.category === levelFilter)
    );
    if (sortBy === 'lessons_asc')  list = [...list].sort((a, b) => (a.lessonCount ?? 0) - (b.lessonCount ?? 0));
    if (sortBy === 'lessons_desc') list = [...list].sort((a, b) => (b.lessonCount ?? 0) - (a.lessonCount ?? 0));
    if (sortBy === 'price_asc')    list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortBy === 'price_desc')   list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return list;
  })();
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const count = (s: string) => courses.filter(c => c.status?.toLowerCase() === s).length;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setModal('create');
  };

  const openEdit = (course: CourseResponse) => {
    setForm({
      title: course.title,
      description: course.description ?? '',
      category: course.category ?? 'happiness',
      price: String(course.price ?? 0),
      status: course.status?.toLowerCase() ?? 'draft',
    });
    setEditId(course.id);
    setFormError('');
    setModal('edit');
  };

  const handleCreate = async () => {
    if (!form.title.trim()) { setFormError('Vui lòng nhập tên khoá học'); return; }
    setSaving(true); setFormError('');
    try {
      const created = await api.post<CourseResponse>('/api/admin/courses', {
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseInt(form.price) || 0,
      });
      setCourses(prev => [...prev, created]);
      setModal(null);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Tạo thất bại');
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) { setFormError('Vui lòng nhập tên khoá học'); return; }
    if (!editId) return;
    setSaving(true); setFormError('');
    try {
      const updated = await api.put<CourseResponse>(`/api/admin/courses/${editId}`, {
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseInt(form.price) || 0,
        status: form.status,
      });
      setCourses(prev => prev.map(c => c.id === editId ? updated : c));
      setModal(null);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Cập nhật thất bại');
    } finally { setSaving(false); }
  };

  const handleDelete = async (course: CourseResponse) => {
    if (!confirm(`Xóa khoá học "${course.title}"?`)) return;
    try {
      await api.delete(`/api/admin/courses/${course.id}`);
      setCourses(prev => prev.filter(c => c.id !== course.id));
    } catch {
      alert('Xóa thất bại.');
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Quản lý khoá học</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tạo khoá học
        </button>
      </AppPageHeader>

      <div className="app-content">
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          {(['published', 'draft', 'archived'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setTab(s); setPage(1); }}
              className={`px-4 py-3 text-sm font-bold transition-colors capitalize ${
                tab === s ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {s === 'published' ? 'Đã xuất bản' : s === 'draft' ? 'Nháp' : 'Lưu trữ'} ({count(s)})
            </button>
          ))}
        </div>

        {/* Search, filter & sort */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm khoá học..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-56"
            />
          </div>
          <select
            value={levelFilter}
            onChange={e => { setLevelFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="">Tất cả cấp độ</option>
            {LEVELS.map(l => <option key={l} value={l}>{LEVEL_CONFIG[l].label}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="">Sắp xếp...</option>
            <option value="lessons_desc">Nhiều bài học nhất</option>
            <option value="lessons_asc">Ít bài học nhất</option>
            <option value="price_asc">Giá thấp đến cao</option>
            <option value="price_desc">Giá cao đến thấp</option>
          </select>
          {(search || levelFilter || sortBy) && (
            <button
              onClick={() => { setSearch(''); setLevelFilter(''); setSortBy(''); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Xoá bộ lọc
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">{search || levelFilter ? 'search_off' : 'school'}</span>
            <p className="text-slate-500 mb-4">{search || levelFilter ? 'Không tìm thấy khoá học phù hợp.' : 'Không có khoá học nào.'}</p>
            {!search && !levelFilter && (
              <button onClick={openCreate} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90">
                Tạo khoá học đầu tiên
              </button>
            )}
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.map((course) => (
              <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="h-40 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {course.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${BASE_URL}${course.image}')` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary/40">psychology</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${
                      course.status?.toLowerCase() === 'published' ? 'bg-emerald-500 text-white' :
                      course.status?.toLowerCase() === 'draft' ? 'bg-amber-500 text-white' :
                      'bg-slate-500 text-white'
                    }`}>
                      {course.status === 'published' ? 'Xuất bản' : course.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {(() => {
                      const cfg = LEVEL_CONFIG[course.category] ?? { label: course.category, bg: 'bg-white/90 dark:bg-slate-900/90', text: 'text-slate-700', dot: 'bg-slate-400' };
                      return (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      {course.lessonCount} bài học
                    </span>
                    <span className="font-bold">
                      {course.isFree ? 'Miễn phí' : `${(course.price ?? 0).toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openEdit(course)}
                      className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Sửa
                    </button>
                    <Link
                      href={`/admin/courses/${course.id}/lessons`}
                      className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">audio_file</span>
                      Bài học
                    </Link>
                    <button
                      onClick={() => handleDelete(course)}
                      className="w-9 h-9 rounded-lg border border-red-200 dark:border-red-900/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors flex items-center justify-center"
                      title="Xóa khoá học"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <Modal
          title={modal === 'create' ? 'Tạo khoá học mới' : 'Sửa khoá học'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <Field label="Tên khoá học *">
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Nhận diện cảm xúc cơ bản" />
            </Field>
            <Field label="Mô tả">
              <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả ngắn về khoá học..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cấp độ">
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {LEVELS.map(l => <option key={l} value={l}>{LEVEL_CONFIG[l].label}</option>)}
                </select>
              </Field>
              <Field label="Giá (đ)">
                <input className={inputCls} type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0 = miễn phí" />
              </Field>
            </div>
            {modal === 'edit' && (
              <Field label="Trạng thái">
                <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s === 'published' ? 'Xuất bản' : s === 'draft' ? 'Nháp' : 'Lưu trữ'}</option>
                  ))}
                </select>
              </Field>
            )}
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Huỷ
              </button>
              <button
                onClick={modal === 'create' ? handleCreate : handleUpdate}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {modal === 'create' ? 'Tạo khoá học' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

AdminCourses.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;

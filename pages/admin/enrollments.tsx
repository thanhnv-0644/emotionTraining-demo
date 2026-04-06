import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

interface EnrollmentResponse {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  paymentId: string | null;
  status: string;
  createdAt: string;
}

interface UserOption { id: string; name: string; email: string; }
interface CourseOption { id: string; title: string; }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
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

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [formUserId, setFormUserId] = useState('');
  const [formCourseId, setFormCourseId] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get<EnrollmentResponse[]>('/api/admin/enrollments'),
      api.get<UserOption[]>('/api/admin/users'),
      api.get<CourseOption[]>('/api/admin/courses'),
    ]).then(([e, u, c]) => {
      setEnrollments(e ?? []);
      setUsers(u ?? []);
      setCourses(c ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = enrollments.filter(e =>
    e.userName?.toLowerCase().includes(search.toLowerCase()) ||
    e.courseTitle?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleEnroll = async () => {
    if (!formUserId || !formCourseId) { setFormError('Vui lòng chọn học viên và khoá học'); return; }
    setSaving(true); setFormError('');
    try {
      const created = await api.post<EnrollmentResponse>('/api/admin/enrollments', {
        userId: formUserId,
        courseId: formCourseId,
      });
      setEnrollments(prev => [created, ...prev]);
      setShowModal(false);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Ghi danh thất bại');
    } finally { setSaving(false); }
  };

  const handleRevoke = async (enrollment: EnrollmentResponse) => {
    if (!confirm(`Huỷ ghi danh của "${enrollment.userName}" khỏi "${enrollment.courseTitle}"?`)) return;
    try {
      await api.delete(`/api/admin/enrollments/${enrollment.id}`);
      setEnrollments(prev => prev.filter(e => e.id !== enrollment.id));
    } catch {
      alert('Huỷ thất bại.');
    }
  };

  const openModal = () => {
    setFormUserId(users[0]?.id ?? '');
    setFormCourseId(courses[0]?.id ?? '');
    setFormError('');
    setShowModal(true);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Ghi danh</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Ghi danh học viên
        </button>
      </AppPageHeader>

      <div className="app-content">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm theo học viên hoặc khoá học..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Học viên</th>
                  <th className="px-6 py-4">Khoá học</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày ghi danh</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      {search ? 'Không tìm thấy.' : 'Chưa có ghi danh nào.'}
                    </td>
                  </tr>
                ) : (
                  paginated.map(enr => (
                    <tr key={enr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{enr.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-400 text-base">school</span>
                          <span className="line-clamp-1">{enr.courseTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          enr.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {enr.status === 'active' ? 'Đang học' : enr.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRevoke(enr)}
                          className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors ml-auto"
                          title="Huỷ ghi danh"
                        >
                          <span className="material-symbols-outlined text-base">person_remove</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </div>

      {showModal && (
        <Modal title="Ghi danh học viên" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Học viên</label>
              <select className={inputCls} value={formUserId} onChange={e => setFormUserId(e.target.value)}>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Khoá học</label>
              <select className={inputCls} value={formCourseId} onChange={e => setFormCourseId(e.target.value)}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Huỷ</button>
              <button
                onClick={handleEnroll}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Xác nhận ghi danh
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

AdminEnrollments.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
